/**
 * 10.8 — Kiểm tra Chương 10 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 10.1–10.7.
 * Phân bố đáp án: A ×3 (3, 7, 9) · B ×2 (1, 5) · C ×3 (2, 6, 10) · D ×2 (4, 8).
 */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, explanation });

export default {
  title: '10.8 — Chapter 10 quiz|||10.8 — Kiểm tra Chương 10',
  slug: 'mgo-10-8-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống vận hành từ Chương 10: mongorestore chạy lại báo 2260 failed, tệp sao lưu cắt cụt vẫn nạp được một phần, gzip không phải mã hoá, --oplogLimit dừng ở đâu, mongostat ghi SLV cho primary, ai giữ 156 kết nối, working set vượt cache, coordinated omission khi máy chủ đứng hình 2 giây, resume token của change stream, nhảy cóc 6.0 lên 8.0.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Chapter 10 check: operations</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 10.1–10.7. In operations the dangerous answers are the ones that <em>look</em> fine — a restore that "finished", a tool that says SLV, a p99 that hides a two-second stall — so read each output the way you would at 2 a.m.</p>
<h3>Self-check before you start</h3>
<ul>
<li>My backups are restored automatically every night and the check looks at exit code and counts.</li>
<li>I can find a bad write in the oplog and stop a replay just before it.</li>
<li>I know which four groups of server metrics to watch and the three commands I run first.</li>
<li>My load tests use an open model and report p99 against a target rate.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm Chương 10: vận hành</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 10.1–10.7. Trong vận hành, câu trả lời nguy hiểm là câu <em>trông</em> ổn: một lần khôi phục "đã xong", một công cụ báo SLV, một p99 che mất hai giây đứng hình. Vì vậy hãy đọc từng output như khi bạn đọc nó lúc 2 giờ sáng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Bản sao lưu của tôi được tự động khôi phục thử mỗi đêm, và bước kiểm nhìn cả mã thoát lẫn số lượng.</li>
<li>Tôi tìm được một lần ghi sai trong oplog và dừng phát lại ngay trước nó.</li>
<li>Tôi biết bốn nhóm chỉ số máy chủ cần theo dõi và ba lệnh chạy đầu tiên.</li>
<li>Phép đo tải của tôi dùng mô hình mở và báo p99 theo một tốc độ mục tiêu.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      q('You run the same `mongorestore --nsFrom ctshop.* --nsTo ctshop_kp.*` a second time, without `--drop`. The last line says "0 document(s) restored successfully. 2260 document(s) failed to restore." What happened?|||Bạn chạy lại đúng lệnh `mongorestore --nsFrom ctshop.* --nsTo ctshop_kp.*` lần thứ hai, không có `--drop`. Dòng cuối báo "0 document(s) restored successfully. 2260 document(s) failed to restore." Chuyện gì đã xảy ra?',
        ['The backup file is corrupted and must be taken again|||Tệp sao lưu bị hỏng, phải sao lưu lại',
         'mongorestore only inserts; every _id already existed, so each insert failed — the data from the first run is still there and nothing was updated|||mongorestore chỉ insert; mọi _id đã tồn tại nên từng lần insert thất bại — dữ liệu của lần đầu vẫn còn và không có gì được cập nhật',
         'mongorestore merged the documents, keeping the newer version of each|||mongorestore đã gộp tài liệu, giữ bản mới hơn của từng cái',
         'The target database ran out of disk space|||Database đích hết chỗ trên đĩa'], 1,
        'mongorestore never updates existing documents. A duplicate _id is a failed insert, and the command still exits like a finished job. To replace a collection use --drop — on a scratch target, never blindly on production.|||mongorestore không bao giờ cập nhật tài liệu đã có. _id trùng là một lần insert thất bại, và lệnh vẫn kết thúc như đã xong việc. Muốn thay cả collection thì dùng --drop — trên đích nháp, đừng bao giờ dùng mù quáng trên production.'),
      q('Your restore check restores a truncated archive. mongorestore prints "error demultiplexing archive", but Lesson 10.1 noticed several hundred orders had already been loaded. What must an automatic check look at?|||Bước kiểm khôi phục của bạn nạp một archive bị cắt cụt. mongorestore in "error demultiplexing archive", nhưng Bài 10.1 thấy vài trăm đơn đã được nạp trước đó. Một bước kiểm tự động phải nhìn vào đâu?',
        ['Only whether the target has at least one document|||Chỉ cần đích có ít nhất một tài liệu',
         'Only the size of the archive compared with yesterday|||Chỉ cần so dung lượng archive với hôm qua',
         'The exit code of mongorestore and the per-collection counts compared with the counts recorded at backup time|||Mã thoát của mongorestore và số tài liệu từng collection so với số đã ghi lúc sao lưu',
         'Nothing: if mongorestore printed anything, the backup is usable|||Không cần gì: mongorestore có in ra là bản sao lưu dùng được'], 2,
        'A partial restore is the most deceptive failure: data is there, just not all of it. kiem-khoi-phuc.sh fails on a non-zero exit code first, then compares every collection with the counts saved next to the archive.|||Khôi phục dở dang là kiểu hỏng dễ đánh lừa nhất: có dữ liệu, chỉ là không đủ. kiem-khoi-phuc.sh báo hỏng khi mã thoát khác 0 trước, rồi so từng collection với số đếm lưu cạnh archive.'),
      q('`mongodump --archive -d ctshop | grep example.com` finds customer emails; with `--gzip` the same grep finds 0. What is the right conclusion?|||`mongodump --archive -d ctshop | grep example.com` tìm ra email khách; thêm `--gzip` thì cùng lệnh grep ra 0. Kết luận đúng là gì?',
        ['Compression only hides the text from grep; gunzip needs no key — the archive must be encrypted, with the key stored elsewhere|||Nén chỉ giấu chữ khỏi grep; gunzip đâu cần khoá — archive phải được mã hoá, khoá cất ở nơi khác',
         'gzip archives are safe to share because they are binary|||Archive gzip chia sẻ an toàn vì nó là nhị phân',
         'mongodump --gzip removes personal data automatically|||mongodump --gzip tự xoá dữ liệu cá nhân',
         'The emails are encrypted by MongoDB Community at rest, so gzip does not matter|||Email đã được MongoDB Community mã hoá lúc lưu, nên gzip chẳng quan trọng'], 0,
        'gzip is an encoding, not a protection. openssl enc (or age, or a KMS) makes the file unreadable without the key; the lab showed a wrong key fails with exit code 1. Community has no encryption at rest (Lesson 9.4).|||gzip là cách mã hoá dạng nén, không phải bảo vệ. openssl enc (hoặc age, hoặc KMS) làm tệp không đọc được nếu thiếu khoá; lab cho thấy khoá sai thì hỏng với mã thoát 1. Community không có mã hoá lúc lưu (Bài 9.4).'),
      q('On the scratch server you restored the 02:00 backup (2,000 orders), then replayed the extra oplog with `--oplogLimit` set to the timestamp of the first applyOps entry of the bad deleteMany. Which state do you get?|||Trên máy nháp, bạn đã khôi phục bản 02:00 (2.000 đơn), rồi phát lại phần oplog thêm với `--oplogLimit` đặt bằng dấu thời gian của mục applyOps đầu tiên của lệnh deleteMany sai. Bạn được trạng thái nào?',
        ['The state at 02:00, because --oplogLimit disables replay|||Trạng thái lúc 02:00, vì --oplogLimit tắt việc phát lại',
         'The current state of production including the 20 orders after the mistake|||Trạng thái hiện tại của production, gồm cả 20 đơn sau sai lầm',
         'The state after the first 10 deletes, because the limit entry itself is applied|||Trạng thái sau 10 lệnh xoá đầu tiên, vì chính mục ở mốc giới hạn cũng được áp dụng',
         'Everything strictly before the delete: 2,050 orders with all 953 PAID orders, none of the 20 written after|||Mọi thứ trước lệnh xoá: 2.050 đơn với đủ 953 đơn PAID, không có đơn nào trong 20 đơn ghi sau'], 3,
        'Entries at or after the limit timestamp are not applied ("applied 50 oplog entries" — the 50 orders written after the backup). Then only the missing documents are copied back to production: 2,070 orders, 973 PAID.|||Các mục từ mốc giới hạn trở đi không được áp dụng ("applied 50 oplog entries" — đúng 50 đơn ghi sau lúc sao lưu). Sau đó chỉ chép các tài liệu bị thiếu về production: 2.070 đơn, 973 PAID.'),
      q('During an incident, `mongostat` shows `SLV` in the repl column for the server your application writes to. What do you do first?|||Giữa sự cố, `mongostat` hiện `SLV` ở cột repl cho chính máy mà ứng dụng đang ghi vào. Bạn làm gì đầu tiên?',
        ['Start a failover investigation: the primary must have stepped down|||Bắt đầu điều tra chuyển dự phòng: primary hẳn đã nhường quyền',
         'Ask the server itself — db.hello() / rs.status(); on 8.0 the lab primary said isWritablePrimary=true while mongostat 100.x labelled it SLV|||Hỏi chính máy chủ — db.hello() / rs.status(); trên 8.0, primary của lab nói isWritablePrimary=true trong khi mongostat 100.x gắn nhãn SLV',
         'Restart mongod to refresh its role|||Khởi động lại mongod để làm mới vai trò',
         'Point the application at another member|||Trỏ ứng dụng sang thành viên khác'], 1,
        'The tool looked for the old ismaster field, which 8.0 serverStatus no longer has. When a tool and the server disagree, believe the server.|||Công cụ tìm trường ismaster cũ, thứ mà serverStatus của 8.0 không còn. Khi công cụ và máy chủ nói khác nhau, tin máy chủ.'),
      q('Connections on production jump from about 10 to 162 out of 409. What is the fastest way to find out who holds them?|||Kết nối trên production nhảy từ khoảng 10 lên 162 trên 409. Cách nhanh nhất để biết ai đang giữ chúng là gì?',
        ['Restart the API — it is almost always the API|||Khởi động lại API — gần như luôn là do API',
         'Raise maxIncomingConnections so the alert stops|||Tăng maxIncomingConnections cho hết cảnh báo',
         '$currentOp with idleConnections: true, grouped by appName and client address|||$currentOp với idleConnections: true, nhóm theo appName và địa chỉ client',
         'Read mongotop: it lists connections per collection|||Đọc mongotop: nó liệt kê kết nối theo từng collection'], 2,
        'One aggregation showed 156 idle connections from appName "bao-cao-dem" — a report job that created a 50-connection pool per run and never closed it. Setting appName (and one database user per application) is what makes this answerable.|||Một lệnh aggregation cho thấy 156 kết nối nằm im từ appName "bao-cao-dem" — tác vụ báo cáo mỗi lần chạy tạo pool 50 kết nối mà không đóng. Đặt appName (và mỗi ứng dụng một user database) là thứ giúp trả lời được câu này.'),
      q('Lesson 10.3: a 768 MB machine with a 0.25 GB cache, a disk limited to 1,500 reads/s, 874 MiB of documents. Reads concentrated on 5% of the documents vs spread over all of them — what did the measurements show?|||Bài 10.3: máy 768 MB, cache 0,25 GB, ổ đĩa giới hạn 1.500 lần đọc/giây, 874 MiB tài liệu. Đọc dồn vào 5% tài liệu so với đọc rải đều mọi tài liệu — số đo cho thấy gì?',
        ['Hot 5% stayed in cache with p99 of a few ms; spread reads kept going to disk, with lower throughput and p99 in the tens of ms — the working set, not the data size, must fit in RAM|||5% nóng nằm gọn trong cache, p99 vài ms; đọc rải đều cứ phải xuống đĩa, thông lượng thấp hơn và p99 hàng chục ms — cái phải vừa RAM là working set, không phải tổng dữ liệu',
         'Both were identical because the _id index fits in cache|||Hai kiểu như nhau vì index _id vừa cache',
         'Spread reads were faster because they use more disks|||Đọc rải đều nhanh hơn vì dùng nhiều ổ đĩa hơn',
         'Both failed with errors once the data exceeded the cache|||Cả hai đều lỗi khi dữ liệu vượt cache'], 0,
        'The data was larger than the cache in both runs; what differed was the working set. Application threads also had to read pages from disk themselves — the counter in serverStatus that Lesson 10.2 tells you to alert on.|||Ở cả hai lượt, dữ liệu đều lớn hơn cache; khác nhau ở working set. Luồng ứng dụng còn phải tự đọc trang từ đĩa — đúng bộ đếm trong serverStatus mà Bài 10.2 bảo bạn đặt cảnh báo.'),
      q('Lesson 10.4 froze the server for 2 seconds (docker pause) during a 10-second test. The closed model (4 threads) reported p99 ≈ 5 ms; the open model at 1,000 req/s reported p95 ≈ 1.8 s. Which is the honest number and why?|||Bài 10.4 cho máy chủ đứng hình 2 giây (docker pause) giữa lượt đo 10 giây. Mô hình đóng (4 luồng) báo p99 ≈ 5 ms; mô hình mở 1.000 req/s báo p95 ≈ 1,8 s. Con số nào trung thực, vì sao?',
        ['The closed model, because it measured more requests|||Mô hình đóng, vì nó đo được nhiều request hơn',
         'Both are equally valid; they just measure different things|||Cả hai đều đúng như nhau; chỉ là đo hai thứ khác nhau',
         'Neither: latency cannot be measured while the server is paused|||Không con số nào: không đo được độ trễ khi máy chủ bị tạm dừng',
         'The open model: real users keep arriving during a stall; the closed loop stops sending while it waits, so the stall hits only 4 requests — coordinated omission|||Mô hình mở: người dùng thật vẫn tiếp tục tới khi máy chủ đứng hình; vòng lặp đóng ngừng gửi trong lúc chờ nên chỉ 4 request dính — coordinated omission'], 3,
        'The closed run still showed max ≈ 2 s, but p99 hid it because almost no requests were sent during the pause. Measuring from the scheduled send time at a fixed rate shows what customers would feel.|||Lượt đóng vẫn có max ≈ 2 s, nhưng p99 che nó vì gần như không request nào được gửi trong lúc dừng. Đo từ thời điểm lẽ ra phải gửi, với tốc độ cố định, mới cho thấy khách hàng sẽ cảm thấy gì.'),
      q('A change-stream listener saves the resume token after each handled event. It is stopped; two orders are written; it starts again with resumeAfter. What does Lesson 10.5 show, and what is the limit?|||Một tiến trình nghe change stream lưu resume token sau mỗi sự kiện xử lý xong. Nó bị tắt; hai đơn được ghi; nó chạy lại với resumeAfter. Bài 10.5 cho thấy gì, và giới hạn là gì?',
        ['Both orders arrive; this works only while the oplog still holds the token\'s position (oplog window)|||Cả hai đơn đều tới; chỉ chạy được khi oplog còn giữ vị trí của token (cửa sổ oplog)',
         'Nothing arrives: change streams only deliver events while connected|||Không có gì tới: change stream chỉ giao sự kiện khi đang kết nối',
         'Both orders arrive, plus every event since the collection was created|||Cả hai đơn đều tới, cộng mọi sự kiện từ lúc tạo collection',
         'Only the last order arrives because tokens are overwritten|||Chỉ đơn cuối tới vì token bị ghi đè'], 0,
        '"nối lại từ resume token đã lưu" then insert 9003 and 9004 — nothing lost, nothing repeated. If the listener is down longer than the oplog window, resuming fails (ChangeStreamHistoryLost). Delivery is at-least-once, so handlers must be idempotent.|||"nối lại từ resume token đã lưu" rồi insert 9003 và 9004 — không mất, không lặp. Nếu tiến trình tắt lâu hơn cửa sổ oplog, việc nối lại thất bại (ChangeStreamHistoryLost). Giao ít nhất một lần, nên phần xử lý phải idempotent.'),
      q('Data created by MongoDB 6.0 (FCV 6.0). The team swaps the image straight to mongo:8.0. What happened on the lab?|||Dữ liệu tạo bằng MongoDB 6.0 (FCV 6.0). Nhóm đổi thẳng ảnh sang mongo:8.0. Chuyện gì đã xảy ra trên lab?',
        ['8.0 started and upgraded the data automatically|||8.0 khởi động và tự nâng cấp dữ liệu',
         '8.0 started in read-only mode until setFeatureCompatibilityVersion was run|||8.0 khởi động ở chế độ chỉ đọc cho tới khi chạy setFeatureCompatibilityVersion',
         'mongod refused to start (exit code 62, "Invalid featureCompatibilityVersion document") — upgrade one major version at a time: 7.0 binary, FCV 7.0, then 8.0|||mongod không chịu khởi động (mã thoát 62, "Invalid featureCompatibilityVersion document") — nâng từng bản lớn một: binary 7.0, FCV 7.0, rồi 8.0',
         'The data was silently deleted|||Dữ liệu bị xoá lặng lẽ'], 2,
        'Nothing was damaged — 7.0 started on the same volume with FCV still 6.0 — but production would be down until someone read the log. Raising FCV needs confirm: true, and Community does not support binary downgrades.|||Không có gì bị hỏng — 7.0 khởi động trên cùng volume với FCV vẫn là 6.0 — nhưng production sẽ sập cho tới khi có người đọc log. Nâng FCV cần confirm: true, và Community không hỗ trợ hạ binary.'),
    ],
  },
};
