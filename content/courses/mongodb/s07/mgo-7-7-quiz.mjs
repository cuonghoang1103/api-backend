/**
 * 7.7 — Kiểm tra Chương 7 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 7.1–7.6.
 * Phân bố đáp án: A ×2 (4, 9) · B ×3 (1, 6, 10) · C ×3 (2, 5, 8) · D ×2 (3, 7).
 */
export default {
  title: '7.7 — Chapter 7 quiz|||7.7 — Kiểm tra Chương 7',
  slug: 'mgo-7-7-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 7: oplog ghi kết quả chứ không ghi phép tính, ENOTFOUND r1 khi nối từ laptop, lỗi mạng ECONNRESET nghĩa là gì, docker stop bị giết sau 10 giây, đứt mạng im lặng treo hàng chục giây, thành viên trễ còn phiếu, arbiter (PSA), insertMany có thứ tự trên collection đã shard, khoá tăng dần dồn một shard, khoá ít giá trị sinh range jumbo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Chapter 7 check: replica sets and sharding</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 7.1–7.6 on real containers. They are the failures that turn a "highly available" cluster into lost orders and night calls — and the questions interviewers use to tell people who have run a cluster from people who have read about one.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can build a three-member replica set with Compose and explain why my laptop cannot connect with replicaSet=.</li>
<li>I can read oplog entries and say why they are idempotent.</li>
<li>I can predict what an application sees when the primary is killed, stepped down, or silently cut off — and which driver settings change it.</li>
<li>I can choose member options (priority, votes, hidden, delay) and explain the arbiter trap.</li>
<li>I can say which queries a shard key targets, and spot a monotonic or low-cardinality key.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm Chương 7: replica set và sharding</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 7.1–7.6 trên container thật. Đó là những sự cố biến một cụm "sẵn sàng cao" thành đơn bị mất và cuộc gọi lúc nửa đêm — và là câu hỏi phỏng vấn dùng để phân biệt người đã từng chạy cụm với người chỉ đọc về nó.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được replica set ba thành viên bằng Compose và giải thích được vì sao laptop không nối được bằng replicaSet=.</li>
<li>Tôi đọc được các mục oplog và nói được vì sao chúng idempotent.</li>
<li>Tôi đoán được ứng dụng thấy gì khi primary bị giết, nhường chức, hay bị cắt im lặng — và tham số driver nào thay đổi điều đó.</li>
<li>Tôi chọn được tuỳ chọn thành viên (priority, votes, hidden, delay) và giải thích được bẫy arbiter.</li>
<li>Tôi nói được shard key nhắm đích truy vấn nào, và nhận ra khoá tăng dần hay khoá ít giá trị.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'You run updateOne({ _id: "SP1" }, { $inc: { ton: -1 } }) when ton is 10. What does the oplog entry contain, and why?|||Bạn chạy updateOne({ _id: "SP1" }, { $inc: { ton: -1 } }) khi ton đang là 10. Mục oplog chứa gì, và vì sao?',
        options: [
          '{ $inc: { ton: -1 } } — secondaries replay the same command|||{ $inc: { ton: -1 } } — secondary chạy lại đúng lệnh đó',
          'The result: set ton to 9 — so applying the entry twice still gives 9 (idempotent)|||Kết quả: đặt ton thành 9 — để áp dụng mục đó hai lần vẫn ra 9 (idempotent)',
          'Nothing — single-field updates are not replicated until a checkpoint|||Không gì cả — cập nhật một trường chỉ được nhân bản khi tới checkpoint',
          'The whole document before and after the change|||Toàn bộ tài liệu trước và sau khi đổi',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The lab showed u {"$v":2,"diff":{"u":{"ton":9}}}: the oplog records the outcome, not the operation. A secondary that crashes in the middle of a batch can re-apply entries safely. The same lab showed one updateMany on three documents producing three entries — a million-document update is a million oplog entries.|||VI: Lab cho thấy u {"$v":2,"diff":{"u":{"ton":9}}}: oplog ghi kết quả, không ghi phép tính. Secondary sập giữa một lô vẫn áp dụng lại an toàn. Cùng lab đó, một updateMany trên ba tài liệu sinh ba mục — cập nhật một triệu tài liệu là một triệu mục oplog.',
      },
      {
        question: 'The replica set runs in Docker Compose with members r1, r2, r3; ports 47101–47103 are published on 127.0.0.1. From your laptop, mongodb://127.0.0.1:47101/?replicaSet=rs1 fails with ENOTFOUND r1. Why?|||Replica set chạy trong Docker Compose với các thành viên r1, r2, r3; cổng 47101–47103 mở trên 127.0.0.1. Từ laptop, mongodb://127.0.0.1:47101/?replicaSet=rs1 hỏng với ENOTFOUND r1. Vì sao?',
        options: [
          'The port is not really open — Docker only publishes ports for the primary|||Cổng không thật sự mở — Docker chỉ mở cổng cho primary',
          'The replica set name is wrong|||Sai tên replica set',
          'The driver uses the seed only to read hello().hosts, then connects to the configured names r1/r2/r3, which the laptop cannot resolve|||Driver chỉ dùng máy mồi để đọc hello().hosts, rồi nối tới các tên đã cấu hình r1/r2/r3, mà laptop không phân giải được',
          'mongosh cannot connect to replica sets from outside a container|||mongosh không nối được replica set từ ngoài container',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Members are known by the names in rs.conf(). directConnection=true to one member works (the lab connected to r2 and it said isWritablePrimary: false) but never follows a failover. Applications run in the same network, or members get names every client can resolve (DNS).|||VI: Thành viên được biết bằng tên trong rs.conf(). directConnection=true vào một máy thì nối được (lab nối r2 và nó trả isWritablePrimary: false) nhưng không bao giờ đi theo chuyển dự phòng. Ứng dụng phải chạy trong cùng mạng, hoặc thành viên được đặt tên mà mọi client phân giải được (DNS).',
      },
      {
        question: 'retryWrites is turned off. The primary is killed (SIGKILL) while orders are inserted back to back, and one insert throws MongoNetworkError: read ECONNRESET. What does that tell you about the order, and what is the correct handling?|||retryWrites đang tắt. Primary bị giết (SIGKILL) trong lúc đơn được chèn liên tục, và một lệnh chèn ném MongoNetworkError: read ECONNRESET. Điều đó cho biết gì về đơn hàng, và xử lý đúng là gì?',
        options: [
          'It was not written — tell the customer the order failed|||Chưa được ghi — báo khách đặt đơn thất bại',
          'It was written — tell the customer it succeeded|||Đã được ghi — báo khách thành công',
          'Retry with a new _id so the order is surely created|||Thử lại với _id mới cho chắc đơn được tạo',
          'Nothing: the outcome is unknown; retry with the same unique key, and E11000 on the retry means the first attempt succeeded|||Không gì cả: kết quả là chưa biết; thử lại với cùng khoá duy nhất, và E11000 ở lần thử lại nghĩa là lần đầu đã thành công',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The connection broke; the insert may or may not have been applied before that. In the lesson\'s run it had not been; in another run of the same lab, even with retryWrites on, an insert that failed with a network error was in the database. A new _id risks a duplicate order, "failed" risks a lie. Lab 7.6 builds exactly this handling.|||VI: Kết nối đã đứt; lệnh chèn có thể đã hoặc chưa được áp dụng trước đó. Ở lượt chạy của bài thì chưa; ở một lượt khác của cùng lab, kể cả khi bật retryWrites, một lệnh chèn hỏng vì lỗi mạng vẫn nằm trong database. _id mới thì có nguy cơ đơn trùng, báo "thất bại" thì có nguy cơ báo sai. Lab 7.6 dựng đúng cách xử lý này.',
      },
      {
        question: 'docker stop on the primary container took about 10 seconds and the container exited with code 137. What happened?|||docker stop container primary mất khoảng 10 giây và container thoát với mã 137. Chuyện gì đã xảy ra?',
        options: [
          'mongod stepped down, then used its quiesce period (default 15 s); Docker\'s default 10 s grace ran out and it sent SIGKILL — set a longer stop grace period|||mongod đã nhường chức rồi vào khoảng quiesce (mặc định 15 s); hết 10 s ân hạn mặc định của Docker, nó gửi SIGKILL — đặt thời gian ân hạn dài hơn',
          'mongod crashed because the secondaries were lagging|||mongod sập vì secondary bị trễ',
          'Code 137 is a normal clean shutdown for mongod|||Mã 137 là tắt sạch bình thường của mongod',
          'docker stop always kills containers immediately|||docker stop luôn giết container ngay lập tức',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 137 = 128 + 9, killed by SIGKILL. Since 5.0, a shutting-down mongod steps down, then waits up to timeoutSecs (15 s) for operations to finish. The application barely noticed (about half a second without writes) because the step-down happened first, but the process did not shut down cleanly. In Compose: stop_grace_period: 30s.|||VI: 137 = 128 + 9, bị giết bằng SIGKILL. Từ 5.0, mongod khi tắt sẽ nhường chức rồi chờ tới timeoutSecs (15 s) cho các thao tác xong. Ứng dụng gần như không thấy gì (chừng nửa giây không ghi được) vì việc nhường chức xảy ra trước, nhưng tiến trình không tắt sạch. Trong Compose: stop_grace_period: 30s.',
      },
      {
        question: 'The primary is unplugged from every network (packets silently dropped). With default driver settings one insert waited over 30 seconds. The team adds socketTimeoutMS=3000 and one insert still waits over 30 seconds. Why, and what fixes it?|||Primary bị rút khỏi mọi mạng (gói tin rơi im lặng). Với cấu hình driver mặc định, một lệnh chèn chờ hơn 30 giây. Đội thêm socketTimeoutMS=3000 mà một lệnh chèn vẫn chờ hơn 30 giây. Vì sao, và sửa bằng gì?',
        options: [
          'socketTimeoutMS is ignored for writes|||socketTimeoutMS bị bỏ qua với lệnh ghi',
          'The election itself takes 30 seconds|||Bản thân việc bầu chọn mất 30 giây',
          'The first attempt times out after 3 s, but the retry opens a new connection to the dead host and waits for connectTimeoutMS (30 s in the Node driver); set connectTimeoutMS too, and keep an application deadline|||Lần đầu hết giờ sau 3 s, nhưng lần thử lại mở kết nối mới tới máy đã mất và chờ connectTimeoutMS (30 s ở driver Node); đặt cả connectTimeoutMS, và giữ một hạn chót ở tầng ứng dụng',
          'Writes always block until the old primary comes back|||Lệnh ghi luôn bị chặn tới khi primary cũ quay lại',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: A dead peer sends nothing back — no reset, no error — so every timeout that is "unlimited" or long becomes the time your request hangs. The cluster had a new primary after about ten seconds; the application was stuck on sockets. The Node driver 7.9.1 used in the lab prints a warning that timeoutMS "has no effect", so set the individual timeouts explicitly.|||VI: Máy đã mất không gửi lại gì — không reset, không lỗi — nên mọi timeout "vô hạn" hoặc dài trở thành thời gian yêu cầu của bạn bị treo. Cụm đã có primary mới sau chừng mười giây; ứng dụng thì kẹt ở socket. Driver Node 7.9.1 dùng ở lab in cảnh báo timeoutMS "has no effect", nên hãy đặt rõ từng timeout.',
      },
      {
        question: 'Three members: r1 primary, r2 secondary, r3 hidden with secondaryDelaySecs: 60 and votes: 1. r2 goes down. What happens to an insert with w: "majority" and wtimeout 8000?|||Ba thành viên: r1 primary, r2 secondary, r3 hidden với secondaryDelaySecs: 60 và votes: 1. r2 sập. Một lệnh chèn với w: "majority" và wtimeout 8000 sẽ ra sao?',
        options: [
          'It succeeds immediately: hidden members never count for anything|||Thành công ngay: thành viên hidden không bao giờ được tính',
          'It fails with WriteConcernFailed: the majority now needs r3, which applies writes 60 s late|||Hỏng với WriteConcernFailed: đa số giờ cần r3, mà r3 áp dụng lệnh ghi trễ 60 s',
          'r3 becomes primary because it is the only other voter|||r3 thành primary vì nó là thành viên có phiếu còn lại',
          'The write is rejected before being applied on r1|||Lệnh ghi bị từ chối trước khi được áp dụng trên r1',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A voting delayed member counts toward the majority, so losing one normal secondary makes every majority write wait for the delay (here 60 s; one hour in a real setup). The MongoDB docs recommend delayed members be hidden, priority 0 and votes 0. r3 cannot become primary at all: priority 0.|||VI: Thành viên trễ có phiếu được tính vào đa số, nên mất một secondary bình thường là mọi lệnh ghi majority phải chờ đúng độ trễ (ở đây 60 s; một giờ ở hệ thật). Tài liệu MongoDB khuyên thành viên trễ phải hidden, priority 0 và votes 0. r3 không thể thành primary: priority 0.',
      },
      {
        question: 'A primary–secondary–arbiter (PSA) replica set. The only secondary is stopped. Which statement matches what the lab showed?|||Một replica set primary–secondary–arbiter (PSA). Secondary duy nhất bị tắt. Câu nào khớp với những gì lab cho thấy?',
        options: [
          'Writes stop completely because the primary loses its majority|||Ghi dừng hẳn vì primary mất đa số',
          'Nothing changes: the arbiter stores a copy of the data|||Không gì thay đổi: arbiter giữ một bản dữ liệu',
          'Adding the arbiter was impossible in MongoDB 8.0|||Thêm arbiter là không thể ở MongoDB 8.0',
          'The primary keeps its majority of votes (with the arbiter) and w:1 writes succeed, but w: "majority" writes time out — only one data-bearing member is left|||Primary giữ được đa số phiếu (nhờ arbiter) và ghi w:1 thành công, nhưng ghi w: "majority" hết giờ — chỉ còn một thành viên mang dữ liệu',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: An arbiter votes but holds no data. MongoDB 8.0 even refused rs.addArb until the default write concern was set explicitly, because adding the arbiter changes the implicit default. With the secondary down, durable (majority) writes are impossible and the majority commit point stops moving — the "PSA performance issues" the docs warn about.|||VI: Arbiter bỏ phiếu nhưng không giữ dữ liệu. MongoDB 8.0 còn từ chối rs.addArb cho tới khi write concern mặc định được đặt rõ, vì thêm arbiter làm đổi mặc định ngầm. Khi secondary sập, lệnh ghi bền (majority) là không thể và điểm commit majority đứng yên — đúng "vấn đề hiệu năng PSA" mà tài liệu cảnh báo.',
      },
      {
        question: 'On a collection sharded by { khachId: "hashed" }, insertMany of 10,000 orders takes about 15 s, but the same call with { ordered: false } takes about 0.1 s. Why?|||Trên collection shard theo { khachId: "hashed" }, insertMany 10.000 đơn mất khoảng 15 s, nhưng cùng lệnh với { ordered: false } chỉ khoảng 0,1 s. Vì sao?',
        options: [
          'Unordered inserts skip the write concern|||Chèn không thứ tự bỏ qua write concern',
          'The first call had to create the indexes|||Lệnh đầu phải tạo index',
          'Ordered inserts force mongos to send consecutive runs of documents going to the same shard, one after another; with a hashed key the runs are tiny, so thousands of round trips|||Chèn có thứ tự buộc mongos gửi lần lượt từng đoạn tài liệu liên tiếp cùng tới một shard; với khoá băm các đoạn rất ngắn, nên thành hàng nghìn lượt gọi',
          'The balancer was moving data during the first call|||Balancer đang dời dữ liệu trong lệnh đầu',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Ordered means "never apply a later document before an earlier one, stop at the first error". On an unsharded collection both took about 0.1 s. For bulk loads on sharded collections use ordered: false and give every document a unique key so retries are safe.|||VI: Có thứ tự nghĩa là "không bao giờ áp dụng tài liệu sau trước tài liệu trước, dừng ở lỗi đầu tiên". Trên collection chưa shard cả hai đều khoảng 0,1 s. Nạp hàng loạt vào collection đã shard: ordered: false và cho mỗi tài liệu một khoá duy nhất để thử lại an toàn.',
      },
      {
        question: 'Three shards hold about 70,000 orders each, sharded by range on the order date. 20,000 new orders arrive. Where do they go?|||Ba shard mỗi shard giữ khoảng 70.000 đơn, shard theo khoảng ngày đặt. 20.000 đơn mới tới. Chúng đi đâu?',
        options: [
          'All 20,000 to the one shard that owns the range up to MaxKey — new dates are always larger|||Cả 20.000 vào đúng một shard giữ range kéo tới MaxKey — ngày mới luôn lớn hơn',
          'Evenly, about 6,700 per shard|||Đều nhau, khoảng 6.700 mỗi shard',
          'To the shard with the least data|||Vào shard ít dữ liệu nhất',
          'To the config server until the balancer runs|||Vào config server cho tới khi balancer chạy',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A monotonic range key creates a hot shard: the lab measured +20,000 on one shard and +0 on the others, while the hashed collection split the same orders across all three. ObjectId, timestamps and counters behave the same. Hash them, or lead the key with a non-monotonic field such as { khachId: 1, ngay: 1 }.|||VI: Khoá khoảng tăng dần tạo shard nóng: lab đo được +20.000 trên một shard và +0 trên các shard khác, trong khi collection băm chia cùng số đơn đó ra cả ba. ObjectId, mốc thời gian và bộ đếm cũng vậy. Băm chúng, hoặc để một trường không tăng dần đứng đầu như { khachId: 1, ngay: 1 }.',
      },
      {
        question: 'A collection sharded on { vung: 1 } (values HN, HCM, DN) stays entirely on sh1; all three ranges are marked JUMBO and split fails with "chunk is indivisible". What is the right fix?|||Một collection shard theo { vung: 1 } (giá trị HN, HCM, DN) nằm trọn ở sh1; cả ba range bị gắn JUMBO và lệnh cắt hỏng với "chunk is indivisible". Cách sửa đúng là gì?',
        options: [
          'Add more shards so the balancer has somewhere to move data|||Thêm shard để balancer có chỗ dời dữ liệu',
          'Add a high-cardinality suffix to the key (refineCollectionShardKey) or reshard to { vung: 1, khachId: 1 }|||Thêm một trường đuôi nhiều giá trị vào khoá (refineCollectionShardKey) hoặc reshard thành { vung: 1, khachId: 1 }',
          'Lower the range size to 1 MB|||Hạ cỡ range xuống 1 MB',
          'Restart the balancer|||Khởi động lại balancer',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Three values can never be more than three ranges, and a range of a single value cannot be split, so it cannot be moved. The lab resharded to { vung: 1, khachId: 1 } in about 36 s for 120,000 orders and got about 40,000 per shard; with zones it then kept each region on its own shard.|||VI: Ba giá trị không bao giờ thành nhiều hơn ba range, và range chỉ một giá trị thì không cắt được nên không dời được. Lab reshard thành { vung: 1, khachId: 1 } trong khoảng 36 s cho 120.000 đơn và được chừng 40.000 mỗi shard; với zone, nó còn giữ mỗi vùng trên đúng shard của vùng đó.',
      },
    ],
  },
};
