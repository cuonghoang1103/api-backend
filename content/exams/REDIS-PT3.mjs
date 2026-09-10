/**
 * Redis — Progress Test 3 (chương s09–s12).
 *
 * Đề tự soạn, bám sát giáo trình `content/courses/redis/s09…s12`. 30 câu trắc
 * nghiệm + 2 câu lập trình làm ngay trong phòng thi (chấm bằng AI theo rubric).
 *
 * ⚠️ MỌI con số, mọi `CONFIG GET`, mọi thông điệp lỗi và mọi hành vi đẩy khoá
 * trong đề đều CHẠY THẬT trên máy chủ nháp dựng bằng
 * `docker run -d --name redis-de-thi-pt -p 63799:6379 redis:7-alpine`,
 * báo `redis_version:7.4.9`. Phần nhân bản đo trên một replica THẬT (container
 * thứ hai `--replicaof`, `master_link_status:up`); phần Cluster đo trên một
 * container thứ ba khởi động bằng `--cluster-enabled yes`. Cả ba container đã
 * `docker rm -f` sau khi đo xong.
 *
 * ⚠️ HAI CHỖ MÁY KHÁC GIÁO TRÌNH — đề lấy theo MÁY:
 *   • Bài 11.4 in `CLUSTER KEYSLOT user:1042` → 9842, `session:abc` → 3009, và
 *     `{u1042}:profile` → 4011. Máy trả **10999**, **14788** và **15977**. Đã
 *     kiểm chéo bằng cách tự cài CRC16-CCITT (XMODEM) trong Node và tính lại
 *     ngoài Redis: sáu khoá, sáu số, khớp máy chủ từng số một. Vậy các con số
 *     trong bài học là sai, còn quy tắc thì đúng — hai khoá cùng thẻ băm
 *     `{u1042}` rơi vào CÙNG một slot.
 *   • Bài 9.2 in `OBJECT FREQ hot` = 8 sau 200 lượt đọc. Máy trả **10**. Bộ đếm
 *     LFU là logarit và có suy giảm theo thời gian nên con số cụ thể phụ thuộc
 *     nhịp đọc; điều bài học nói đúng là "200 lượt đọc KHÔNG ra 200" và "khoá
 *     mới bắt đầu ở 5" — cả hai đều đo lại đúng (khoá vừa tạo: `OBJECT FREQ` = 5).
 *     Đề vì thế hỏi CƠ CHẾ, không hỏi con số 8 hay 10.
 *
 * ⚠️ ĐỀ KHÔNG HỎI SỐ ĐO THỜI GIAN (máy đo đang chạy nhiều việc song song). Câu
 * về fork, về độ trễ và về thời gian nạp AOF đều hỏi DẤU HIỆU và CƠ CHẾ chứ
 * không hỏi mili giây. Các con số bộ nhớ chỉ dùng để so hai trạng thái của cùng
 * một instance trong cùng một phép đo.
 *
 * Phân bố: s09 ×8 · s10 ×7 · s11 ×7 · s12 ×8 = 30 câu trắc nghiệm, cộng 2 câu
 * lập trình (mô phỏng tám chính sách đẩy khoá — chương 9; quorum so với đa số
 * của Sentinel — chương 11).
 * Vị trí đáp án A/B/C/D = 7/8/8/7 (đếm bằng lệnh trong CLAUDE.md).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/REDIS-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/redis-exam-kit.mjs';

export default {
  course: { slug: 'redis' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9–12 (memory, persistence, operations, scaling, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 9–12 (bộ nhớ, lưu lâu dài, vận hành, mở rộng, chẩn đoán)',
      ),
      description: B(
        'The last third of the Redis course: where the memory goes, the eight eviction policies, RDB and AOF and the durability posture you are choosing, configuration, network exposure and ACLs, replication, Sentinel and Cluster, and the numeric signature of every common failure. 30 multiple-choice questions plus 2 coding questions you write here in the exam room.',
        'Một phần ba cuối của khoá Redis: bộ nhớ đi đâu, tám chính sách đẩy khoá, RDB và AOF cùng tư thế bền vững mà bạn đang chọn, cấu hình, phơi bày mạng và ACL, nhân bản, Sentinel và Cluster, và dấu hiệu bằng số của mọi sự cố thường gặp. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        // ── Chương 9 — Bộ nhớ, đẩy khoá, lưu lâu dài ────────────────────
        mcq({
          prompt: B(
            '<code>INFO memory</code> reports four different numbers. Which pair of statements is correct?' + code(
              'used_memory_human:1.20G\n' +
              'used_memory_rss_human:1.61G\n' +
              'used_memory_dataset:1058291720\n' +
              'used_memory_peak_human:2.84G',
            ),
            '<code>INFO memory</code> báo bốn con số khác nhau. Cặp phát biểu nào ĐÚNG?' + code(
              'used_memory_human:1.20G\n' +
              'used_memory_rss_human:1.61G\n' +
              'used_memory_dataset:1058291720\n' +
              'used_memory_peak_human:2.84G',
            ),
          ),
          options: [
            B('Eviction is measured against <code>used_memory_rss</code>, and you size the machine from the current value', 'Việc đẩy khoá được đo theo <code>used_memory_rss</code>, còn máy thì cỡ theo giá trị hiện tại'),
            B('Eviction is measured against <code>used_memory</code>, and you size the machine from <code>used_memory_peak</code>', 'Việc đẩy khoá được đo theo <code>used_memory</code>, còn máy thì cỡ theo <code>used_memory_peak</code>'),
            B('Eviction is measured against <code>used_memory_dataset</code>, so overhead never counts toward the limit', 'Việc đẩy khoá được đo theo <code>used_memory_dataset</code>, nên phần phí tổn không bao giờ tính vào trần'),
            B('All four are the same measurement at different resolutions, so any of them can be used for sizing', 'Cả bốn là cùng một phép đo ở các độ phân giải khác nhau, nên dùng cái nào để cỡ máy cũng được'),
          ],
          correct: 1,
          explanation: EX(
            '<code>used_memory</code> is what Redis asked the allocator for, and it is the number <code>maxmemory</code> is compared against — so client output buffers, the replication backlog and the keyspace dictionary all count toward the limit even though none of them is your data. <code>used_memory_rss</code> is what the kernel sees, which is higher when the allocator holds freed pages and <em>lower</em> when part of the process has been swapped out. <code>used_memory_dataset</code> is your keys and values alone: here 1.06 GB inside a 1.20 GB process, so 18% is overhead. And <code>used_memory_peak</code> is the high-water mark, which is what a machine must be sized against — a nightly import or one large union sets the real requirement, not the average.',
            '<code>used_memory</code> là lượng Redis đã xin bộ cấp phát, và nó chính là con số mà <code>maxmemory</code> đem ra so — nên bộ đệm ra của client, vùng tồn đọng nhân bản và từ điển không gian khoá đều tính vào trần, dù chẳng cái nào là dữ liệu của bạn. <code>used_memory_rss</code> là thứ nhân hệ điều hành thấy, cao hơn khi bộ cấp phát còn giữ các trang đã giải phóng, và THẤP HƠN khi một phần tiến trình bị tráo ra đĩa. <code>used_memory_dataset</code> là riêng khoá và giá trị của bạn: ở đây 1,06 GB nằm trong một tiến trình 1,20 GB, tức 18% là phí tổn. Còn <code>used_memory_peak</code> là mốc cao nhất, và đó mới là thứ để cỡ máy — một đợt nhập ban đêm hay một phép hợp lớn mới đặt ra yêu cầu thật, chứ không phải giá trị trung bình.',
          ),
        }),

        mcq({
          prompt: B(
            'An instance reports <code>mem_fragmentation_ratio:0.85</code>. What does that mean, and what is the right response?',
            'Một instance báo <code>mem_fragmentation_ratio:0.85</code>. Điều đó nghĩa là gì, và phản ứng đúng là gì?',
          ),
          options: [
            B('A reporting artefact that always appears right after a restart and can safely be ignored', 'Một hiện tượng báo cáo luôn xuất hiện ngay sau khi khởi động lại và có thể yên tâm bỏ qua'),
            B('Excellent compaction: the allocator is packing memory tighter than requested, so there is nothing to do', 'Nén rất tốt: bộ cấp phát đang gói bộ nhớ chặt hơn mức được xin, nên không phải làm gì cả'),
            B('Ordinary fragmentation for a busy instance — turn on <code>activedefrag</code> and it will settle', 'Phân mảnh bình thường của một instance bận — hãy bật <code>activedefrag</code> rồi nó sẽ ổn'),
            B('RSS is BELOW used_memory: part of Redis has been swapped to disk — reduce memory or add RAM', 'RSS THẤP HƠN used_memory: một phần Redis đã bị tráo ra đĩa — hãy giảm bộ nhớ hoặc thêm RAM'),
          ],
          correct: 3,
          explanation: EX(
            'The ratio is RSS divided by <code>used_memory</code>, so below 1.0 means the kernel is holding less resident memory than Redis believes it allocated — the difference is on disk. That is the worst thing that can happen to a single-threaded server: touching a swapped page stalls for milliseconds and blocks every other client, turning a memory problem into a latency catastrophe. Read the ratio as three bands: 1.0–1.1 is healthy and there is nothing to fix; above roughly 1.5 is genuine fragmentation that <code>activedefrag</code> can reclaim by relocating live objects; below 1.0 is an emergency you fix with RAM, not with tuning. And the ratio means nothing at all on a freshly restarted or nearly empty instance, so do not page anyone for a ninety-second spike after a flush.',
            'Tỷ số này là RSS chia cho <code>used_memory</code>, nên dưới 1,0 nghĩa là nhân hệ điều hành đang giữ ít bộ nhớ thường trú hơn lượng Redis tin là mình đã cấp phát — phần chênh nằm trên đĩa. Đó là điều tệ nhất có thể xảy ra với một máy chủ đơn luồng: chạm vào một trang đã bị tráo là khựng vài mili giây và chặn mọi client khác, biến một vấn đề bộ nhớ thành một thảm hoạ độ trễ. Hãy đọc tỷ số này theo ba dải: 1,0–1,1 là khoẻ mạnh và không có gì để sửa; trên khoảng 1,5 là phân mảnh thật, <code>activedefrag</code> có thể đòi lại bằng cách dời các đối tượng còn sống; dưới 1,0 là tình huống khẩn cấp phải chữa bằng RAM chứ không phải bằng tinh chỉnh. Và tỷ số này chẳng có ý nghĩa gì trên một instance vừa khởi động lại hoặc gần như rỗng, nên đừng gọi ai dậy vì một cú vọt chín mươi giây sau một lần xoá sạch.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9. The same 30,000 keys, none of which has a TTL, and the same <code>maxmemory</code> set just below current usage. Only the policy changed between the two blocks.' + code(
              'maxmemory-policy volatile-lru\n' +
              '> SET probeA1 <200 bytes>   (error) OOM command not allowed when used memory > &#39;maxmemory&#39;.\n' +
              '> SET probeA2 <200 bytes>   (error) OOM …\n' +
              '\n' +
              'maxmemory-policy allkeys-lru      (nothing else changed)\n' +
              '> SET probeB1 <200 bytes>   OK\n' +
              '> SET probeB2 <200 bytes>   OK        evicted_keys rose by 1562',
            ) + 'What does this demonstrate?',
            'Đo thật trên Redis 7.4.9. Vẫn 30.000 khoá đó, không khoá nào có TTL, và cùng một <code>maxmemory</code> đặt thấp hơn mức đang dùng một chút. Giữa hai khối chỉ có chính sách là thay đổi.' + code(
              'maxmemory-policy volatile-lru\n' +
              '> SET probeA1 <200 byte>    (error) OOM command not allowed when used memory > &#39;maxmemory&#39;.\n' +
              '> SET probeA2 <200 byte>    (error) OOM …\n' +
              '\n' +
              'maxmemory-policy allkeys-lru      (ngoài ra không đổi gì)\n' +
              '> SET probeB1 <200 byte>    OK\n' +
              '> SET probeB2 <200 byte>    OK        evicted_keys tăng thêm 1562',
            ) + 'Phép đo này chứng minh điều gì?',
          ),
          options: [
            B('<code>volatile-lru</code> tracks access time less accurately, so it needed more samples before it could pick a victim', '<code>volatile-lru</code> theo dõi thời điểm truy cập kém chính xác hơn, nên nó cần thêm mẫu mới chọn được nạn nhân'),
            B('Every <code>volatile-*</code> policy considers only keys that have a TTL, so with none it behaves exactly like <code>noeviction</code>', 'Mọi chính sách <code>volatile-*</code> chỉ xét những khoá CÓ TTL, nên khi không có cái nào nó hành xử đúng như <code>noeviction</code>'),
            B('<code>volatile-lru</code> requires <code>maxmemory-samples</code> to be raised above its default of 5 before it evicts anything', '<code>volatile-lru</code> đòi phải nâng <code>maxmemory-samples</code> lên trên mặc định là 5 thì mới đẩy được khoá nào'),
            B('The OOM errors came from the write being larger than the free space, and a smaller value would have succeeded', 'Lỗi OOM đến từ việc lượt ghi lớn hơn chỗ trống còn lại, và một giá trị nhỏ hơn thì đã thành công'),
          ],
          correct: 1,
          explanation: EX(
            'This is the volatile trap, and it is dangerous precisely because the configuration reads as safe. <code>volatile-lru</code>, <code>volatile-lfu</code>, <code>volatile-random</code> and <code>volatile-ttl</code> all restrict the candidate pool to keys carrying an expiry; when nothing is eligible, Redis finds no victim and starts refusing writes with <code>OOM</code> while reads keep working. An instance configured this way where somebody forgot the TTLs looks perfectly healthy for months and then hard-fails the first time it fills. The setting is genuinely useful — it is how you mix a cache and a queue on one instance, because only the cache keys carry TTLs and only they can be evicted — but that discipline is one forgotten <code>EX</code> away from failing, so alert when a cache prefix loses its TTL coverage.',
            'Đây là cái bẫy volatile, và nó nguy hiểm chính vì cấu hình đọc lên nghe rất an toàn. <code>volatile-lru</code>, <code>volatile-lfu</code>, <code>volatile-random</code> và <code>volatile-ttl</code> đều thu hẹp danh sách ứng viên về những khoá CÓ mang hạn; khi không cái nào đủ điều kiện, Redis không tìm được nạn nhân nào và bắt đầu từ chối lệnh ghi bằng <code>OOM</code> trong khi lệnh đọc vẫn chạy ngon. Một instance cấu hình như vậy mà ai đó quên đặt TTL sẽ trông rất khoẻ mạnh suốt nhiều tháng rồi hỏng gãy vào đúng lần đầu tiên nó đầy. Bản thân thiết lập này thật sự hữu ích — nó là cách trộn một bộ đệm với một hàng đợi trên cùng một instance, vì chỉ khoá bộ đệm mang TTL và chỉ chúng mới bị đẩy đi — nhưng kỷ luật ấy chỉ cách một lệnh <code>EX</code> bị quên là sập, nên hãy đặt cảnh báo khi một tiền tố bộ đệm mất độ phủ TTL.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 under <code>allkeys-lfu</code>: a key read two hundred times reports <code>OBJECT FREQ</code> in the low tens, and a key just created reports 5. Which reading is correct?',
            'Đo thật trên Redis 7.4.9 dưới chính sách <code>allkeys-lfu</code>: một khoá được đọc hai trăm lần báo <code>OBJECT FREQ</code> ở mức mươi mấy, còn một khoá vừa tạo báo 5. Cách đọc nào ĐÚNG?',
          ),
          options: [
            B('<code>OBJECT FREQ</code> reports accesses per minute, so 200 reads inside one minute are compressed into that range', '<code>OBJECT FREQ</code> báo số lượt truy cập mỗi phút, nên 200 lượt đọc trong một phút bị nén về khoảng đó'),
            B('The counter saturates at 16, which is why a hot key and a lukewarm key become indistinguishable at scale', 'Bộ đếm bão hoà ở 16, vì thế một khoá nóng và một khoá âm ấm trở nên không phân biệt được ở quy mô lớn'),
            B('The counter is logarithmic and decays over time, and a new key starts at 5 so it is not evicted immediately', 'Bộ đếm là logarit và suy giảm theo thời gian, còn khoá mới bắt đầu ở 5 để không bị đẩy đi ngay lập tức'),
            B('The 5 is a placeholder shown until the first access; the real counter only begins after a key is read once', 'Số 5 chỉ là chỗ giữ hiện ra tới lần truy cập đầu tiên; bộ đếm thật chỉ bắt đầu sau khi khoá được đọc một lần'),
          ],
          correct: 2,
          explanation: EX(
            'Each hit increments probabilistically, with the probability falling as the counter rises, so a key accessed a million times and one accessed ten thousand times land close together — which is exactly what you want for <em>ranking</em> rather than counting. New keys start at 5 as a deliberate grace period: starting at zero would evict every newly created key immediately, before it had a chance to prove itself. And <code>lfu-decay-time</code> (default 1 minute) walks the counter back down, so last Tuesday\'s popularity fades. Choose LFU over LRU when your tail gets scanned — a crawler or a batch job walking the whole catalogue fools LRU into evicting genuinely hot keys, while those one-touch pages never build up a frequency. Note the commands are policy-bound: <code>OBJECT FREQ</code> errors under an LRU policy and <code>OBJECT IDLETIME</code> errors under LFU.',
            'Mỗi lượt trúng làm bộ đếm tăng theo xác suất, và xác suất ấy giảm dần khi bộ đếm lên cao, nên một khoá được truy cập một triệu lần và một khoá mười nghìn lần rơi vào gần nhau — đúng thứ bạn cần để XẾP HẠNG chứ không phải để đếm. Khoá mới bắt đầu ở 5 như một khoảng ân hạn có chủ đích: bắt đầu từ không thì mọi khoá vừa tạo đều bị đẩy đi ngay, trước khi kịp chứng minh gì. Và <code>lfu-decay-time</code> (mặc định 1 phút) kéo bộ đếm đi xuống, nên độ nổi tiếng của thứ Ba tuần trước sẽ phai. Hãy chọn LFU thay LRU khi phần đuôi dữ liệu của bạn bị quét — một con bọ thu thập hay một việc chạy lô đi hết cả danh mục sẽ lừa LRU đẩy đi những khoá thật sự nóng, còn với LFU thì các trang chạm-một-lần ấy không bao giờ tích được tần suất. Chú ý hai lệnh này gắn với chính sách: <code>OBJECT FREQ</code> báo lỗi dưới chính sách LRU, và <code>OBJECT IDLETIME</code> báo lỗi dưới LFU.',
          ),
        }),

        mcq({
          prompt: B(
            'An AOF rewrite becomes due while an RDB background save is already running. What does Redis do, and why?',
            'Một lượt viết lại AOF tới hạn trong khi một lượt lưu RDB nền đang chạy. Redis làm gì, và vì sao?',
          ),
          options: [
            B('It cancels the running save, because the AOF is authoritative on startup and takes priority', 'Nó huỷ lượt lưu đang chạy, vì AOF mới là thứ có thẩm quyền lúc khởi động nên được ưu tiên'),
            B('It forks a second child, since the two children write different files and cannot conflict', 'Nó fork thêm một tiến trình con thứ hai, vì hai tiến trình con ghi hai file khác nhau nên không thể xung đột'),
            B('It defers the rewrite (<code>aof_pending_rewrite</code>), because two children copying pages at once can OOM the host', 'Nó hoãn lượt viết lại (<code>aof_pending_rewrite</code>), vì hai tiến trình con cùng sao chép trang có thể làm máy chủ hết bộ nhớ'),
            B('It performs the rewrite in the main thread instead, which is slower but avoids the memory spike entirely', 'Nó viết lại ngay trong luồng chính, chậm hơn nhưng tránh hẳn được cú vọt bộ nhớ'),
          ],
          correct: 2,
          explanation: EX(
            'A rewrite is a second fork with exactly the same copy-on-write bill as a snapshot: the child writes a fresh base file from its frozen view while the parent keeps appending to a new incr file, and every 4 KB page the parent modifies must be duplicated. On a write-heavy instance that transient RSS can rise 30–50%, and the kernel\'s OOM killer takes the largest process — the Redis parent, not the child. Two children doing it simultaneously is how a spike becomes a kill, so Redis queues the rewrite instead. The same arithmetic is why <code>maxmemory</code> belongs at roughly 60–70% of machine RAM rather than 95%, and why <code>vm.overcommit_memory=1</code> is mandatory: with the default the kernel heuristically refuses a fork that <em>might</em> need more than is free, so background saves fail on a machine with plenty of RAM.',
            'Một lượt viết lại là một cú fork thứ hai với đúng cái hoá đơn sao-chép-khi-ghi của một lần chụp ảnh: tiến trình con ghi một file nền mới từ khung nhìn đông cứng của nó trong khi tiến trình cha vẫn nối thêm vào một file incr mới, và mỗi trang 4 KB mà cha sửa đều phải nhân đôi. Trên một instance ghi nhiều, phần RSS nhất thời ấy có thể vọt lên 30–50%, và bộ giết-vì-hết-bộ-nhớ của nhân sẽ tóm tiến trình LỚN NHẤT — tức tiến trình cha của Redis, chứ không phải con. Hai tiến trình con cùng làm chuyện đó một lúc chính là cách một cú vọt biến thành một cú giết, nên Redis xếp hàng lượt viết lại lại. Cũng phép tính ấy là lý do <code>maxmemory</code> nên nằm ở khoảng 60–70% RAM máy chứ không phải 95%, và là lý do <code>vm.overcommit_memory=1</code> là bắt buộc: với giá trị mặc định, nhân sẽ theo cảm tính từ chối một cú fork CÓ THỂ cần nhiều hơn chỗ trống, nên lệnh lưu nền hỏng ngay trên một máy còn thừa RAM.',
          ),
        }),

        mcq({
          prompt: B(
            'A restart of an AOF-enabled instance took nine seconds, and the log attributes 1.2 s to the base file and 8.0 s to the incr file — for the same data. Why the gap, and what follows from it?',
            'Một lần khởi động lại instance có bật AOF mất chín giây, và log quy 1,2 giây cho file nền và 8,0 giây cho file incr — với cùng một lượng dữ liệu. Vì sao chênh nhau, và suy ra được gì?',
          ),
          options: [
            B('The incr file is not compressed, so the difference is disk throughput and a faster disk removes it', 'File incr không được nén, nên chênh lệch là do thông lượng đĩa và một cái đĩa nhanh hơn sẽ xoá bỏ nó'),
            B('The incr file is verified with a CRC64 checksum per command, which dominates the load time', 'File incr được kiểm bằng tổng kiểm CRC64 cho từng lệnh, và việc đó chiếm phần lớn thời gian nạp'),
            B('The base file is loaded lazily in the background, so its 1.2 s is only the time to open it', 'File nền được nạp lười ở chế độ nền, nên 1,2 giây kia chỉ là thời gian mở nó ra'),
            B('The base file is an RDB that is deserialised, while the incr file is a command log that is re-executed', 'File nền là một RDB được giải tuần tự hoá, còn file incr là nhật ký lệnh phải được THỰC THI LẠI'),
          ],
          correct: 3,
          explanation: EX(
            'Loading an RDB is deserialising a compact binary format; loading an AOF means executing every recorded command again through the normal command path, which is why the log records commands rather than state — a counter incremented a million times is a million entries describing one integer. Three consequences follow. That nine seconds is downtime: Redis answers <code>-LOADING</code> to everything while it loads, and a stampede of clients reconnecting at once can stretch it further. Keeping <code>auto-aof-rewrite-percentage</code> at its default matters, because a recently rewritten AOF has a small incr file and starts far faster than one that has been accumulating for a week. And you should measure this number on your real dataset before planning a failover, rather than discovering it during one.',
            'Nạp một file RDB là giải tuần tự hoá một định dạng nhị phân gọn; còn nạp AOF là THỰC THI LẠI mọi câu lệnh đã ghi qua đúng đường xử lý lệnh bình thường — vì nhật ký ghi LỆNH chứ không ghi TRẠNG THÁI, nên một bộ đếm tăng một triệu lần là một triệu dòng để mô tả một số nguyên. Từ đó suy ra ba điều. Chín giây ấy là thời gian chết: Redis trả lời <code>-LOADING</code> cho mọi thứ trong lúc nạp, và một đám client cùng nối lại một lúc còn kéo dài nó thêm. Giữ <code>auto-aof-rewrite-percentage</code> ở mặc định là quan trọng, vì một AOF vừa được viết lại có file incr nhỏ và khởi động nhanh hơn hẳn một file đã tích luỹ cả tuần. Và bạn nên ĐO con số này trên dữ liệu thật của mình trước khi lên kế hoạch chuyển vai, thay vì phát hiện ra nó giữa lúc đang chuyển.',
          ),
        }),

        mcq({
          prompt: B(
            'At 3am every write starts failing with' + code(
              'MISCONF Redis is configured to save RDB snapshots, but it is currently unable to persist to disk…',
            ) + 'while reads work perfectly. What is the correct first move?',
            'Lúc 3 giờ sáng mọi lượt ghi bắt đầu hỏng với' + code(
              'MISCONF Redis is configured to save RDB snapshots, but it is currently unable to persist to disk…',
            ) + 'trong khi lệnh đọc vẫn chạy hoàn hảo. Nước đi ĐẦU TIÊN đúng là gì?',
          ),
          options: [
            B('Run <code>FLUSHDB ASYNC</code> to free disk space, which is what the save is short of', 'Chạy <code>FLUSHDB ASYNC</code> để giải phóng chỗ đĩa, đúng thứ mà lượt lưu đang thiếu'),
            B('Set <code>stop-writes-on-bgsave-error no</code> so writes resume while you investigate calmly', 'Đặt <code>stop-writes-on-bgsave-error no</code> để lệnh ghi chạy lại trong lúc bạn bình tĩnh điều tra'),
            B('Restart Redis, because the error clears on startup and the save points are re-evaluated', 'Khởi động lại Redis, vì lỗi này tự hết khi khởi động và các mốc lưu được xét lại'),
            B('Read the real error from the Redis log, check the data directory\'s disk and ownership, then fix that', 'Đọc lỗi thật trong log của Redis, kiểm tra đĩa và quyền sở hữu của thư mục dữ liệu, rồi sửa đúng chỗ đó'),
          ],
          correct: 3,
          explanation: EX(
            'That setting exists so an instance which cannot persist stops pretending it can: rather than accepting writes it knows will vanish, it refuses them loudly. Turning it off makes the message disappear while the real cause — a full disk, a read-only mount, wrong ownership after a deploy, or a fork that could not allocate — carries on silently, and every write is now accepted into memory with no durable copy behind it. Redis always logs the underlying error just above the MISCONF, so read that, check <code>df -h</code> on the <code>dir</code> path, check ownership, check <code>vm.overcommit_memory</code>, fix it, and confirm with a manual <code>BGSAVE</code> that <code>rdb_last_bgsave_status</code> returns to <code>ok</code> — at which point writes resume by themselves. The only defensible time to set it to <code>no</code> is on an instance that is deliberately a pure cache with <code>save &quot;&quot;</code> and no persistence wanted at all.',
            'Thiết lập đó tồn tại để một instance không lưu được thì thôi giả vờ là lưu được: thay vì nhận những lượt ghi mà nó biết sẽ bốc hơi, nó từ chối thật to. Tắt nó đi thì thông điệp biến mất còn nguyên nhân thật — đĩa đầy, một điểm gắn chỉ-đọc, sai quyền sở hữu sau một lần deploy, hay một cú fork không cấp phát nổi — vẫn âm thầm tiếp diễn, và giờ mọi lượt ghi được nhận vào bộ nhớ mà chẳng có bản bền vững nào phía sau. Redis luôn ghi lỗi gốc ngay phía trên dòng MISCONF, nên hãy đọc nó, kiểm <code>df -h</code> trên đường dẫn <code>dir</code>, kiểm quyền sở hữu, kiểm <code>vm.overcommit_memory</code>, sửa đúng chỗ ấy, rồi xác nhận bằng một lệnh <code>BGSAVE</code> tay cho tới khi <code>rdb_last_bgsave_status</code> trở lại <code>ok</code> — lúc đó lệnh ghi tự chạy lại. Lần duy nhất đặt nó thành <code>no</code> mà biện minh được là trên một instance cố ý làm bộ đệm thuần, đã đặt <code>save &quot;&quot;</code> và hoàn toàn không muốn lưu lâu dài.',
          ),
        }),

        mcq({
          prompt: B(
            'A restore procedure stops Redis, copies a verified <code>dump.rdb</code> into the data directory with the right owner, and starts the server. <code>DBSIZE</code> comes back with the <em>old</em> contents and the restored data is nowhere. The instance runs with <code>appendonly yes</code>. What was missed?',
            'Một quy trình khôi phục dừng Redis, chép một file <code>dump.rdb</code> đã kiểm vào thư mục dữ liệu với đúng chủ sở hữu, rồi khởi động máy chủ. <code>DBSIZE</code> trả về nội dung CŨ và dữ liệu vừa khôi phục thì không thấy đâu. Instance đang chạy với <code>appendonly yes</code>. Bước nào đã bị bỏ sót?',
          ),
          options: [
            B('With AOF enabled Redis loads <code>appendonlydir/</code> and ignores the RDB — move it aside first', 'Khi bật AOF thì Redis nạp <code>appendonlydir/</code> và bỏ qua file RDB — phải dời nó sang chỗ khác trước'),
            B('The RDB must be renamed to match <code>dbfilename</code>, which defaults to <code>redis.rdb</code> rather than <code>dump.rdb</code>', 'File RDB phải được đổi tên cho khớp <code>dbfilename</code>, mà mặc định là <code>redis.rdb</code> chứ không phải <code>dump.rdb</code>'),
            B('A restored RDB must be registered with <code>DEBUG RELOAD</code> before Redis will consider it on startup', 'Một file RDB khôi phục phải được đăng ký bằng <code>DEBUG RELOAD</code> thì Redis mới xét tới nó lúc khởi động'),
            B('The file needs <code>redis-check-rdb --fix</code> after copying, because the checksum covers the original path', 'File cần chạy <code>redis-check-rdb --fix</code> sau khi chép, vì tổng kiểm có tính cả đường dẫn gốc'),
          ],
          correct: 0,
          explanation: EX(
            'When <code>appendonly yes</code>, the AOF is authoritative on startup and the RDB is not consulted at all — so a restore that carefully places a dump file and starts the server appears to do nothing, because the old AOF is still there and still wins. Move <code>appendonlydir/</code> aside before starting, confirm <code>DBSIZE</code> and a few known keys before letting traffic in, and only then re-enable AOF with <code>CONFIG SET appendonly yes</code>, which triggers an immediate rewrite from the now-current data and builds a fresh, correct directory. That is the supported order — editing the config and restarting again is not. Keep the old directory until you are certain, and remember that <code>CONFIG SET</code> alone reverts on the next restart unless you follow it with <code>CONFIG REWRITE</code>.',
            'Khi <code>appendonly yes</code> thì AOF là thứ có thẩm quyền lúc khởi động và file RDB hoàn toàn không được ngó tới — nên một cuộc khôi phục cẩn thận đặt file dump vào rồi khởi động máy chủ trông như chẳng làm gì cả, vì file AOF cũ vẫn nằm đó và vẫn thắng. Hãy dời <code>appendonlydir/</code> sang chỗ khác TRƯỚC khi khởi động, xác nhận <code>DBSIZE</code> và vài khoá đã biết trước khi cho lưu lượng vào, rồi mới bật lại AOF bằng <code>CONFIG SET appendonly yes</code> — lệnh này kích hoạt ngay một lượt viết lại từ dữ liệu hiện tại và dựng một thư mục mới, đúng đắn. Đó mới là thứ tự được hỗ trợ; sửa file cấu hình rồi khởi động lại lần nữa thì không. Hãy giữ thư mục cũ cho tới khi chắc chắn, và nhớ rằng chỉ <code>CONFIG SET</code> thôi thì sẽ mất khi khởi động lại, trừ khi bạn theo sau bằng <code>CONFIG REWRITE</code>.',
          ),
        }),

        // ── Chương 10 — Vận hành, bảo mật, ACL ──────────────────────────
        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on a server started with command-line flags and no config file. What does the pair of replies imply for operations?' + code(
              '> INFO server\n' +
              'config_file:\n' +
              '> CONFIG REWRITE\n' +
              '(error) ERR The server is running without a config file',
            ),
            'Chạy thật trên Redis 7.4.9, trên một máy chủ khởi động bằng cờ dòng lệnh và không có file cấu hình. Cặp trả lời này hàm ý gì cho vận hành?' + code(
              '> INFO server\n' +
              'config_file:\n' +
              '> CONFIG REWRITE\n' +
              '(error) ERR The server is running without a config file',
            ),
          ),
          options: [
            B('The instance is read-only until a config file is supplied, which is why the rewrite was refused', 'Instance này chỉ-đọc cho tới khi có một file cấu hình, và đó là lý do lệnh viết lại bị từ chối'),
            B('Nothing can be persisted by <code>CONFIG SET</code> here, so every runtime change is lost on restart', 'Ở đây <code>CONFIG SET</code> không lưu lại được gì, nên mọi thay đổi lúc chạy đều mất khi khởi động lại'),
            B('The empty <code>config_file</code> means Redis loaded its defaults from <code>/etc/redis/redis.conf</code> anyway', '<code>config_file</code> rỗng nghĩa là Redis vẫn nạp mặc định từ <code>/etc/redis/redis.conf</code>'),
            B('<code>CONFIG REWRITE</code> only works on a replica, because a primary must not rewrite its own configuration', '<code>CONFIG REWRITE</code> chỉ chạy được trên replica, vì máy chính không được phép tự viết lại cấu hình của nó'),
          ],
          correct: 1,
          explanation: EX(
            'Configuration reaches Redis from four places in order — the file, command-line flags, <code>CONFIG SET</code> at runtime, and <code>CONFIG REWRITE</code> writing the live values back — and the last one is the only thing that closes the loop. An instance started with flags, which is how the official Docker image is configured, has nowhere to write to, so every fix applied during an incident evaporates at the next restart with nobody remembering it was ever there. That is the mechanism behind "but we configured that months ago", and it is most dangerous with <code>requirepass</code>. Two habits close it: check <code>config_file</code> in <code>INFO server</code> to learn what this process actually loaded rather than what you assume it read, and monitor a handful of critical <code>CONFIG GET</code> values against what you expect so drift surfaces as a curiosity rather than an outage.',
            'Cấu hình tới Redis từ bốn nơi theo thứ tự — file, cờ dòng lệnh, <code>CONFIG SET</code> lúc chạy, và <code>CONFIG REWRITE</code> ghi các giá trị đang sống trở lại — và cái cuối cùng mới là thứ khép được vòng. Một instance khởi động bằng cờ, đúng cách ảnh Docker chính thức được cấu hình, thì chẳng có chỗ nào để ghi, nên mọi bản vá áp trong lúc sự cố đều bốc hơi ở lần khởi động lại kế tiếp mà không ai còn nhớ nó từng tồn tại. Đó chính là cơ chế đằng sau câu "nhưng bọn tôi cấu hình cái đó mấy tháng trước rồi", và nó nguy hiểm nhất với <code>requirepass</code>. Hai thói quen khép được nó: xem <code>config_file</code> trong <code>INFO server</code> để biết tiến trình này THẬT SỰ nạp file nào chứ không phải file bạn nghĩ, và giám sát một nhúm giá trị <code>CONFIG GET</code> quan trọng so với kỳ vọng, để sự trôi dạt lộ ra khi còn là chuyện lạ chứ chưa thành sự cố.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9, on an instance with no ACL configuration at all.' + code(
              '> ACL LIST\n' +
              '1) "user default on nopass sanitize-payload ~* &amp;* +@all"',
            ) + 'A team then sets <code>requirepass</code>. What has and has not changed?',
            'Chạy thật trên Redis 7.4.9, trên một instance hoàn toàn chưa cấu hình ACL.' + code(
              '> ACL LIST\n' +
              '1) "user default on nopass sanitize-payload ~* &amp;* +@all"',
            ) + 'Sau đó một nhóm đặt <code>requirepass</code>. Cái gì đã đổi và cái gì thì không?',
          ),
          options: [
            B('A password is now required, and the default user\'s permissions are still every command on every key and channel', 'Giờ phải có mật khẩu, còn quyền của user default vẫn là mọi lệnh trên mọi khoá và mọi kênh'),
            B('<code>requirepass</code> creates a separate authenticated user, so <code>default</code> is automatically disabled', '<code>requirepass</code> tạo ra một user đã xác thực riêng, nên <code>default</code> tự động bị tắt'),
            B('Setting a password narrows the default user to <code>+@read +@write</code>, removing the dangerous commands', 'Đặt mật khẩu sẽ thu hẹp user default về <code>+@read +@write</code>, gỡ bỏ các lệnh nguy hiểm'),
            B('Nothing changes at all: <code>requirepass</code> is only honoured when <code>protected-mode</code> is <code>no</code>', 'Chẳng đổi gì cả: <code>requirepass</code> chỉ có hiệu lực khi <code>protected-mode</code> là <code>no</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Read that ACL line as a sentence: the user <code>default</code> is enabled, needs no password, and may run every command on every key and every channel. <code>requirepass</code> is nothing more than that user\'s password — the permissions stay <code>~* &amp;* +@all</code>. So a leaked connection string, an SSRF that reaches Redis, or a bug in one service still yields <code>FLUSHALL</code>, <code>CONFIG SET</code>, <code>REPLICAOF</code> and every key belonging to every other service. The point of ACLs is to make the blast radius of a compromised credential equal to the data that credential actually needed. And the exercise is undone if <code>default</code> is left as it is, because anything that can open a connection simply does not authenticate: finish by disabling it (<code>ACL SETUSER default off</code>) or neutering it (<code>>password -@all +ping +info</code>) once every client is on a named user.',
            'Hãy đọc dòng ACL đó như một câu văn: user <code>default</code> đang bật, không cần mật khẩu, và được chạy mọi lệnh trên mọi khoá và mọi kênh. <code>requirepass</code> chẳng qua là mật khẩu CỦA CHÍNH user đó — phần quyền vẫn nguyên <code>~* &amp;* +@all</code>. Nên một chuỗi kết nối bị lộ, một lỗ SSRF chạm tới được Redis, hay một con bọ trong một dịch vụ vẫn cho ra <code>FLUSHALL</code>, <code>CONFIG SET</code>, <code>REPLICAOF</code> và mọi khoá thuộc về mọi dịch vụ khác. Ý nghĩa của ACL là làm cho bán kính sát thương của một chứng danh bị lộ đúng bằng phần dữ liệu mà chứng danh ấy thật sự cần. Và cả công cuộc đó tan thành mây khói nếu <code>default</code> vẫn để nguyên, vì thứ gì mở được kết nối thì đơn giản là không xác thực: hãy kết thúc bằng cách tắt nó (<code>ACL SETUSER default off</code>) hoặc vô hiệu hoá nó (<code>>mật-khẩu -@all +ping +info</code>) sau khi mọi client đã chuyển sang user có tên.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Two users were created with the same rules in a different order, then each ran <code>FLUSHALL</code>.' + code(
              "ACL SETUSER u1 on '>p' '~*' +@all -@dangerous\n" +
              "ACL SETUSER u2 on '>p' '~*' -@dangerous +@all\n" +
              '\n' +
              "u1 FLUSHALL -> NOPERM User u1 has no permissions to run the 'flushall' command\n" +
              'u2 FLUSHALL -> OK',
            ) + 'Why?',
            'Chạy thật trên Redis 7.4.9. Hai user được tạo với cùng bộ luật nhưng khác thứ tự, rồi mỗi user chạy <code>FLUSHALL</code>.' + code(
              "ACL SETUSER u1 on '>p' '~*' +@all -@dangerous\n" +
              "ACL SETUSER u2 on '>p' '~*' -@dangerous +@all\n" +
              '\n' +
              "u1 FLUSHALL -> NOPERM User u1 has no permissions to run the 'flushall' command\n" +
              'u2 FLUSHALL -> OK',
            ) + 'Vì sao?',
          ),
          options: [
            B('<code>-@dangerous</code> is only honoured when it is the last rule, so u2 needs it repeated at the end', '<code>-@dangerous</code> chỉ có hiệu lực khi nó là luật cuối cùng, nên u2 phải lặp lại nó ở cuối'),
            B('u2 inherited its permissions from <code>default</code>, because a subtraction cannot be its first rule', 'u2 thừa hưởng quyền từ <code>default</code>, vì một phép trừ không thể là luật đầu tiên của user'),
            B('Rules are applied left to right, so u2\'s trailing <code>+@all</code> granted the dangerous commands back', 'Luật được áp từ trái sang phải, nên <code>+@all</code> đứng cuối của u2 đã cấp lại các lệnh nguy hiểm'),
            B('<code>~*</code> before the command rules resets them, and only u1 happened to survive the reset intact', '<code>~*</code> đứng trước các luật lệnh sẽ đặt lại chúng, và tình cờ chỉ u1 sống sót qua lần đặt lại đó'),
          ],
          correct: 2,
          explanation: EX(
            'Each token modifies the permission set built so far, so <code>+@all -@dangerous</code> and <code>-@dangerous +@all</code> mean completely different things — and <code>ACL LIST</code> shows it plainly, storing u2 as simply <code>+@all</code> because the subtraction was overwritten. The same trap hides inside the shorthands: <code>allcommands</code>, <code>allkeys</code> and <code>allchannels</code> each silently undo a restriction written earlier on the same line. A user starts with nothing — off, no password, <code>-@all</code>, no keys, no channels — so every capability is something you added on purpose, which is the right default for an access-control system. The shape of almost every application user is <code>on &gt;password ~prefix:* +@read +@write -@dangerous</code>, with <code>%R~</code> for read-only prefixes and a parenthesised selector for the cases a single flat rule set cannot express.',
            'Mỗi thẻ luật sửa đổi tập quyền đã dựng được cho tới lúc đó, nên <code>+@all -@dangerous</code> và <code>-@dangerous +@all</code> là hai thứ hoàn toàn khác nhau — và <code>ACL LIST</code> phơi bày điều đó rất rõ, nó lưu u2 chỉ còn <code>+@all</code> vì phép trừ đã bị ghi đè. Cùng cái bẫy ấy nấp trong các dạng viết tắt: <code>allcommands</code>, <code>allkeys</code> và <code>allchannels</code> mỗi cái đều âm thầm gỡ bỏ một hạn chế viết trước đó trên cùng một dòng. Một user khởi đầu với con số không — tắt, không mật khẩu, <code>-@all</code>, không khoá, không kênh — nên mọi năng lực đều là thứ bạn thêm vào có chủ đích, và đó là mặc định đúng cho một hệ kiểm soát truy cập. Hình dạng của gần như mọi user ứng dụng là <code>on &gt;mật-khẩu ~tiền-tố:* +@read +@write -@dangerous</code>, kèm <code>%R~</code> cho các tiền tố chỉ-đọc và một bộ chọn trong ngoặc cho những ca mà một tập luật phẳng không diễn đạt nổi.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 after a restricted user was denied a command. What is this output for?' + code(
              '> ACL LOG 1\n' +
              'reason      command\n' +
              'context     toplevel\n' +
              'object      config|get\n' +
              'username    u1\n' +
              'age-seconds 0.069\n' +
              'client-info id=921 addr=127.0.0.1:46978 … cmd=config|get user=u1',
            ),
            'Chạy thật trên Redis 7.4.9 sau khi một user bị hạn chế bị từ chối một lệnh. Kết quả này dùng để làm gì?' + code(
              '> ACL LOG 1\n' +
              'reason      command\n' +
              'context     toplevel\n' +
              'object      config|get\n' +
              'username    u1\n' +
              'age-seconds 0.069\n' +
              'client-info id=921 addr=127.0.0.1:46978 … cmd=config|get user=u1',
            ),
          ),
          options: [
            B('It is an audit trail of successful privileged commands, kept for compliance and written to disk', 'Nó là dấu vết kiểm toán các lệnh đặc quyền THÀNH CÔNG, giữ lại để tuân thủ và được ghi xuống đĩa'),
            B('It queues denied commands so they can be replayed once the permission is granted', 'Nó xếp hàng các lệnh bị từ chối để chạy lại khi quyền được cấp'),
            B('It is a ring buffer of denials — deploy a restrictive user, then read it to find the rules you got wrong', 'Nó là một vùng đệm vòng ghi các lần từ chối — cứ triển khai user hạn chế rồi đọc nó để tìm luật bạn đặt sai'),
            B('It reports which users are currently connected, so a denial entry means that user is still online', 'Nó báo những user nào đang kết nối, nên một mục từ chối nghĩa là user đó vẫn đang trực tuyến'),
          ],
          correct: 2,
          explanation: EX(
            '<code>ACL LOG</code> is the feature that makes ACLs deployable, because rolling out a restrictive user stops being a guessing game: each entry names the username, the exact command or key that was refused, the reason (<code>command</code>, <code>key</code>, <code>channel</code> or <code>auth</code>), the client address and the connection name. Deploy the user with the permissions you believe it needs, run the application, then read the log to find what you got wrong. It is a ring buffer sized by <code>acl-log-max-len</code> — 128 by default and gone on restart — so scrape it or raise the limit if you want history. An entry appearing weeks later, from a service you thought was scoped correctly, is exactly the signal you built this for.',
            '<code>ACL LOG</code> chính là tính năng làm cho ACL triển khai được, vì việc tung ra một user hạn chế thôi không còn là trò đoán mò: mỗi mục ghi rõ tên user, đúng cái lệnh hay cái khoá bị từ chối, lý do (<code>command</code>, <code>key</code>, <code>channel</code> hay <code>auth</code>), địa chỉ client và tên kết nối. Hãy triển khai user với bộ quyền bạn TIN là nó cần, chạy ứng dụng, rồi đọc log để tìm ra chỗ mình đặt sai. Nó là một vùng đệm vòng với kích thước theo <code>acl-log-max-len</code> — mặc định 128 và mất khi khởi động lại — nên hãy thu gom nó hoặc nâng giới hạn nếu bạn muốn có lịch sử. Một mục hiện ra vài tuần sau, từ một dịch vụ bạn tưởng đã phân quyền đúng, chính là tín hiệu mà bạn dựng cả hệ thống này lên để nhận.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 with a user declared as <code>%R~metrics:*</code> plus <code>+@read +@write -@dangerous</code>.' + code(
              '> SET metrics:x 1\n' +
              '(error) NOPERM No permissions to access a key\n' +
              '> GET metrics:x\n' +
              '(nil)',
            ) + 'What does <code>%R~</code> express, and why does it exist?',
            'Chạy thật trên Redis 7.4.9 với một user khai là <code>%R~metrics:*</code> cộng <code>+@read +@write -@dangerous</code>.' + code(
              '> SET metrics:x 1\n' +
              '(error) NOPERM No permissions to access a key\n' +
              '> GET metrics:x\n' +
              '(nil)',
            ) + '<code>%R~</code> diễn đạt điều gì, và vì sao nó tồn tại?',
          ),
          options: [
            B('Read-only access to a key pattern, so a dashboard can read data it must not be able to corrupt', 'Quyền CHỈ ĐỌC trên một mẫu khoá, để một bảng điều khiển đọc được dữ liệu mà nó không được phép làm hỏng'),
            B('A regular-expression key pattern, as opposed to <code>~</code> which only matches a literal prefix', 'Một mẫu khoá dạng biểu thức chính quy, khác với <code>~</code> vốn chỉ khớp một tiền tố nguyên văn'),
            B('A rate-limited pattern: reads are unlimited while writes are throttled to a fixed number per second', 'Một mẫu có giới hạn tần suất: đọc thì thoải mái còn ghi bị bóp về một số lượng cố định mỗi giây'),
            B('A replica-only pattern, allowing the keys to be accessed on replicas but not on the primary', 'Một mẫu chỉ dành cho replica, cho phép truy cập các khoá đó trên replica chứ không trên máy chính'),
          ],
          correct: 0,
          explanation: EX(
            'Redis 7.0 split key permissions by direction: <code>%R~</code> is read-only, <code>%W~</code> is write-only, and plain <code>~</code> (equivalently <code>%RW~</code>) is both. Read-only lets a dashboard read metrics it must not corrupt; write-only lets a service append to an audit log it must not read back. Note that a denied key returns <code>NOPERM No permissions to access a key</code> while a denied command returns <code>NOPERM User … has no permissions to run the … command</code> — two different messages for two different rules, and both land in <code>ACL LOG</code> with the reason recorded. Channels are separate again, with <code>&amp;pattern</code>, because a channel is not a key; since Redis 7 a new user starts with no channels rather than all of them.',
            'Redis 7.0 tách quyền trên khoá theo CHIỀU: <code>%R~</code> là chỉ đọc, <code>%W~</code> là chỉ ghi, còn <code>~</code> trơn (tương đương <code>%RW~</code>) là cả hai. Chỉ-đọc cho phép một bảng điều khiển đọc các chỉ số mà nó không được làm hỏng; chỉ-ghi cho phép một dịch vụ nối thêm vào một nhật ký kiểm toán mà nó không được đọc lại. Chú ý một khoá bị từ chối trả về <code>NOPERM No permissions to access a key</code> còn một lệnh bị từ chối trả về <code>NOPERM User … has no permissions to run the … command</code> — hai thông điệp khác nhau cho hai loại luật khác nhau, và cả hai đều rơi vào <code>ACL LOG</code> kèm lý do. Kênh Pub/Sub lại là chuyện riêng nữa, dùng <code>&amp;mẫu</code>, vì kênh không phải khoá; từ Redis 7 một user mới bắt đầu với KHÔNG kênh nào thay vì tất cả.',
          ),
        }),

        mcq({
          prompt: B(
            'An older runbook removes dangerous commands with lines in <code>redis.conf</code>:' + code(
              'rename-command FLUSHALL ""\n' +
              'rename-command CONFIG "CONFIG_b8f2a91c"',
            ) + 'Why is an ACL rule the better tool for the same job?',
            'Một quy trình vận hành cũ gỡ bỏ các lệnh nguy hiểm bằng mấy dòng trong <code>redis.conf</code>:' + code(
              'rename-command FLUSHALL ""\n' +
              'rename-command CONFIG "CONFIG_b8f2a91c"',
            ) + 'Vì sao một luật ACL là công cụ tốt hơn cho cùng việc đó?',
          ),
          options: [
            B('Renaming is enforced only for authenticated users, while ACLs also apply to unauthenticated connections', 'Đổi tên chỉ áp cho user đã xác thực, còn ACL thì áp cả với các kết nối chưa xác thực'),
            B('Renaming is global and needs a restart, hides the new name in the config, and breaks tooling for everyone', 'Đổi tên là toàn cục và cần khởi động lại, giấu cái tên mới ngay trong file cấu hình, và làm hỏng công cụ cho tất cả'),
            B('Renaming does not survive a replica resync, so the original names come back on the promoted node', 'Đổi tên không sống sót qua một lần đồng bộ lại replica, nên tên gốc quay về trên nút được thăng cấp'),
            B('ACLs are checked before the command table, so they are measurably faster on every command dispatch', 'ACL được kiểm trước bảng lệnh, nên nó nhanh hơn đo được ở mọi lượt điều phối lệnh'),
          ],
          correct: 1,
          explanation: EX(
            '<code>rename-command</code> affects every user including your own operators, cannot be changed at runtime, and stores the secret new name in the same file an attacker who can read the config would read. It also breaks things quietly: <code>redis-cli --bigkeys</code>, monitoring agents, backup scripts and client libraries all issue those commands by their real names. An ACL removes the command from the account that should not have it while your admin user keeps <code>+@all</code> — same protection, per identity, changeable without a restart, and visible in <code>ACL LIST</code>. The commands worth removing from every application user are <code>FLUSHALL</code>, <code>FLUSHDB</code>, <code>CONFIG</code>, <code>DEBUG</code>, <code>SHUTDOWN</code>, <code>REPLICAOF</code>, <code>MONITOR</code>, <code>KEYS</code>, <code>MIGRATE</code> and <code>SWAPDB</code>, which <code>-@dangerous</code> covers in one token.',
            '<code>rename-command</code> tác động lên MỌI user, kể cả chính người vận hành của bạn, không đổi được lúc chạy, và cất cái tên mới bí mật ngay trong file mà một kẻ tấn công đọc được cấu hình sẽ đọc. Nó còn làm hỏng đồ đạc một cách âm thầm: <code>redis-cli --bigkeys</code>, các tác nhân giám sát, script sao lưu và thư viện client đều gọi những lệnh đó bằng tên thật. Một luật ACL gỡ cái lệnh ấy khỏi ĐÚNG cái tài khoản không nên có nó, trong khi user quản trị của bạn vẫn giữ <code>+@all</code> — cùng mức bảo vệ, theo từng danh tính, đổi được không cần khởi động lại, và nhìn thấy được trong <code>ACL LIST</code>. Những lệnh đáng gỡ khỏi mọi user ứng dụng là <code>FLUSHALL</code>, <code>FLUSHDB</code>, <code>CONFIG</code>, <code>DEBUG</code>, <code>SHUTDOWN</code>, <code>REPLICAOF</code>, <code>MONITOR</code>, <code>KEYS</code>, <code>MIGRATE</code> và <code>SWAPDB</code> — mà <code>-@dangerous</code> gói trọn trong một thẻ luật.',
          ),
        }),

        mcq({
          prompt: B(
            'You are about to inspect a production keyspace during an incident from an admin connection. Which pair of <code>CLIENT</code> settings is worth turning on for that connection, and why?',
            'Bạn sắp soi không gian khoá production giữa lúc sự cố, từ một kết nối quản trị. Cặp thiết lập <code>CLIENT</code> nào đáng bật cho kết nối đó, và vì sao?',
          ),
          options: [
            B('<code>CLIENT PAUSE</code> and <code>CLIENT UNPAUSE</code>, to freeze writes so the keyspace stops moving under you', '<code>CLIENT PAUSE</code> và <code>CLIENT UNPAUSE</code>, để đóng băng lệnh ghi cho không gian khoá đứng yên'),
            B('<code>CLIENT REPLY OFF</code> and <code>CLIENT SETNAME</code>, so your commands cost the server nothing at all', '<code>CLIENT REPLY OFF</code> và <code>CLIENT SETNAME</code>, để lệnh của bạn không tốn gì của máy chủ'),
            B('<code>CLIENT KILL SKIPME</code> and <code>CLIENT ID</code>, which together reserve a connection slot above <code>maxclients</code>', '<code>CLIENT KILL SKIPME</code> và <code>CLIENT ID</code>, hai cái này cùng nhau giữ chỗ một kết nối vượt trên <code>maxclients</code>'),
            B('<code>CLIENT NO-EVICT on</code> and <code>CLIENT NO-TOUCH on</code>, so you are not dropped and your reads do not skew LRU/LFU', '<code>CLIENT NO-EVICT on</code> và <code>CLIENT NO-TOUCH on</code>, để bạn không bị ngắt và phép đọc của bạn không làm lệch LRU/LFU'),
          ],
          correct: 3,
          explanation: EX(
            'Redis 7.0 can evict clients whose buffers exceed <code>maxmemory-clients</code>, and during a memory incident the one connection you need is exactly the one at risk of being dropped — <code>CLIENT NO-EVICT on</code> protects it. <code>CLIENT NO-TOUCH on</code> stops this connection\'s reads from updating LRU/LFU metadata, so inspecting keys does not make them look hot and skew what gets evicted afterwards. Two more worth knowing from the same family: <code>CLIENT KILL</code> takes filters rather than only an address (<code>ID</code>, <code>ADDR</code>, <code>TYPE</code>, <code>USER</code>, and <code>MAXAGE</code> since 7.4), which is how you make <code>ACL SETUSER … off</code> take effect on connections that are already open; and <code>CLIENT PAUSE</code> exists for coordinated failovers and is a foot-gun anywhere else, because every paused client is a request holding a connection somewhere upstream.',
            'Redis 7.0 có thể đẩy đi những client mà bộ đệm vượt quá <code>maxmemory-clients</code>, và giữa một sự cố bộ nhớ thì đúng cái kết nối bạn đang cần lại là cái có nguy cơ bị ngắt — <code>CLIENT NO-EVICT on</code> bảo vệ nó. <code>CLIENT NO-TOUCH on</code> ngăn các lượt đọc của kết nối này cập nhật siêu dữ liệu LRU/LFU, nên việc soi khoá không làm chúng trông có vẻ nóng và làm lệch thứ sẽ bị đẩy đi sau đó. Thêm hai thứ đáng biết cùng họ: <code>CLIENT KILL</code> nhận BỘ LỌC chứ không chỉ một địa chỉ (<code>ID</code>, <code>ADDR</code>, <code>TYPE</code>, <code>USER</code>, và <code>MAXAGE</code> từ 7.4), đó là cách bạn làm cho <code>ACL SETUSER … off</code> có hiệu lực với những kết nối đã mở sẵn; và <code>CLIENT PAUSE</code> sinh ra cho các cuộc chuyển vai có phối hợp, còn dùng ở chỗ khác thì là tự bắn vào chân, vì mỗi client bị tạm dừng là một request đang giữ một kết nối ở đâu đó phía trên.',
          ),
        }),

        // ── Chương 11 — Nhân bản, Sentinel, Cluster ─────────────────────
        mcq({
          prompt: B(
            'Run for real against a live replica (Redis 7.4.9, <code>master_link_status:up</code>).' + code(
              '> INFO replication\n' +
              'role:slave\n' +
              'slave_read_only:1\n' +
              '> SET x 1\n' +
              "(error) READONLY You can't write against a read only replica.",
            ) + 'What happens if you set <code>replica-read-only no</code> and write anyway?',
            'Chạy thật trên một replica đang sống (Redis 7.4.9, <code>master_link_status:up</code>).' + code(
              '> INFO replication\n' +
              'role:slave\n' +
              'slave_read_only:1\n' +
              '> SET x 1\n' +
              "(error) READONLY You can't write against a read only replica.",
            ) + 'Nếu bạn đặt <code>replica-read-only no</code> rồi vẫn ghi thì sao?',
          ),
          options: [
            B('The write is forwarded to the primary and then replicated back, so both sides end up consistent', 'Lượt ghi được chuyển tiếp lên máy chính rồi nhân bản ngược về, nên hai bên rốt cuộc vẫn nhất quán'),
            B('The write is local only, invisible to the primary, and silently destroyed by the next resync', 'Lượt ghi chỉ nằm cục bộ, máy chính không thấy, và bị xoá sạch âm thầm ở lần đồng bộ lại kế tiếp'),
            B('The replica is promoted automatically, because accepting a write means it is no longer a replica', 'Replica sẽ được thăng cấp tự động, vì nhận một lượt ghi nghĩa là nó không còn là replica nữa'),
            B('The write is rejected anyway; <code>replica-read-only no</code> only affects Lua scripts and modules', 'Lượt ghi vẫn bị từ chối; <code>replica-read-only no</code> chỉ ảnh hưởng tới script Lua và module'),
          ],
          correct: 1,
          explanation: EX(
            'Nothing forwards a write from a replica to its primary — the replication stream only flows downward. A local write lives on that replica alone until the next full or partial resync overwrites it, at which point it vanishes with no error and no log line anyone reads. That is why the default is read-only and why you almost never want to change it; the legitimate uses are ephemeral scratch data on the replica that you accept losing. Two related facts worth carrying: <code>REPLICAOF</code> and <code>REPLICAOF NO ONE</code> are runtime commands that take effect immediately, which is exactly why <code>@dangerous</code> must be removed from application users — an unprotected instance can be told to sync from a server an attacker controls, replacing your whole dataset with theirs.',
            'Không có gì chuyển tiếp một lượt ghi từ replica lên máy chính — luồng nhân bản chỉ chảy xuống. Một lượt ghi cục bộ chỉ sống trên đúng cái replica đó cho tới lần đồng bộ lại toàn phần hay một phần kế tiếp ghi đè lên nó, và lúc ấy nó biến mất, không lỗi, không một dòng log nào có người đọc. Vì thế mặc định là chỉ-đọc và vì thế bạn gần như không bao giờ nên đổi; những cách dùng chính đáng là dữ liệu nháp phù du trên replica mà bạn chấp nhận mất. Hai sự thật liên quan đáng mang theo: <code>REPLICAOF</code> và <code>REPLICAOF NO ONE</code> là lệnh chạy lúc nào cũng có hiệu lực ngay, và đó chính là lý do phải gỡ <code>@dangerous</code> khỏi user ứng dụng — một instance không được bảo vệ có thể bị ra lệnh đồng bộ từ một máy chủ do kẻ tấn công điều khiển, thay toàn bộ dữ liệu của bạn bằng dữ liệu của chúng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9: <code>CONFIG GET repl-backlog-size</code> returns <code>1048576</code>. A replica on an instance writing about 1 MB per second disconnects for twenty seconds. What happens when it reconnects, and what is the fix?',
            'Đo thật trên Redis 7.4.9: <code>CONFIG GET repl-backlog-size</code> trả về <code>1048576</code>. Một replica trên instance đang ghi khoảng 1 MB mỗi giây mất kết nối hai mươi giây. Khi nó nối lại thì sao, và chữa thế nào?',
          ),
          options: [
            B('A partial resync, because the backlog is a ring buffer sized in time rather than in bytes', 'Một lần đồng bộ một phần, vì vùng tồn đọng là bộ đệm vòng đo bằng THỜI GIAN chứ không phải byte'),
            B('A full resync — 1 MB of backlog covers about one second here — so raise <code>repl-backlog-size</code>', 'Một lần đồng bộ TOÀN PHẦN — 1 MB tồn đọng ở đây chỉ phủ khoảng một giây — nên hãy nâng <code>repl-backlog-size</code>'),
            B('Nothing at all: the replica keeps its old dataset and simply resumes streaming from the current offset', 'Chẳng có gì: replica giữ nguyên dữ liệu cũ và cứ thế chảy tiếp từ vị trí hiện tại'),
            B('The primary refuses the reconnect until <code>repl-backlog-ttl</code> elapses and the buffer is released', 'Máy chính từ chối lần nối lại cho tới khi hết <code>repl-backlog-ttl</code> và vùng đệm được giải phóng'),
          ],
          correct: 1,
          explanation: EX(
            'The backlog is a ring buffer of recent writes measured in bytes, and on reconnect the primary checks whether the bytes the replica missed are still in it. Twenty seconds at 1 MB/s is twenty times the default, so they are gone and the answer is <code>FULLRESYNC</code> — the primary forks exactly as for a <code>BGSAVE</code>, transfers the whole dataset, and buffers every write made during the transfer in that replica\'s output buffer, all counted against <code>maxmemory</code>. Watch <code>sync_full</code> against <code>sync_partial_ok</code>: a rising <code>sync_full</code> is telling you the backlog is too small or the replica output buffer limit is too tight, and every one of those resyncs repeats the whole cost. 64 MB is a common choice, and attaching a replica belongs in a quiet window rather than at peak.',
            'Vùng tồn đọng là một bộ đệm vòng chứa các lượt ghi gần đây, ĐO BẰNG BYTE, và khi nối lại thì máy chính kiểm xem số byte mà replica đã bỏ lỡ có còn trong đó không. Hai mươi giây ở 1 MB/giây là gấp hai mươi lần mặc định, nên chúng đã trôi mất và câu trả lời là <code>FULLRESYNC</code> — máy chính fork y hệt như khi <code>BGSAVE</code>, truyền cả bộ dữ liệu, và đệm mọi lượt ghi phát sinh trong lúc truyền vào bộ đệm ra của replica ấy, tất cả đều tính vào <code>maxmemory</code>. Hãy theo dõi <code>sync_full</code> so với <code>sync_partial_ok</code>: <code>sync_full</code> tăng lên là nó đang bảo bạn rằng vùng tồn đọng quá nhỏ hoặc trần bộ đệm ra của replica quá chặt, và mỗi lần đồng bộ lại như thế là lặp lại trọn cái giá ấy. 64 MB là lựa chọn hay gặp, và việc gắn thêm replica nên làm vào giờ vắng chứ không phải lúc cao điểm.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9 with exactly one healthy replica attached.' + code(
              '> SET order:9001 confirmed\n' +
              'OK\n' +
              '> WAIT 1 100\n' +
              '(integer) 1\n' +
              '> WAIT 2 100\n' +
              '(integer) 1\n' +
              '> WAIT 5 100\n' +
              '(integer) 1',
            ) + 'What is the correct reading of <code>WAIT</code>?',
            'Chạy thật trên Redis 7.4.9 với đúng một replica khoẻ mạnh đang gắn vào.' + code(
              '> SET order:9001 confirmed\n' +
              'OK\n' +
              '> WAIT 1 100\n' +
              '(integer) 1\n' +
              '> WAIT 2 100\n' +
              '(integer) 1\n' +
              '> WAIT 5 100\n' +
              '(integer) 1',
            ) + 'Cách đọc ĐÚNG về <code>WAIT</code> là gì?',
          ),
          options: [
            B('It returns how many replicas actually acknowledged — an answer your code must check, not a guarantee', 'Nó trả về số replica THẬT SỰ đã xác nhận — một câu trả lời mà mã của bạn phải kiểm, không phải một bảo đảm'),
            B('It errors when the requested count cannot be met, so a return value always means full success', 'Nó báo lỗi khi không đạt được số lượng yêu cầu, nên có giá trị trả về nghĩa là thành công trọn vẹn'),
            B('It makes the preceding write synchronous, so after <code>WAIT 1 100</code> the write cannot be lost', 'Nó biến lượt ghi ngay trước đó thành đồng bộ, nên sau <code>WAIT 1 100</code> thì lượt ghi không thể mất'),
            B('It blocks until the timeout in every case, so the three calls above took 100 ms each regardless', 'Nó luôn chặn cho hết hạn chờ, nên ba lệnh trên đều tốn 100 ms mỗi lệnh bất kể thế nào'),
          ],
          correct: 0,
          explanation: EX(
            '<code>WAIT 2 100</code> returning 1 means only one replica confirmed within 100 ms, and it is not an error — your code has to decide what to do about that. Code that ignores the return value has added latency and bought nothing. More importantly, <code>WAIT</code> runs <em>after</em> the write already happened: if the primary dies between the <code>SET</code> and the <code>WAIT</code>, or a failover promotes a replica that acknowledged receipt but had not persisted, the write can still vanish. It narrows the window; it does not close it, and the documentation says so plainly. <code>WAITAOF numlocal numreplicas timeout</code> (Redis 7.0, needs AOF on) is stronger — it waits for the local fsync and the replicas\' — and it costs a disk round trip, so reserve it for the handful of writes that genuinely warrant one.',
            '<code>WAIT 2 100</code> trả về 1 nghĩa là chỉ một replica xác nhận kịp trong 100 ms, và đó KHÔNG phải lỗi — mã của bạn phải tự quyết định làm gì với chuyện đó. Mã bỏ qua giá trị trả về thì chỉ tổ thêm độ trễ mà chẳng mua được gì. Quan trọng hơn, <code>WAIT</code> chạy SAU KHI lượt ghi đã xảy ra rồi: nếu máy chính chết giữa lệnh <code>SET</code> và lệnh <code>WAIT</code>, hoặc một cuộc chuyển vai thăng cấp một replica đã báo nhận nhưng chưa kịp lưu, thì lượt ghi ấy vẫn có thể bốc hơi. Nó thu hẹp cửa sổ chứ không đóng được cửa sổ, và tài liệu nói thẳng như vậy. <code>WAITAOF sốLocal sốReplica hạnChờ</code> (Redis 7.0, cần bật AOF) mạnh hơn — nó chờ cả lượt fsync cục bộ lẫn của các replica — và nó tốn một vòng đi-về đĩa, nên hãy để dành cho một nhúm lượt ghi thật sự xứng đáng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on Redis 7.4.9 with <code>min-replicas-to-write 1</code> and <code>min-replicas-max-lag 10</code>. The only replica was stopped, and thirteen seconds later:' + code(
              '> SET k v2\n' +
              '(error) NOREPLICAS Not enough good replicas to write.\n' +
              '> GET k\n' +
              '"v"',
            ) + 'Which statement about this setting is correct?',
            'Đo thật trên Redis 7.4.9 với <code>min-replicas-to-write 1</code> và <code>min-replicas-max-lag 10</code>. Replica duy nhất bị dừng, và mười ba giây sau:' + code(
              '> SET k v2\n' +
              '(error) NOREPLICAS Not enough good replicas to write.\n' +
              '> GET k\n' +
              '"v"',
            ) + 'Phát biểu nào về thiết lập này là ĐÚNG?',
          ),
          options: [
            B('It makes replication synchronous, so any write that is accepted has certainly reached a replica', 'Nó làm cho nhân bản trở thành đồng bộ, nên mọi lượt ghi được nhận đều chắc chắn đã tới một replica'),
            B('It applies to reads as well once the lag threshold is crossed, which is why the GET returned a stale value', 'Nó áp cả cho lệnh đọc khi vượt ngưỡng trễ, và đó là lý do lệnh GET trả về một giá trị cũ'),
            B('It measures lag by replication offset, so a connected replica that is far behind on data stops counting', 'Nó đo độ trễ theo vị trí nhân bản, nên một replica đang nối nhưng tụt xa về dữ liệu sẽ không được tính'),
            B('It is a CAP decision — and with a single replica it doubles your failure modes, so run at least two', 'Nó là một quyết định CAP — và với chỉ một replica thì nó nhân đôi số cách hỏng, nên hãy chạy ít nhất hai'),
          ],
          correct: 3,
          explanation: EX(
            'You are choosing consistency over availability, written down in the config file: rather than accept writes that might not survive, the primary refuses them with <code>NOREPLICAS</code> while reads keep working — the same asymmetry as <code>noeviction</code>, and the same confusing half-outage. That is correct for orders and wrong for a cache. But it does not make replication synchronous: it only guarantees that enough replicas existed and were recent when the write was accepted, not that they received <em>that</em> write. And lag is measured by pings, not by data — a replica sends <code>REPLCONF ACK</code> every second and <code>min-replicas-max-lag</code> counts seconds since the last one, so a replica that is connected but hopelessly behind still counts as good. With one replica, losing it takes down writes on a perfectly healthy primary.',
            'Bạn đang chọn nhất quán thay vì sẵn sàng, và ghi hẳn lựa chọn ấy vào file cấu hình: thay vì nhận những lượt ghi có thể không sống nổi, máy chính từ chối chúng bằng <code>NOREPLICAS</code> trong khi lệnh đọc vẫn chạy — cùng cái bất đối xứng của <code>noeviction</code>, và cùng kiểu nửa-sự-cố gây bối rối. Điều đó đúng với đơn hàng và sai với một bộ đệm. Nhưng nó KHÔNG làm nhân bản trở thành đồng bộ: nó chỉ bảo đảm rằng đã có đủ replica và chúng còn mới lúc lượt ghi được nhận, chứ không bảo đảm chúng đã nhận ĐƯỢC lượt ghi ấy. Và độ trễ ở đây đo bằng nhịp ping chứ không bằng dữ liệu — replica gửi <code>REPLCONF ACK</code> mỗi giây và <code>min-replicas-max-lag</code> đếm số giây từ lần cuối, nên một replica đang nối mà tụt hậu thảm hại vẫn được coi là "tốt". Với chỉ một replica, mất nó là chặn luôn lệnh ghi trên một máy chính hoàn toàn khoẻ mạnh.',
          ),
        }),

        mcq({
          prompt: B(
            'A team deploys three Sentinels, rehearses a failover, watches it promote a replica in twelve seconds and log a clean success — and the application is down throughout and afterwards. What was missing?',
            'Một nhóm triển khai ba Sentinel, diễn tập một cuộc chuyển vai, thấy nó thăng cấp một replica trong mười hai giây và ghi log thành công sạch sẽ — vậy mà ứng dụng chết suốt lúc đó và cả sau đó. Thiếu cái gì?',
          ),
          options: [
            B('<code>parallel-syncs</code> was left at 1, so the remaining replicas were still loading and could not serve', '<code>parallel-syncs</code> để nguyên ở 1, nên các replica còn lại vẫn đang nạp và chưa phục vụ được'),
            B('The quorum was set too low, so the promotion was authorised by a single Sentinel and then rolled back', 'Quorum đặt quá thấp nên việc thăng cấp chỉ do một Sentinel cho phép rồi bị quay lui'),
            B('The clients still point at the old primary\'s address — Sentinel must be the configuration provider', 'Các client vẫn trỏ vào địa chỉ của máy chính cũ — Sentinel phải là NƠI CUNG CẤP CẤU HÌNH cho chúng'),
            B('Sentinel does not reconfigure the surviving replicas, so the promoted node had no replicas and refused writes', 'Sentinel không cấu hình lại các replica còn sống, nên nút được thăng cấp không có replica nào và từ chối ghi'),
          ],
          correct: 2,
          explanation: EX(
            'Sentinel does four things — monitoring, notification, automatic failover, and being the configuration provider — and the fourth is the one that makes the other three useful. Clients must ask a Sentinel "where is <code>mymaster</code> right now?" rather than hold a fixed address, or a perfect failover promotes a replica nobody is talking to: monitoring reports success while the application reports a total outage. There are two supported answers — a Sentinel-aware client library that queries for the address, subscribes to <code>+switch-master</code> and reconnects itself, or a proxy that follows Sentinel and keeps clients pointed at one address — and one popular answer that does not work, which is DNS, because resolver and JVM caches keep clients on the dead address for minutes after a twelve-second failover. Prove it with <code>SENTINEL failover</code> while watching the application; that is the only test that covers this.',
            'Sentinel làm bốn việc — theo dõi, báo tin, tự động chuyển vai, và LÀM NƠI CUNG CẤP CẤU HÌNH — và việc thứ tư mới là thứ khiến ba việc kia có ích. Client phải hỏi một Sentinel "<code>mymaster</code> đang ở đâu?" thay vì ôm một địa chỉ cố định, nếu không thì một cuộc chuyển vai hoàn hảo sẽ thăng cấp một replica mà chẳng ai nói chuyện với nó: giám sát báo thành công còn ứng dụng báo sập toàn phần. Có hai lời giải được hỗ trợ — một thư viện client biết Sentinel, tự hỏi địa chỉ, tự đăng ký kênh <code>+switch-master</code> và tự nối lại; hoặc một proxy đi theo Sentinel và giữ cho client luôn trỏ vào một địa chỉ duy nhất — và một lời giải phổ biến mà KHÔNG chạy được, đó là DNS, vì bộ đệm của trình phân giải và của JVM giữ client ở địa chỉ chết thêm vài phút sau một cuộc chuyển vai chỉ mất mười hai giây. Hãy chứng minh bằng <code>SENTINEL failover</code> trong lúc quan sát ứng dụng; đó là phép thử duy nhất phủ được chuyện này.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on a real cluster-enabled Redis 7.4.9, and cross-checked by implementing CRC16-CCITT outside Redis — both agree on every line.' + code(
              'CLUSTER KEYSLOT user:1042             -> 10999\n' +
              'CLUSTER KEYSLOT session:abc           -> 14788\n' +
              'CLUSTER KEYSLOT {u1042}:profile       -> 15977\n' +
              'CLUSTER KEYSLOT {u1042}:sessions      -> 15977\n' +
              'CLUSTER KEYSLOT user:{1042}:profile   ->   184',
            ) + 'What do these five lines establish?',
            'Đo thật trên một Redis 7.4.9 đã bật cluster, và kiểm chéo bằng cách tự cài CRC16-CCITT bên ngoài Redis — hai bên khớp từng dòng.' + code(
              'CLUSTER KEYSLOT user:1042             -> 10999\n' +
              'CLUSTER KEYSLOT session:abc           -> 14788\n' +
              'CLUSTER KEYSLOT {u1042}:profile       -> 15977\n' +
              'CLUSTER KEYSLOT {u1042}:sessions      -> 15977\n' +
              'CLUSTER KEYSLOT user:{1042}:profile   ->   184',
            ) + 'Năm dòng này xác lập điều gì?',
          ),
          options: [
            B('Only the text inside the first braces is hashed, so a hash tag is what forces keys into one slot', 'Chỉ phần chữ nằm trong cặp ngoặc nhọn ĐẦU TIÊN được băm, nên thẻ băm là thứ ép các khoá vào cùng một slot'),
            B('Slots are assigned in insertion order, so two keys written together always land in the same slot', 'Slot được cấp theo thứ tự ghi vào, nên hai khoá ghi cùng lúc luôn rơi vào cùng một slot'),
            B('The braces are stripped and the remaining text is hashed, which is why line 5 differs from line 3', 'Cặp ngoặc bị gỡ đi rồi phần chữ còn lại mới được băm, vì thế dòng 5 khác dòng 3'),
            B('Slot numbers are stable only within one node; another node would report different values for the same keys', 'Số slot chỉ ổn định trong phạm vi một nút; một nút khác sẽ báo giá trị khác cho cùng những khoá đó'),
          ],
          correct: 0,
          explanation: EX(
            'A slot is <code>CRC16(key) mod 16384</code>, computed by the client without asking anyone and unchanging for a given key — but when the key contains <code>{…}</code>, only the text inside the first braces is hashed. That is why <code>{u1042}:profile</code> and <code>{u1042}:sessions</code> share slot 15977 while <code>user:{1042}:profile</code> hashes <code>1042</code> and lands somewhere else entirely. Hash tags are the escape hatch for multi-key commands, which otherwise fail with <code>CROSSSLOT</code>: <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>RENAME</code>, a <code>MULTI</code> spanning keys, and a Lua script declaring several keys. And they re-create the problem Cluster exists to solve if you choose them too broadly — every key sharing a tag lives on one node, so tag by something genuinely small and self-contained: one user, one tenant, one document.',
            'Một slot là <code>CRC16(khoá) mod 16384</code>, do client tự tính không cần hỏi ai và không đổi với một khoá cho trước — nhưng khi khoá có chứa <code>{…}</code> thì chỉ phần chữ trong cặp ngoặc ĐẦU TIÊN được đem băm. Vì thế <code>{u1042}:profile</code> và <code>{u1042}:sessions</code> chung slot 15977, còn <code>user:{1042}:profile</code> lại băm chuỗi <code>1042</code> và rơi hẳn sang chỗ khác. Thẻ băm là lối thoát cho các lệnh nhiều khoá, thứ mà nếu không có nó sẽ hỏng với <code>CROSSSLOT</code>: <code>MGET</code>, <code>MSET</code>, <code>SINTER</code>, <code>ZUNIONSTORE</code>, <code>RENAME</code>, một khối <code>MULTI</code> trải trên nhiều khoá, và một script Lua khai nhiều khoá. Và chúng dựng lại đúng cái vấn đề mà Cluster sinh ra để giải, nếu bạn chọn thẻ quá rộng — mọi khoá chung một thẻ đều sống trên MỘT nút, nên hãy gắn thẻ theo thứ gì thật sự nhỏ và khép kín: một người dùng, một khách thuê, một tài liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'A service currently uses <code>SELECT 3</code> for one of its features, <code>KEYS</code> in a nightly maintenance job, and classic <code>PUBLISH</code> for cache invalidation. What happens to those three when it moves to Cluster?',
            'Một dịch vụ hiện dùng <code>SELECT 3</code> cho một tính năng, dùng <code>KEYS</code> trong một việc bảo trì ban đêm, và dùng <code>PUBLISH</code> cổ điển để vô hiệu hoá bộ đệm. Ba thứ đó ra sao khi chuyển sang Cluster?',
          ),
          options: [
            B('All three work unchanged; Cluster only affects commands that name more than one key at a time', 'Cả ba chạy y nguyên; Cluster chỉ ảnh hưởng tới các lệnh gọi tên nhiều hơn một khoá cùng lúc'),
            B('<code>SELECT</code> is emulated per node, <code>KEYS</code> is proxied to every node, and <code>PUBLISH</code> is sharded automatically', '<code>SELECT</code> được mô phỏng trên từng nút, <code>KEYS</code> được uỷ tới mọi nút, và <code>PUBLISH</code> tự động được chia mảnh'),
            B('Only database 0 exists, <code>KEYS</code> answers for one node, and classic <code>PUBLISH</code> is broadcast to every node', 'Chỉ tồn tại database 0, <code>KEYS</code> chỉ trả lời cho một nút, và <code>PUBLISH</code> cổ điển bị phát tán tới mọi nút'),
            B('<code>SELECT</code> and <code>KEYS</code> are unchanged, while <code>PUBLISH</code> is removed entirely in favour of <code>SPUBLISH</code>', '<code>SELECT</code> và <code>KEYS</code> giữ nguyên, còn <code>PUBLISH</code> bị bỏ hẳn để thay bằng <code>SPUBLISH</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Cluster mode supports database 0 only — measured: <code>SELECT 1</code> returns <code>ERR SELECT is not allowed in cluster mode</code> — so every numbered database in the codebase becomes a migration to key prefixes before the move can happen. Whole-keyspace operations answer for the node you asked: <code>KEYS</code>, <code>SCAN</code>, <code>DBSIZE</code>, <code>FLUSHALL</code> and <code>--bigkeys</code> all have to be run against every primary and combined, and <code>redis-cli --cluster call</code> exists for exactly that. And classic <code>PUBLISH</code> is propagated to every node over the cluster bus, so publish traffic grows with the cluster rather than dividing among it — the one part of Cluster that gets worse as you add capacity. <code>SPUBLISH</code>/<code>SSUBSCRIBE</code> (7.0) hash the channel like a key and fix it, but only if your clients use them.',
            'Chế độ Cluster chỉ hỗ trợ database 0 — đo thật: <code>SELECT 1</code> trả về <code>ERR SELECT is not allowed in cluster mode</code> — nên mọi database đánh số trong mã nguồn đều biến thành một cuộc di trú sang tiền tố khoá trước khi chuyển được. Các thao tác trên toàn không gian khoá chỉ trả lời cho đúng cái nút bạn hỏi: <code>KEYS</code>, <code>SCAN</code>, <code>DBSIZE</code>, <code>FLUSHALL</code> và <code>--bigkeys</code> đều phải chạy trên TỪNG máy chính rồi gộp lại, và <code>redis-cli --cluster call</code> sinh ra đúng cho việc ấy. Còn <code>PUBLISH</code> cổ điển được lan truyền tới mọi nút qua bus của cluster, nên lưu lượng phát tăng theo kích thước cluster thay vì chia ra — đây là phần duy nhất của Cluster càng thêm máy càng tệ. <code>SPUBLISH</code>/<code>SSUBSCRIBE</code> (7.0) băm tên kênh như một khoá và chữa được, nhưng chỉ khi client của bạn chịu dùng chúng.',
          ),
        }),

        // ── Chương 12 — Chẩn đoán ───────────────────────────────────────
        mcq({
          prompt: B(
            'An application sees multi-second latency spikes at regular intervals. <code>SLOWLOG</code> is <b>empty</b>, and <code>instantaneous_ops_per_sec</code> is normal between the spikes. What is the shape, and which numbers confirm it?',
            'Một ứng dụng thấy những cú vọt độ trễ nhiều giây, lặp lại đều đặn. <code>SLOWLOG</code> thì <b>RỖNG</b>, và <code>instantaneous_ops_per_sec</code> bình thường giữa các cú vọt. Đó là hình dạng gì, và những con số nào xác nhận nó?',
          ),
          options: [
            B('A fork — confirm with <code>latest_fork_usec</code>, <code>rdb_last_cow_size</code> and <code>LATENCY LATEST</code>', 'Một cú fork — xác nhận bằng <code>latest_fork_usec</code>, <code>rdb_last_cow_size</code> và <code>LATENCY LATEST</code>'),
            B('A blocking command that finished just under the slowlog threshold, so raise <code>slowlog-max-len</code>', 'Một lệnh chặn vừa vặn dưới ngưỡng slowlog, nên hãy nâng <code>slowlog-max-len</code>'),
            B('A connection leak — confirm with <code>connected_clients</code> and <code>rejected_connections</code>', 'Một chỗ rò kết nối — xác nhận bằng <code>connected_clients</code> và <code>rejected_connections</code>'),
            B('Eviction pressure — confirm with <code>evicted_keys</code> and <code>maxmemory_policy</code>', 'Áp lực đẩy khoá — xác nhận bằng <code>evicted_keys</code> và <code>maxmemory_policy</code>'),
          ],
          correct: 0,
          explanation: EX(
            'An empty slowlog during a stall is the tell: no <em>command</em> was slow, the whole process was stopped. <code>LATENCY LATEST</code> attributes spikes by cause rather than by command — <code>fork</code>, <code>expire-cycle</code>, <code>aof-write</code>, <code>eviction-del</code>, <code>command</code> — and a spike attributed to <code>fork</code> is the confirmation. A normal fork costs roughly a millisecond per gigabyte; tens of milliseconds per gigabyte means Transparent Huge Pages is on, so copy-on-write copies 2 MB at a time instead of 4 KB. The fixes are host-level and outside <code>redis.conf</code>: THP set to <code>never</code>, <code>vm.overcommit_memory=1</code>, backups moved to a replica so the primary never forks for them, and save points widened if snapshots run more often than the RPO requires.',
            'Slowlog rỗng giữa lúc khựng chính là dấu hiệu: không có LỆNH nào chậm cả, mà cả tiến trình bị dừng. <code>LATENCY LATEST</code> quy các cú vọt theo NGUYÊN NHÂN chứ không theo lệnh — <code>fork</code>, <code>expire-cycle</code>, <code>aof-write</code>, <code>eviction-del</code>, <code>command</code> — và một cú vọt được quy cho <code>fork</code> chính là lời xác nhận. Một cú fork bình thường tốn khoảng một mili giây cho mỗi gigabyte; hàng chục mili giây mỗi gigabyte nghĩa là Transparent Huge Pages đang bật, nên sao-chép-khi-ghi phải chép 2 MB một lần thay vì 4 KB. Cách chữa nằm ở tầng máy chủ và ngoài <code>redis.conf</code>: đặt THP thành <code>never</code>, đặt <code>vm.overcommit_memory=1</code>, chuyển việc sao lưu sang một replica để máy chính không bao giờ phải fork vì nó, và nới rộng các mốc lưu nếu ảnh chụp chạy dày hơn mức RPO đòi hỏi.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. One <code>SLOWLOG</code> entry looks like this. What is the third field, and what else should you know about the slowlog?' + code(
              '> SLOWLOG GET 1\n' +
              '2  1788997361  3  GET slowprobe  127.0.0.1:44622',
            ),
            'Chạy thật trên Redis 7.4.9. Một mục <code>SLOWLOG</code> trông như thế này. Trường thứ ba là gì, và còn cần biết gì nữa về slowlog?' + code(
              '> SLOWLOG GET 1\n' +
              '2  1788997361  3  GET slowprobe  127.0.0.1:44622',
            ),
          ),
          options: [
            B('Milliseconds; the log holds 1024 entries by default and is written to the AOF alongside the commands', 'Mili giây; nhật ký giữ 1024 mục theo mặc định và được ghi vào AOF cùng với các câu lệnh'),
            B('The number of keys touched; the log is unbounded and must be trimmed with <code>SLOWLOG RESET</code>', 'Số khoá bị chạm tới; nhật ký không có giới hạn và phải cắt bớt bằng <code>SLOWLOG RESET</code>'),
            B('Microseconds; the log is in memory, holds 128 entries by default, and is lost on every restart', 'Micro giây; nhật ký nằm trong bộ nhớ, giữ 128 mục theo mặc định, và mất sạch sau mỗi lần khởi động lại'),
            B('Seconds since the command started; the log is per-connection and resets when that client disconnects', 'Số giây kể từ khi lệnh bắt đầu; nhật ký theo từng kết nối và bị đặt lại khi client đó ngắt kết nối'),
          ],
          correct: 2,
          explanation: EX(
            'The fields are id, unix timestamp, <b>duration in microseconds</b>, the command with its arguments, the client address and the client name — so a value of 214882 that people read as "214 seconds" is 215 milliseconds, and this entry took 3 µs. Measured defaults on this server: <code>slowlog-log-slower-than</code> is 10000 µs (10 ms) and <code>slowlog-max-len</code> is 128. Two consequences follow. The slowlog is a diagnostic you read during an incident, not a metric you trend — it is in memory, small, and gone on restart, so scrape it if you want history. And that is one more reason not to restart first when something is wrong: a restart erases the slowlog, the latency history and every <code>INFO</code> counter, so the command that caused the incident becomes unknowable and it happens again next week.',
            'Các trường lần lượt là id, dấu thời gian unix, <b>thời lượng tính bằng MICRO giây</b>, câu lệnh cùng tham số, địa chỉ client và tên client — nên một giá trị 214882 mà người ta đọc thành "214 giây" thật ra là 215 mili giây, còn mục này tốn 3 µs. Mặc định đo được trên máy chủ này: <code>slowlog-log-slower-than</code> là 10000 µs (10 ms) và <code>slowlog-max-len</code> là 128. Từ đó suy ra hai điều. Slowlog là công cụ chẩn đoán bạn ĐỌC lúc sự cố, không phải chỉ số để vẽ xu hướng — nó nằm trong bộ nhớ, nhỏ, và mất khi khởi động lại, nên hãy thu gom nếu muốn có lịch sử. Và đó là thêm một lý do đừng khởi động lại đầu tiên khi có chuyện: một lần khởi động lại xoá sạch slowlog, lịch sử độ trễ và mọi bộ đếm <code>INFO</code>, nên cái lệnh gây ra sự cố trở thành không thể biết được, và tuần sau nó lại xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on a freshly started Redis 7.4.9.' + code(
              '> CONFIG GET latency-monitor-threshold\n' +
              '1) "latency-monitor-threshold"\n' +
              '2) "0"\n' +
              '> LATENCY LATEST\n' +
              '(empty array)',
            ) + 'What should you conclude?',
            'Chạy thật trên một Redis 7.4.9 vừa khởi động.' + code(
              '> CONFIG GET latency-monitor-threshold\n' +
              '1) "latency-monitor-threshold"\n' +
              '2) "0"\n' +
              '> LATENCY LATEST\n' +
              '(empty array)',
            ) + 'Bạn nên kết luận gì?',
          ),
          options: [
            B('The instance has had no latency events since it started, which is what an empty array means', 'Instance chưa gặp sự kiện độ trễ nào từ lúc khởi động, và mảng rỗng nghĩa là như vậy'),
            B('The latency monitor is off by default and records nothing — set the threshold today, before an incident', 'Bộ theo dõi độ trễ mặc định tắt và không ghi gì cả — hãy đặt ngưỡng ngay hôm nay, trước khi có sự cố'),
            B('<code>LATENCY LATEST</code> requires an LFU policy, exactly like <code>OBJECT FREQ</code> and <code>--hotkeys</code>', '<code>LATENCY LATEST</code> đòi chính sách LFU, y hệt <code>OBJECT FREQ</code> và <code>--hotkeys</code>'),
            B('A threshold of 0 means "record everything", so the empty array proves the instance is perfectly healthy', 'Ngưỡng bằng 0 nghĩa là "ghi tất cả", nên mảng rỗng chứng minh instance hoàn toàn khoẻ mạnh'),
          ],
          correct: 1,
          explanation: EX(
            'A threshold of 0 disables the latency monitor entirely, so <code>LATENCY LATEST</code>, <code>LATENCY HISTORY</code> and <code>LATENCY DOCTOR</code> have nothing to report and will still have nothing to report during the incident you wanted them for. Set <code>latency-monitor-threshold 100</code> on every instance while nothing is wrong — it is the framework that attributes a spike to <code>fork</code> rather than to a command, which is the single distinction that separates a two-minute diagnosis from a two-hour one. Note the family of policy-bound commands it is easy to confuse this with: <code>OBJECT FREQ</code> and <code>redis-cli --hotkeys</code> genuinely do require an <code>*-lfu</code> policy and error without one, while <code>OBJECT IDLETIME</code> requires LRU. Those are different mechanisms with different prerequisites.',
            'Ngưỡng bằng 0 là TẮT hẳn bộ theo dõi độ trễ, nên <code>LATENCY LATEST</code>, <code>LATENCY HISTORY</code> và <code>LATENCY DOCTOR</code> chẳng có gì để báo, và cũng sẽ chẳng có gì để báo vào đúng lúc sự cố mà bạn cần tới chúng. Hãy đặt <code>latency-monitor-threshold 100</code> trên mọi instance ngay lúc chưa có chuyện gì — đó là bộ khung quy một cú vọt cho <code>fork</code> thay vì cho một câu lệnh, và chính sự phân biệt ấy tách một chẩn đoán hai phút khỏi một chẩn đoán hai giờ. Chú ý cả nhóm lệnh gắn với chính sách mà người ta hay lẫn với cái này: <code>OBJECT FREQ</code> và <code>redis-cli --hotkeys</code> thật sự đòi một chính sách <code>*-lfu</code> và báo lỗi nếu không có, còn <code>OBJECT IDLETIME</code> thì đòi LRU. Đó là những cơ chế khác nhau với điều kiện tiên quyết khác nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'An instance is using far more memory than expected. Which tool answers "which key is responsible", and what is the difference between the two obvious candidates?',
            'Một instance đang dùng bộ nhớ nhiều hơn dự kiến rất nhiều. Công cụ nào trả lời được "khoá nào chịu trách nhiệm", và hai ứng viên hiển nhiên khác nhau ở chỗ nào?',
          ),
          options: [
            B('They are aliases of the same scan; the second name exists only for readability in scripts', 'Chúng là hai tên của cùng một phép quét; tên thứ hai chỉ tồn tại cho dễ đọc trong script'),
            B('<code>--bigkeys</code> is exact and <code>--memkeys</code> is sampled, so only the first can be trusted for a decision', '<code>--bigkeys</code> là chính xác còn <code>--memkeys</code> là lấy mẫu, nên chỉ cái đầu mới đáng tin để ra quyết định'),
            B('<code>--bigkeys</code> uses <code>KEYS</code> internally and must not be run on production; <code>--memkeys</code> uses <code>SCAN</code>', '<code>--bigkeys</code> bên trong dùng <code>KEYS</code> nên không được chạy trên production; <code>--memkeys</code> thì dùng <code>SCAN</code>'),
            B('<code>--bigkeys</code> ranks by element count and <code>--memkeys</code> by bytes; the second is usually the question you meant', '<code>--bigkeys</code> xếp theo SỐ PHẦN TỬ còn <code>--memkeys</code> xếp theo BYTE; cái thứ hai thường mới là câu bạn định hỏi'),
          ],
          correct: 3,
          explanation: EX(
            'A 50-field hash holding megabyte values beats a 500,000-field hash of tiny integers, and only <code>--memkeys</code> will tell you so — <code>--bigkeys</code> reports the biggest key per type by element count, which is a different question and often the wrong one when memory is the problem. Both are safe on production because both iterate with <code>SCAN</code> under the hood, as do <code>--scan</code>, <code>--hotkeys</code> and <code>--stat</code>; that is exactly why they exist. Two companions are worth knowing: <code>MEMORY USAGE key SAMPLES 0</code> is exact rather than sampled, and correspondingly O(N), so do not run it on a huge key during an incident; and <code>redis-cli --intrinsic-latency</code>, run <em>on the Redis host</em>, measures the machine\'s own scheduling floor and settles whether the problem is Redis or the hardware underneath it.',
            'Một hash 50 trường chứa các giá trị cỡ megabyte còn nặng hơn một hash 500.000 trường toàn số nguyên bé tí, và chỉ <code>--memkeys</code> mới nói cho bạn biết điều đó — <code>--bigkeys</code> báo khoá lớn nhất theo từng kiểu tính theo SỐ PHẦN TỬ, một câu hỏi khác, và thường là câu hỏi sai khi vấn đề là bộ nhớ. Cả hai đều an toàn trên production vì cả hai đều duyệt bằng <code>SCAN</code> bên dưới, giống như <code>--scan</code>, <code>--hotkeys</code> và <code>--stat</code>; đó chính là lý do chúng tồn tại. Hai người bạn đồng hành đáng biết: <code>MEMORY USAGE khoá SAMPLES 0</code> là chính xác chứ không lấy mẫu, và tương ứng là O(N), nên đừng chạy nó lên một khoá khổng lồ giữa lúc sự cố; và <code>redis-cli --intrinsic-latency</code>, chạy TRÊN CHÍNH MÁY CHỦ Redis, đo mức sàn độ trễ điều phối của bản thân cái máy và phân xử dứt điểm rằng vấn đề là Redis hay là phần cứng bên dưới.',
          ),
        }),

        mcq({
          prompt: B(
            'You want to know what a production instance is actually spending its time on. Why is sampling <code>INFO commandstats</code> twice a better answer than <code>MONITOR</code>?',
            'Bạn muốn biết một instance production thật sự đang tiêu thời gian vào việc gì. Vì sao lấy mẫu <code>INFO commandstats</code> hai lần lại là câu trả lời tốt hơn <code>MONITOR</code>?',
          ),
          options: [
            B('<code>MONITOR</code> shows only write commands, so it cannot answer a question about read-heavy load', '<code>MONITOR</code> chỉ hiện các lệnh ghi, nên nó không trả lời được câu hỏi về tải nặng phần đọc'),
            B('<code>MONITOR</code> requires the <code>@admin</code> category, which application users do not have anyway', '<code>MONITOR</code> đòi nhóm quyền <code>@admin</code>, mà user ứng dụng thì vốn không có'),
            B('<code>commandstats</code> is reset by <code>CONFIG RESETSTAT</code>, so two samples give an exact per-second rate', '<code>commandstats</code> bị <code>CONFIG RESETSTAT</code> đặt lại, nên hai lần lấy mẫu cho tỷ lệ mỗi giây chính xác'),
            B('<code>MONITOR</code> streams every command, costing throughput and buffer memory, and exposes every value', '<code>MONITOR</code> phát ra mọi câu lệnh, tốn thông lượng và bộ nhớ đệm, và phơi bày mọi giá trị'),
          ],
          correct: 3,
          explanation: EX(
            'Redis has to format and write every executed command to that socket, which measurably reduces throughput on a busy instance — the documentation puts it at roughly half in its own benchmark — and the output accumulates in a client output buffer that counts toward <code>maxmemory</code>, so a <code>MONITOR</code> session on an already-full instance can push it over. It also displays every key and value, session tokens included, to whoever is looking at the terminal. Two samples of <code>INFO commandstats</code> ten seconds apart, diffed, give you the call count and <code>usec_per_call</code> of every command over that interval with no streaming and no cost — and <code>usec_per_call</code> is precisely the line that names your p99, showing for example <code>HGETALL</code> at 1200 µs against <code>GET</code> at 2 µs. If you must use <code>MONITOR</code>, never on a struggling instance, and always with a timeout and a filter so it cannot be forgotten.',
            'Redis phải định dạng và ghi MỌI câu lệnh đã thực thi ra cái socket đó, việc này làm giảm thông lượng một cách đo được trên một instance bận — tài liệu ước chừng còn khoảng một nửa trong phép đo của chính họ — và phần xuất ra tích lại trong một bộ đệm ra của client, mà bộ đệm ấy tính vào <code>maxmemory</code>, nên một phiên <code>MONITOR</code> trên một instance vốn đã đầy có thể đẩy nó tràn. Nó còn hiện ra mọi khoá và mọi giá trị, kể cả token phiên đăng nhập, cho bất kỳ ai đang nhìn màn hình. Hai lần lấy mẫu <code>INFO commandstats</code> cách nhau mười giây rồi lấy hiệu sẽ cho bạn số lượt gọi và <code>usec_per_call</code> của từng lệnh trong khoảng đó, không phát dòng nào và không tốn gì — mà <code>usec_per_call</code> đúng là cái dòng gọi tên p99 của bạn, chẳng hạn <code>HGETALL</code> ở 1200 µs so với <code>GET</code> ở 2 µs. Nếu buộc phải dùng <code>MONITOR</code> thì tuyệt đối không dùng trên một instance đang vật vã, và luôn kèm hạn giờ cùng một bộ lọc để nó không thể bị bỏ quên.',
          ),
        }),

        mcq({
          prompt: B(
            'Run for real on Redis 7.4.9. Why does <code>COMMAND GETKEYS</code> exist, given the second and third lines?' + code(
              '> COMMAND GETKEYS ZADD myzset 1 a\n' +
              '1) "myzset"\n' +
              '> COMMAND GETKEYS EVAL "return 1" 2 k1 k2 a1\n' +
              '1) "k1"\n' +
              '2) "k2"\n' +
              '> COMMAND GETKEYS GEORADIUS vn 1 1 1 km STORE dst\n' +
              '1) "vn"\n' +
              '2) "dst"',
            ),
            'Chạy thật trên Redis 7.4.9. Vì sao <code>COMMAND GETKEYS</code> tồn tại, nhìn vào dòng thứ hai và thứ ba?' + code(
              '> COMMAND GETKEYS ZADD myzset 1 a\n' +
              '1) "myzset"\n' +
              '> COMMAND GETKEYS EVAL "return 1" 2 k1 k2 a1\n' +
              '1) "k1"\n' +
              '2) "k2"\n' +
              '> COMMAND GETKEYS GEORADIUS vn 1 1 1 km STORE dst\n' +
              '1) "vn"\n' +
              '2) "dst"',
            ),
          ),
          options: [
            B('Some commands are flagged <code>movablekeys</code>: their key positions depend on the arguments, so guessing fails', 'Một số lệnh được gắn cờ <code>movablekeys</code>: vị trí khoá của chúng phụ thuộc vào tham số, nên đoán là hỏng'),
            B('It validates that the named keys exist, which is why a missing key would be omitted from the reply', 'Nó kiểm tra các khoá được nêu có tồn tại không, vì thế một khoá thiếu sẽ bị lược khỏi câu trả lời'),
            B('It computes the cluster slot for each key, replacing <code>CLUSTER KEYSLOT</code> for multi-key commands', 'Nó tính slot cluster cho từng khoá, thay cho <code>CLUSTER KEYSLOT</code> ở các lệnh nhiều khoá'),
            B('It exists only for <code>redis-cli</code> to colourise output, and has no use inside an application', 'Nó chỉ tồn tại để <code>redis-cli</code> tô màu kết quả, và không có tác dụng gì bên trong một ứng dụng'),
          ],
          correct: 0,
          explanation: EX(
            'For <code>ZADD</code> the key is always argument one and no tooling is needed. For <code>EVAL</code> the key positions depend on a <code>numkeys</code> argument, and for <code>GEORADIUS</code> a <code>STORE</code> clause adds a destination key anywhere in the argument list — those commands carry the <code>movablekeys</code> flag, visible in <code>COMMAND INFO</code>, and there is no static rule that finds their keys. That matters in three places: ACL key patterns have to be checked against the real keys, Cluster routes a command from its declared keys, and any proxy or middleware you write needs the same answer. <code>COMMAND INFO</code> also gives you the flags, and <code>denyoom</code> is the one that tells you a command will be refused when memory is full.',
            'Với <code>ZADD</code> thì khoá luôn là tham số thứ nhất và chẳng cần công cụ nào. Với <code>EVAL</code> thì vị trí các khoá phụ thuộc vào tham số <code>numkeys</code>, còn với <code>GEORADIUS</code> thì mệnh đề <code>STORE</code> thêm một khoá đích ở bất kỳ đâu trong danh sách tham số — những lệnh đó mang cờ <code>movablekeys</code>, nhìn thấy được trong <code>COMMAND INFO</code>, và không có quy tắc tĩnh nào tìm ra khoá của chúng. Chuyện đó quan trọng ở ba chỗ: mẫu khoá của ACL phải được đối chiếu với khoá thật, Cluster định tuyến một lệnh theo các khoá đã khai, và bất kỳ proxy hay lớp trung gian nào bạn tự viết cũng cần đúng câu trả lời ấy. <code>COMMAND INFO</code> còn cho bạn các cờ, và <code>denyoom</code> là cờ nói rằng lệnh này sẽ bị từ chối khi bộ nhớ đầy.',
          ),
        }),

        mcq({
          prompt: B(
            'Which set of Prometheus alert rules is worth keeping, and why?' + code(
              'A  redis_memory_used / redis_memory_max > 0.75   for: 10m\n' +
              'B  increase(redis_evicted_keys_total[10m]) > 0\n' +
              'C  redis_keyspace_hits / (hits + misses) < 0.9\n' +
              'D  redis_mem_fragmentation_ratio > 1.5',
            ),
            'Bộ luật cảnh báo Prometheus nào đáng giữ, và vì sao?' + code(
              'A  redis_memory_used / redis_memory_max > 0.75   for: 10m\n' +
              'B  increase(redis_evicted_keys_total[10m]) > 0\n' +
              'C  redis_keyspace_hits / (hits + misses) < 0.9\n' +
              'D  redis_mem_fragmentation_ratio > 1.5',
            ),
          ),
          options: [
            B('C and D: they catch degradation early, while A and B only fire once damage has already been done', 'C và D: chúng bắt được sự suy giảm từ sớm, còn A và B chỉ kêu khi thiệt hại đã xảy ra rồi'),
            B('All four, because more coverage is strictly safer than less on a component this central', 'Cả bốn, vì phủ nhiều hơn thì chắc chắn an toàn hơn phủ ít, với một thành phần trung tâm như thế này'),
            B('A and B: alert before the wall and on a counter moving; C has no units and D spikes on healthy instances', 'A và B: cảnh báo TRƯỚC khi chạm tường và khi một bộ đếm nhúc nhích; C không có đơn vị còn D vọt lên cả trên máy khoẻ'),
            B('B and D only, because a percentage-of-limit alert duplicates what the eviction counter already tells you', 'Chỉ B và D, vì cảnh báo theo phần trăm của trần chỉ lặp lại điều mà bộ đếm đẩy khoá đã nói'),
          ],
          correct: 2,
          explanation: EX(
            'Alert at 75% rather than 100%, with a <code>for:</code> clause, because an alert that fires when memory is already full leaves you no time to do anything but restart. Alert on cumulative counters <em>moving</em> rather than on their value, because <code>evicted_keys</code> and <code>rejected_connections</code> never come back down and a raw threshold fires forever after one bad afternoon. The two to delete are noisy on healthy instances: hit ratio has no units and is trivially gameable — lengthen the TTL and it rises along with staleness — while fragmentation spikes for a minute or two after every large deletion. The cost of those is not the noise, it is the habit: a team trained to dismiss Redis pages will dismiss the one that mattered. Put them on a dashboard, where they are useful context and interrupt nobody.',
            'Hãy cảnh báo ở 75% thay vì 100%, kèm mệnh đề <code>for:</code>, vì một cảnh báo kêu lúc bộ nhớ đã đầy thì không chừa cho bạn thời gian làm gì ngoài khởi động lại. Hãy cảnh báo khi các bộ đếm cộng dồn NHÚC NHÍCH chứ không theo giá trị của chúng, vì <code>evicted_keys</code> và <code>rejected_connections</code> không bao giờ tụt xuống, nên một ngưỡng theo số thô sẽ kêu mãi mãi sau một buổi chiều tồi tệ. Hai cái đáng xoá thì ồn ào ngay trên máy khoẻ mạnh: tỷ lệ trúng không mang đơn vị và cực dễ lách — kéo dài TTL là nó tăng, cùng với độ cũ của dữ liệu — còn phân mảnh thì vọt lên một hai phút sau mỗi lần xoá lớn. Cái giá của chúng không phải là tiếng ồn mà là THÓI QUEN: một đội đã quen gạt các cảnh báo Redis đi sẽ gạt luôn cái cảnh báo có ý nghĩa. Hãy đưa chúng lên bảng điều khiển, nơi chúng là bối cảnh hữu ích và không làm phiền ai.',
          ),
        }),

        mcq({
          prompt: B(
            'Three failure shapes show <b>green on every Redis server metric</b>: a stampede, a silently stale cache, and a queue whose workers died. What follows from that?',
            'Ba hình dạng sự cố hiện <b>màu xanh trên mọi chỉ số phía máy chủ Redis</b>: một cú giẫm đạp, một bộ đệm cũ một cách âm thầm, và một hàng đợi mà các worker đã chết. Suy ra được gì?',
          ),
          options: [
            B('They are not Redis problems, so a correctly configured Redis makes all three impossible by construction', 'Chúng không phải vấn đề của Redis, nên một Redis cấu hình đúng làm cả ba trở thành bất khả về mặt cấu tạo'),
            B('Server metrics say whether Redis is healthy; only your own instrumentation says whether your use of it is', 'Chỉ số phía máy chủ nói Redis có khoẻ không; chỉ phần đo đạc của CHÍNH BẠN mới nói cách bạn dùng nó có ổn không'),
            B('They are visible in <code>INFO</code> if you sample it often enough, since all three eventually move a counter', 'Chúng vẫn thấy được trong <code>INFO</code> nếu lấy mẫu đủ dày, vì cả ba rốt cuộc đều làm một bộ đếm nhúc nhích'),
            B('They can only occur on a managed Redis, where you cannot see the underlying host or its metrics', 'Chúng chỉ xảy ra trên Redis có người quản trị hộ, nơi bạn không nhìn thấy máy chủ bên dưới và chỉ số của nó'),
          ],
          correct: 1,
          explanation: EX(
            'In a stampede Redis is idle and correct while the database is on fire; in a stale-cache incident nothing failed anywhere, because a correct invalidation raced a slow reader or a read filled the cache from a lagging replica; and a dead worker pool leaves Redis perfectly healthy with nothing being processed. None of that is visible from <code>INFO</code>, and all of it is visible from your application if you instrument it: per-cache hit and miss counters tagged by cache name, the measured latency of a cache miss, queue depth from <code>XINFO GROUPS</code>, a consumer heartbeat, and the age of the oldest unacknowledged entry. That is a few dozen lines and it converts the three longest-to-diagnose incidents into three obvious graphs. It is also why <code>blocked_clients</code> is worth an alert — it is your consumer count made visible, and nothing else in server-side monitoring reports that the workers are gone.',
            'Trong một cú giẫm đạp thì Redis rảnh rỗi và hoàn toàn đúng đắn trong khi cơ sở dữ liệu bốc cháy; trong một sự cố bộ đệm cũ thì chẳng có gì hỏng ở đâu cả, vì một lệnh vô hiệu hoá đúng đã chạy đua với một người đọc chậm, hoặc một lượt đọc đã lấp bộ đệm từ một replica đang trễ; còn một đội worker chết thì để lại một Redis khoẻ mạnh hoàn hảo mà chẳng có gì được xử lý. Không thứ nào trong đó nhìn thấy được từ <code>INFO</code>, và tất cả đều nhìn thấy được từ ứng dụng của bạn nếu bạn chịu đo đạc: bộ đếm trúng và trượt theo TỪNG bộ đệm gắn nhãn theo tên, độ trễ đo được của một lần trượt, độ sâu hàng đợi lấy từ <code>XINFO GROUPS</code>, một nhịp tim của consumer, và tuổi của mục chưa xác nhận cũ nhất. Đó là vài chục dòng mã và nó biến ba sự cố lâu chẩn đoán nhất thành ba cái biểu đồ hiển nhiên. Đó cũng là lý do <code>blocked_clients</code> đáng được đặt cảnh báo — nó là số worker của bạn được nhìn thấy, và không gì khác trong giám sát phía máy chủ báo cho bạn biết các worker đã biến mất.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Four eviction policies, and the one that fails silently (chapter 9).</b> No Redis server is involved: you are re-deriving what <code>maxmemory</code> plus a policy actually does. The starter gives you a fixed keyspace where each key has a size in bytes, a <code>ttl</code> (seconds remaining, or <code>null</code> for no expiry) and a <code>lastAccess</code> timestamp.</p>' +
            '<p>Implement <code>admit(policy, store, incoming, maxBytes)</code>. <code>store</code> is an array of key objects; <b>do not modify it</b> — work on a copy.</p>' +
            '<ul>' +
            '<li>Used bytes is the sum of <code>bytes</code> over the surviving keys. The write is admitted only if <code>used + incoming.bytes &lt;= maxBytes</code>.</li>' +
            '<li>While it does not fit, pick <b>one victim</b> from the <b>eligible</b> keys and remove it: <code>allkeys-*</code> considers every key, <code>volatile-*</code> considers only keys whose <code>ttl</code> is not <code>null</code>.</li>' +
            '<li><code>noeviction</code> never removes anything. <code>allkeys-lru</code> and <code>volatile-lru</code> pick the smallest <code>lastAccess</code>. <code>volatile-ttl</code> picks the smallest <code>ttl</code>. Break every tie by <code>name</code> ascending, so the result is deterministic.</li>' +
            '<li>If it still does not fit and there is <b>no eligible key left</b>, stop: return <code>{ ok: false, error: &quot;OOM&quot;, evicted, used }</code> with the evictions you did manage.</li>' +
            '</ul>' +
            '<p>On success return <code>{ ok: true, evicted, used }</code>, where <code>evicted</code> is the victim names <b>in the order removed</b> and <code>used</code> is the final used bytes <b>including</b> the incoming key.</p>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Bốn chính sách đẩy khoá, và cái hỏng một cách âm thầm (chương 9).</b> Không có máy chủ Redis nào tham gia: bạn đang dựng lại xem <code>maxmemory</code> cộng một chính sách thật sự làm gì. Đề cho sẵn một không gian khoá cố định, mỗi khoá có kích thước tính bằng byte, một <code>ttl</code> (số giây còn lại, hoặc <code>null</code> nếu không đặt hạn) và một mốc <code>lastAccess</code>.</p>' +
            '<p>Hãy cài đặt <code>admit(policy, store, incoming, maxBytes)</code>. <code>store</code> là một mảng các đối tượng khoá; <b>không được sửa nó</b> — hãy làm trên một bản sao.</p>' +
            '<ul>' +
            '<li>Số byte đang dùng là tổng <code>bytes</code> của những khoá còn sống. Lượt ghi chỉ được nhận nếu <code>used + incoming.bytes &lt;= maxBytes</code>.</li>' +
            '<li>Chừng nào còn chưa vừa, hãy chọn <b>MỘT nạn nhân</b> trong số các khoá <b>đủ điều kiện</b> rồi gỡ nó: <code>allkeys-*</code> xét mọi khoá, còn <code>volatile-*</code> chỉ xét những khoá có <code>ttl</code> khác <code>null</code>.</li>' +
            '<li><code>noeviction</code> không bao giờ gỡ gì. <code>allkeys-lru</code> và <code>volatile-lru</code> chọn <code>lastAccess</code> nhỏ nhất. <code>volatile-ttl</code> chọn <code>ttl</code> nhỏ nhất. Mọi trường hợp bằng nhau thì phá hoà bằng <code>name</code> tăng dần, để kết quả là tất định.</li>' +
            '<li>Nếu vẫn chưa vừa mà <b>không còn khoá nào đủ điều kiện</b>, hãy dừng: trả về <code>{ ok: false, error: &quot;OOM&quot;, evicted, used }</code> kèm những lượt đẩy mà bạn đã kịp làm.</li>' +
            '</ul>' +
            '<p>Khi thành công, trả về <code>{ ok: true, evicted, used }</code>, với <code>evicted</code> là tên các nạn nhân <b>theo đúng thứ tự bị gỡ</b> và <code>used</code> là số byte đang dùng cuối cùng, <b>đã tính cả</b> khoá vừa ghi vào.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không được require gì cả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// ttl = null nghĩa là KHÔNG có hạn — đúng thứ mà volatile-* không đụng tới được.\n' +
            'const STORE = [\n' +
            "  { name: 'cache:a', bytes: 300, ttl: 60,   lastAccess: 10 },\n" +
            "  { name: 'cache:b', bytes: 300, ttl: 30,   lastAccess: 50 },\n" +
            "  { name: 'cache:c', bytes: 300, ttl: 120,  lastAccess: 20 },\n" +
            "  { name: 'queue:jobs', bytes: 400, ttl: null, lastAccess: 5  },\n" +
            "  { name: 'lock:x',     bytes: 100, ttl: null, lastAccess: 1  },\n" +
            '];\n\n' +
            '// Cùng dữ liệu nhưng KHÔNG khoá nào có TTL — cái bẫy volatile.\n' +
            'const NO_TTL = STORE.map((k) => ({ ...k, ttl: null }));\n\n' +
            "const INCOMING = { name: 'cache:new', bytes: 500 };\n" +
            'const MAX = 1600;\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function admit(policy, store, incoming, maxBytes) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label + ' ' + JSON.stringify(v));\n" +
            "for (const p of ['noeviction', 'allkeys-lru', 'volatile-lru', 'volatile-ttl']) {\n" +
            "  show((p + ' · có TTL   :').padEnd(26), admit(p, STORE, INCOMING, MAX));\n" +
            '}\n' +
            "for (const p of ['allkeys-lru', 'volatile-lru', 'volatile-ttl']) {\n" +
            "  show((p + ' · KHÔNG TTL:').padEnd(26), admit(p, NO_TTL, INCOMING, MAX));\n" +
            '}\n' +
            "show('vừa khít, không đẩy      :', admit('allkeys-lru', STORE, { name: 'x', bytes: 200 }, MAX));\n" +
            "show('kho rỗng                 :', admit('allkeys-lru', [], INCOMING, MAX));\n" +
            "show('một mình đã quá to       :', admit('allkeys-lru', STORE, { name: 'huge', bytes: 9999 }, MAX));\n" +
            "show('STORE không bị sửa       :', STORE.length);\n",
          expectedOutput:
            'noeviction · có TTL   :    {"ok":false,"error":"OOM","evicted":[],"used":1400}\n' +
            'allkeys-lru · có TTL   :   {"ok":true,"evicted":["lock:x","queue:jobs"],"used":1400}\n' +
            'volatile-lru · có TTL   :  {"ok":true,"evicted":["cache:a"],"used":1600}\n' +
            'volatile-ttl · có TTL   :  {"ok":true,"evicted":["cache:b"],"used":1600}\n' +
            'allkeys-lru · KHÔNG TTL:   {"ok":true,"evicted":["lock:x","queue:jobs"],"used":1400}\n' +
            'volatile-lru · KHÔNG TTL:  {"ok":false,"error":"OOM","evicted":[],"used":1400}\n' +
            'volatile-ttl · KHÔNG TTL:  {"ok":false,"error":"OOM","evicted":[],"used":1400}\n' +
            'vừa khít, không đẩy      : {"ok":true,"evicted":[],"used":1600}\n' +
            'kho rỗng                 : {"ok":true,"evicted":[],"used":500}\n' +
            'một mình đã quá to       : {"ok":false,"error":"OOM","evicted":["lock:x","queue:jobs","cache:a","cache:c","cache:b"],"used":0}\n' +
            'STORE không bị sửa       : 5',
          sampleSolution:
            'function admit(policy, store, incoming, maxBytes) {\n' +
            '  const live = store.map((k) => ({ ...k }));   // bản sao: không đụng vào STORE\n' +
            '  const evicted = [];\n' +
            '  const used = () => live.reduce((s, k) => s + k.bytes, 0);\n' +
            '\n' +
            "  const volatileOnly = policy.startsWith('volatile-');\n" +
            "  const byTtl = policy.endsWith('-ttl');\n" +
            '\n' +
            '  while (used() + incoming.bytes > maxBytes) {\n' +
            "    if (policy === 'noeviction') {\n" +
            "      return { ok: false, error: 'OOM', evicted, used: used() };\n" +
            '    }\n' +
            '    // volatile-* CHỈ xét khoá có TTL. Không có cái nào ⇒ hành xử y như noeviction.\n' +
            '    const eligible = volatileOnly ? live.filter((k) => k.ttl !== null) : live;\n' +
            '    if (eligible.length === 0) {\n' +
            "      return { ok: false, error: 'OOM', evicted, used: used() };\n" +
            '    }\n' +
            '    const rank = (k) => (byTtl ? k.ttl : k.lastAccess);\n' +
            '    let victim = eligible[0];\n' +
            '    for (const k of eligible) {\n' +
            '      if (rank(k) < rank(victim) || (rank(k) === rank(victim) && k.name < victim.name)) victim = k;\n' +
            '    }\n' +
            '    live.splice(live.indexOf(victim), 1);\n' +
            '    evicted.push(victim.name);\n' +
            '  }\n' +
            '\n' +
            '  return { ok: true, evicted, used: used() + incoming.bytes };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Quorum is not majority (chapter 11).</b> The most common Sentinel misconfiguration is believing that lowering the quorum lets fewer Sentinels perform a failover. It does not, and this question is that distinction written as code. No Redis server is involved.</p>' +
            '<p>Implement <code>decide({ sentinels, quorum, sdownBy, partitions })</code>:</p>' +
            '<ul>' +
            '<li><code>sentinels</code> is the full set of Sentinel names. <code>majority</code> is <code>Math.floor(sentinels.length / 2) + 1</code>.</li>' +
            '<li><code>sdownBy</code> lists the Sentinels that consider the primary subjectively down.</li>' +
            '<li><code>partitions</code> is an array of groups; a Sentinel can only exchange votes with others in its own group. Ignore any name in a group that is not in <code>sentinels</code>.</li>' +
            '<li>A group declares <b>ODOWN</b> when the number of its members that are in <code>sdownBy</code> is <b>at least <code>quorum</code></b>.</li>' +
            '<li>A group can <b>authorise a failover</b> only when it declares ODOWN <b>and</b> its size is at least <code>majority</code>.</li>' +
            '</ul>' +
            '<p>Return <code>{ majority, odown, canFailover, actingGroup }</code>, where <code>odown</code> is true if <b>any</b> group declared it, <code>actingGroup</code> is the <b>first</b> group in the given order that can authorise a failover (its member names, in the order given) or <code>null</code>, and <code>canFailover</code> says whether one exists.</p>' +
            '<p>Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Quorum không phải đa số (chương 11).</b> Cấu hình sai phổ biến nhất của Sentinel là tin rằng hạ quorum xuống thì ít Sentinel hơn cũng chuyển vai được. Không phải vậy, và câu này chính là sự phân biệt ấy viết thành mã. Không có máy chủ Redis nào tham gia.</p>' +
            '<p>Hãy cài đặt <code>decide({ sentinels, quorum, sdownBy, partitions })</code>:</p>' +
            '<ul>' +
            '<li><code>sentinels</code> là toàn bộ tập tên Sentinel. <code>majority</code> là <code>Math.floor(sentinels.length / 2) + 1</code>.</li>' +
            '<li><code>sdownBy</code> liệt kê những Sentinel đang cho rằng máy chính chết theo cảm nhận riêng.</li>' +
            '<li><code>partitions</code> là một mảng các nhóm; một Sentinel chỉ trao đổi phiếu được với các thành viên cùng nhóm. Hãy bỏ qua mọi tên trong nhóm mà không có trong <code>sentinels</code>.</li>' +
            '<li>Một nhóm tuyên bố <b>ODOWN</b> khi số thành viên của nó nằm trong <code>sdownBy</code> <b>đạt ít nhất <code>quorum</code></b>.</li>' +
            '<li>Một nhóm <b>được phép cho chuyển vai</b> chỉ khi nó tuyên bố ODOWN <b>VÀ</b> kích thước của nó đạt ít nhất <code>majority</code>.</li>' +
            '</ul>' +
            '<p>Trả về <code>{ majority, odown, canFailover, actingGroup }</code>, với <code>odown</code> đúng nếu <b>bất kỳ</b> nhóm nào tuyên bố, <code>actingGroup</code> là nhóm <b>ĐẦU TIÊN</b> theo thứ tự đã cho mà được phép chuyển vai (tên các thành viên, theo thứ tự đã cho) hoặc <code>null</code>, và <code>canFailover</code> cho biết có nhóm nào như thế hay không.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const THREE = ['s1', 's2', 's3'];\n" +
            "const FIVE  = ['s1', 's2', 's3', 's4', 's5'];\n" +
            "const WHOLE3 = [['s1', 's2', 's3']];\n" +
            "const WHOLE5 = [['s1', 's2', 's3', 's4', 's5']];\n" +
            "const SPLIT_1_2 = [['s1'], ['s2', 's3']];          // s1 bị tách ra một mình\n" +
            "const SPLIT_2_3 = [['s1', 's2'], ['s3', 's4', 's5']];\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function decide({ sentinels, quorum, sdownBy, partitions }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const show = (label, v) => console.log(label.padEnd(34) + ' ' + JSON.stringify(v));\n" +
            "show('3 sentinel, quorum 2, cả ba thấy:', decide({\n" +
            "  sentinels: THREE, quorum: 2, sdownBy: ['s1', 's2', 's3'], partitions: WHOLE3 }));\n" +
            "show('3 sentinel, quorum 2, một thấy  :', decide({\n" +
            "  sentinels: THREE, quorum: 2, sdownBy: ['s1'], partitions: WHOLE3 }));\n" +
            "show('quorum 1, s1 bị tách riêng      :', decide({\n" +
            "  sentinels: THREE, quorum: 1, sdownBy: ['s1'], partitions: SPLIT_1_2 }));\n" +
            "show('quorum 1, phía 2 cũng thấy     :', decide({\n" +
            "  sentinels: THREE, quorum: 1, sdownBy: ['s1', 's2'], partitions: SPLIT_1_2 }));\n" +
            "show('5 sentinel, quorum 2, chia 2/3 :', decide({\n" +
            "  sentinels: FIVE, quorum: 2, sdownBy: ['s1', 's2', 's3', 's4'], partitions: SPLIT_2_3 }));\n" +
            "show('5 sentinel, quorum 3, chỉ 2 thấy:', decide({\n" +
            "  sentinels: FIVE, quorum: 3, sdownBy: ['s1', 's2'], partitions: WHOLE5 }));\n" +
            "show('không ai thấy gì                :', decide({\n" +
            "  sentinels: THREE, quorum: 2, sdownBy: [], partitions: WHOLE3 }));\n",
          expectedOutput:
            '3 sentinel, quorum 2, cả ba thấy:  {"majority":2,"odown":true,"canFailover":true,"actingGroup":["s1","s2","s3"]}\n' +
            '3 sentinel, quorum 2, một thấy  :  {"majority":2,"odown":false,"canFailover":false,"actingGroup":null}\n' +
            'quorum 1, s1 bị tách riêng      :  {"majority":2,"odown":true,"canFailover":false,"actingGroup":null}\n' +
            'quorum 1, phía 2 cũng thấy     :   {"majority":2,"odown":true,"canFailover":true,"actingGroup":["s2","s3"]}\n' +
            '5 sentinel, quorum 2, chia 2/3 :   {"majority":3,"odown":true,"canFailover":true,"actingGroup":["s3","s4","s5"]}\n' +
            '5 sentinel, quorum 3, chỉ 2 thấy:  {"majority":3,"odown":false,"canFailover":false,"actingGroup":null}\n' +
            'không ai thấy gì                :  {"majority":2,"odown":false,"canFailover":false,"actingGroup":null}',
          sampleSolution:
            'function decide({ sentinels, quorum, sdownBy, partitions }) {\n' +
            '  const known = new Set(sentinels);\n' +
            '  const down = new Set(sdownBy);\n' +
            '  const majority = Math.floor(sentinels.length / 2) + 1;\n' +
            '\n' +
            '  let odown = false;\n' +
            '  let actingGroup = null;\n' +
            '\n' +
            '  for (const raw of partitions) {\n' +
            '    const group = raw.filter((n) => known.has(n));\n' +
            '    const votes = group.filter((n) => down.has(n)).length;\n' +
            '\n' +
            '    // ODOWN chỉ cần QUORUM phiếu bên trong nhóm.\n' +
            '    const groupOdown = votes >= quorum;\n' +
            '    if (groupOdown) odown = true;\n' +
            '\n' +
            '    // Nhưng cho phép chuyển vai thì cần ĐA SỐ của TOÀN BỘ tập Sentinel.\n' +
            '    // Đó là lý do hạ quorum xuống 1 không giúp một Sentinel lẻ loi làm gì được.\n' +
            '    if (groupOdown && group.length >= majority && actingGroup === null) {\n' +
            '      actingGroup = group;\n' +
            '    }\n' +
            '  }\n' +
            '\n' +
            '  return { majority, odown, canFailover: actingGroup !== null, actingGroup };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
