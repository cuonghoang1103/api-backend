/**
 * 6.6 — Kiểm tra Chương 6 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 6.1–6.5.
 * Phân bố đáp án: A ×2 (3, 7) · B ×3 (1, 5, 10) · C ×3 (2, 6, 9) · D ×2 (4, 8).
 */
export default {
  title: '6.6 — Chapter 6 quiz|||6.6 — Kiểm tra Chương 6',
  slug: 'mgo-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 6: bộ đếm 4 tiến trình và xung đột ghi tự thử lại, giỏ hàng đọc–tính–ghi mất món, updateMany bị ngắt rồi chạy lại cộng hai lần, hai transaction ghi cùng tài liệu, callback chạy hàng trăm lần, quên session, giới hạn 60 giây, wtimeout nghĩa là "không biết", rollback sau chuyển dự phòng, read concern majority và session nhân quả.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Chapter 6 check: transactions and consistency</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 6.1–6.5. These are the bugs that lose money and orders in production — and the questions senior engineers ask in interviews. Read every explanation, including for questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>For any write, I can say whether it touches one document or several, and what a crash in the middle leaves behind.</li>
<li>I can implement optimistic locking and an idempotent batch job.</li>
<li>I can write a transaction with every operation on the session, and I know what withTransaction retries.</li>
<li>I can explain why a w: 1 write can disappear after a failover, and what a write concern timeout means.</li>
<li>I can choose read concern and read preference for a screen, and explain causal consistency.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm Chương 6: transaction và tính nhất quán</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 6.1–6.5. Đây là những lỗi làm mất tiền và mất đơn ở production — và cũng là câu hỏi các kỹ sư lâu năm đặt khi phỏng vấn. Hãy đọc mọi lời giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Với mọi lệnh ghi, tôi nói được nó chạm một hay nhiều tài liệu, và một sự cố ở giữa để lại gì.</li>
<li>Tôi cài được khoá lạc quan và một tác vụ lô idempotent.</li>
<li>Tôi viết được transaction với mọi thao tác mang session, và biết withTransaction thử lại cái gì.</li>
<li>Tôi giải thích được vì sao một lần ghi w: 1 có thể biến mất sau chuyển dự phòng, và hết thời gian chờ write concern nghĩa là gì.</li>
<li>Tôi chọn được read concern và read preference cho một màn hình, và giải thích được nhất quán nhân quả.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'Four processes each run updateOne({ _id: "luot" }, { $inc: { n: 1 } }) 2,000 times on the same document, no transaction. What is n at the end, and what does the writeConflicts metric show?|||Bốn tiến trình, mỗi tiến trình chạy updateOne({ _id: "luot" }, { $inc: { n: 1 } }) 2.000 lần trên cùng một tài liệu, không transaction. Cuối cùng n bằng bao nhiêu, và chỉ số writeConflicts cho thấy gì?',
        options: [
          'Less than 8,000 — concurrent $inc loses updates|||Ít hơn 8.000 — $inc đồng thời làm mất cập nhật',
          'Exactly 8,000; writeConflicts grew by thousands because the engine silently retried colliding updates|||Đúng 8.000; writeConflicts tăng hàng nghìn vì engine lặng lẽ chạy lại các lệnh va nhau',
          'Exactly 8,000 and writeConflicts stays at 0 because updates on one document never collide|||Đúng 8.000 và writeConflicts giữ ở 0 vì lệnh trên một tài liệu không bao giờ va nhau',
          'Some updates fail with WriteConflict errors that the client must retry|||Một số lệnh hỏng với lỗi WriteConflict mà client phải tự thử lại',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A single update on a single document is atomic, and outside a transaction WiredTiger retries write conflicts internally — the client never sees them. The lab measured n = 8,000 while metrics.operation.writeConflicts rose by thousands: correct, but a hot document is a queue.|||VI: Một lệnh cập nhật trên một tài liệu là nguyên tử, và ngoài transaction WiredTiger tự chạy lại các xung đột ghi — client không bao giờ thấy. Lab đo được n = 8.000 trong khi metrics.operation.writeConflicts tăng hàng nghìn: đúng, nhưng tài liệu nóng là một hàng đợi.',
      },
      {
        question: 'Four processes each add 50 items to a cart by findOne → compute the new items and total in JavaScript → updateOne({ _id }, { $set: { items, tong } }). The cart ends with fewer than 200 items. What is the standard fix when the rule must stay in application code?|||Bốn tiến trình, mỗi tiến trình thêm 50 món vào giỏ bằng findOne → tính items và tổng mới bằng JavaScript → updateOne({ _id }, { $set: { items, tong } }). Cuối cùng giỏ có ít hơn 200 món. Cách sửa chuẩn khi luật phải nằm ở mã ứng dụng là gì?',
        options: [
          'Use $set with writeConcern majority|||Dùng $set với writeConcern majority',
          'Read with readConcern majority before computing|||Đọc với readConcern majority trước khi tính',
          'Optimistic locking: filter on { _id, v: vĐãĐọc }, $inc v in the same update, re-read and retry (or return 409) when matchedCount is 0|||Khoá lạc quan: lọc theo { _id, v: vĐãĐọc }, $inc v trong cùng lệnh, đọc lại và thử lại (hoặc trả 409) khi matchedCount bằng 0',
          'Add a unique index on items.sp|||Thêm index duy nhất trên items.sp',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The blind write-back overwrites items added by others between the read and the write (lost update). With a version in the filter, a stale write matches nothing; the versioned cart in the lab ended with exactly 200 items and v = 200 after a few retries per process. Write and read concerns do not help: this is about concurrency on one primary.|||VI: Lần ghi lại mù quáng đè mất món người khác vừa thêm giữa lúc đọc và lúc ghi (lost update). Có phiên bản trong bộ lọc thì lần ghi đã cũ không khớp gì; giỏ có phiên bản trong lab kết thúc đúng 200 món và v = 200 sau vài lần thử lại mỗi tiến trình. Write/read concern không giúp gì: đây là chuyện đồng thời trên một primary.',
      },
      {
        question: 'updateMany({}, { $inc: { diem: 1 } }) on 300,000 students stops with MaxTimeMSExpired. You run it again and it stops again. What state is the data in?|||updateMany({}, { $inc: { diem: 1 } }) trên 300.000 học sinh dừng với MaxTimeMSExpired. Bạn chạy lại và nó lại dừng. Dữ liệu đang ở trạng thái nào?',
        options: [
          'Mixed: some students have 0, some 1, and some 2 points — make the job idempotent with a marker field it filters on and sets in the same update, then rerun until nothing is modified|||Lẫn lộn: có học sinh 0, có 1, có 2 điểm — làm tác vụ idempotent bằng một trường đánh dấu vừa lọc vừa đặt trong cùng lệnh, rồi chạy lại tới khi không còn gì bị sửa',
          'Unchanged: an interrupted updateMany is rolled back automatically|||Không đổi: updateMany bị ngắt tự được hoàn tác',
          'Every student has 1 point: the second run only touches documents the first missed|||Mọi học sinh có 1 điểm: lần chạy thứ hai chỉ chạm các tài liệu lần đầu bỏ sót',
          'The collection is locked until an administrator runs repair|||Collection bị khoá tới khi quản trị viên chạy repair',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Each document is updated atomically but the command is not: interrupted, it leaves the documents it already changed. $inc is not idempotent, so the rerun gave some students a second point (the lab showed diem 2). The fix — updateMany({ dot: { $ne: "cong-T11" } }, { $inc, $set: { dot: "cong-T11" } }) in a loop — ended with exactly 300,000 students at 1 point.|||VI: Từng tài liệu được sửa nguyên tử nhưng cả lệnh thì không: bị ngắt, nó để lại các tài liệu đã sửa. $inc không idempotent, nên lần chạy lại cho một số học sinh thêm điểm thứ hai (lab cho thấy diem 2). Cách sửa — updateMany({ dot: { $ne: "cong-T11" } }, { $inc, $set: { dot: "cong-T11" } }) trong vòng lặp — kết thúc với đúng 300.000 học sinh 1 điểm.',
      },
      {
        question: 'Transaction 1 has updated account A and not yet committed. Transaction 2 now updates A. What happens?|||Transaction 1 đã sửa tài khoản A và chưa commit. Transaction 2 giờ sửa A. Chuyện gì xảy ra?',
        options: [
          'Transaction 2 waits until transaction 1 commits, like a row lock in PostgreSQL|||Transaction 2 chờ tới khi transaction 1 commit, như khoá dòng trong PostgreSQL',
          'Both succeed and the last commit wins|||Cả hai thành công và lần commit sau thắng',
          'Transaction 1 is aborted so that transaction 2 can proceed|||Transaction 1 bị huỷ để transaction 2 chạy tiếp',
          'Transaction 2 fails immediately with WriteConflict labelled TransientTransactionError and must be retried from the start|||Transaction 2 thất bại ngay với WriteConflict mang nhãn TransientTransactionError và phải chạy lại từ đầu',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: In MongoDB the first writer wins: the second transaction gets WriteConflict at once, with the error label telling the driver the whole transaction may be retried. A plain write outside any transaction, by contrast, waits — the lab\'s ordinary update waited until its own 1.5 s limit expired.|||VI: Trong MongoDB người ghi trước thắng: transaction thứ hai nhận WriteConflict ngay, kèm nhãn lỗi báo cho driver rằng có thể chạy lại cả transaction. Ngược lại, một lệnh ghi thường ngoài transaction thì chờ — lệnh cập nhật thường trong lab đã chờ tới hết giới hạn 1,5 giây của nó.',
      },
      {
        question: '40 concurrent orders through session.withTransaction: 30 committed, 10 out of stock — and the callback counter shows several hundred runs. What is the real risk this number reveals?|||40 đơn đồng thời qua session.withTransaction: 30 đơn commit, 10 hết hàng — và bộ đếm callback cho thấy vài trăm lần chạy. Con số này làm lộ rủi ro thật nào?',
        options: [
          'Some orders were committed several times|||Một số đơn bị commit nhiều lần',
          'Any side effect inside the callback (email, payment call, queue message) would run as many times as the callback — keep it to database operations and act after commit or via an outbox|||Mọi hiệu ứng phụ trong callback (email, gọi thanh toán, đẩy hàng đợi) sẽ chạy bằng số lần callback chạy — chỉ để thao tác database và làm hiệu ứng phụ sau commit hoặc qua outbox',
          'The driver is misconfigured; withTransaction should never retry|||Driver cấu hình sai; withTransaction không bao giờ nên thử lại',
          'The stock is probably negative|||Kho có lẽ đang âm',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Each conflict aborts the losing transaction and withTransaction runs the callback again; database effects are discarded on abort, so the data was exactly right (30 orders, stock 0/0). Effects outside the database are not discarded — nine retries means nine emails.|||VI: Mỗi xung đột huỷ transaction thua và withTransaction chạy lại callback; tác dụng trong database bị bỏ khi huỷ, nên dữ liệu đúng tuyệt đối (30 đơn, kho 0/0). Tác dụng ngoài database thì không bị bỏ — chín lần thử lại là chín email.',
      },
      {
        question: 'Inside a Node.js transaction the wallet update has { session } but the journal insertOne does not. The transaction then aborts. What is in the database?|||Trong một transaction Node.js, lệnh sửa ví có { session } nhưng insertOne vào nhật ký thì không. Sau đó transaction bị huỷ. Database có gì?',
        options: [
          'Neither change: the abort undoes both|||Không thay đổi nào: lệnh huỷ hoàn tác cả hai',
          'Both changes: the missing session makes the whole transaction auto-commit|||Cả hai thay đổi: thiếu session làm cả transaction tự commit',
          'The wallet is unchanged but the journal line remains — the insert ran outside the transaction and was committed immediately|||Ví không đổi nhưng dòng nhật ký vẫn còn — lệnh chèn chạy ngoài transaction và đã commit ngay',
          'The driver throws "operation missing session" before anything runs|||Driver ném lỗi "thiếu session" trước khi chạy gì cả',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Without { session } an operation is not part of the transaction; nothing warns you. The lab showed wallet 100,000 with a journal line saying −50,000 — books that do not match. Worse, an operation without the session that touches a document the transaction wrote waits for the transaction and hangs (MaxTimeMSExpired in the lab).|||VI: Không có { session } thì thao tác không thuộc transaction; không có gì cảnh báo bạn. Lab cho thấy ví 100.000 trong khi nhật ký ghi −50.000 — sổ sách không khớp. Tệ hơn, một thao tác không session chạm tài liệu mà transaction đã ghi sẽ chờ transaction và treo (MaxTimeMSExpired trong lab).',
      },
      {
        question: 'A transaction updates a document, then the code calls an external API that takes 8 seconds before committing. With transactionLifetimeLimitSeconds lowered to 3, what did the commit return, and what is the rule?|||Một transaction sửa một tài liệu, rồi mã gọi một API bên ngoài mất 8 giây mới commit. Với transactionLifetimeLimitSeconds hạ xuống 3, lệnh commit trả về gì, và luật rút ra là gì?',
        options: [
          'NoSuchTransaction — the server had aborted it; open transactions late, only do database work inside, commit quickly (default limit 60 s)|||NoSuchTransaction — máy chủ đã huỷ nó; mở transaction muộn, bên trong chỉ làm việc database, commit nhanh (giới hạn mặc định 60 s)',
          'Success — the limit only applies to reads|||Thành công — giới hạn chỉ áp dụng cho lệnh đọc',
          'Success, but with a warning in the log|||Thành công, nhưng có cảnh báo trong log',
          'WriteConcernFailed|||WriteConcernFailed',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A background task aborts transactions older than transactionLifetimeLimitSeconds to protect the cache; the later commit finds no transaction (NoSuchTransaction, labelled TransientTransactionError) and the write never happened. External calls, user confirmations and slow file loops do not belong inside a transaction.|||VI: Một tác vụ nền huỷ các transaction già hơn transactionLifetimeLimitSeconds để bảo vệ cache; lệnh commit sau đó không tìm thấy transaction (NoSuchTransaction, nhãn TransientTransactionError) và lần ghi chưa từng xảy ra. Gọi bên ngoài, chờ người dùng xác nhận, vòng lặp đọc tệp chậm không thuộc về bên trong transaction.',
      },
      {
        question: 'The secondaries cannot replicate. insertOne({ _id: "D-MAJ" }, { writeConcern: { w: "majority", wtimeout: 2000 } }) returns WriteConcernFailed. What is the correct interpretation?|||Các secondary không nhân bản được. insertOne({ _id: "D-MAJ" }, { writeConcern: { w: "majority", wtimeout: 2000 } }) trả về WriteConcernFailed. Cách hiểu đúng là gì?',
        options: [
          'Nothing was written; show an error and let the user submit again|||Chưa ghi gì; báo lỗi và để người dùng gửi lại',
          'The write was rolled back immediately by the primary|||Lần ghi đã bị primary hoàn tác ngay',
          'The write is safe; the timeout only affects performance metrics|||Lần ghi an toàn; hết giờ chỉ ảnh hưởng số liệu hiệu năng',
          'Unknown: the document is on the primary and may survive or be rolled back later — retry with the same unique key so a retry applies at most once|||Không biết: tài liệu đang nằm trên primary và có thể sống hoặc bị rollback sau — thử lại với cùng khoá duy nhất để lần thử lại chỉ áp dụng tối đa một lần',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: wtimeout only means "not enough confirmations in time". The lab\'s primary held D-MAJ right after the error; after the failover D-MAJ was among the rolled-back documents. Treating it as failed creates duplicates, treating it as saved may lose data; an idempotency key handles both outcomes.|||VI: wtimeout chỉ có nghĩa "không đủ xác nhận kịp lúc". Primary trong lab đang giữ D-MAJ ngay sau lỗi; sau chuyển dự phòng D-MAJ nằm trong số tài liệu bị rollback. Coi là thất bại thì sinh bản trùng, coi là đã lưu thì có thể mất dữ liệu; một idempotency key xử lý được cả hai kết quả.',
      },
      {
        question: 'After the failover, the old primary rejoined and wrote rollback/…/removed.*.bson. Which writes ended up in that file, and which write concern guarantees a write is never there?|||Sau chuyển dự phòng, primary cũ quay lại và ghi rollback/…/removed.*.bson. Những lần ghi nào nằm trong tệp đó, và write concern nào bảo đảm một lần ghi không bao giờ nằm ở đó?',
        options: [
          'Only D-MAJ; w: 1 writes are always safe on the primary|||Chỉ D-MAJ; lần ghi w: 1 luôn an toàn trên primary',
          'All documents of the collection; nothing guarantees it|||Mọi tài liệu của collection; không gì bảo đảm được',
          'The three w: 1 orders and D-MAJ — everything the new majority never had; a write acknowledged with w: "majority" is never rolled back|||Ba đơn w: 1 và D-MAJ — mọi thứ đa số mới chưa từng có; lần ghi được xác nhận với w: "majority" không bao giờ bị rollback',
          'D-MOI, because it was written on the new primary|||D-MOI, vì nó được ghi trên primary mới',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The old primary undid every write that the majority side did not have: D-W1-1, D-W1-2, D-W1-3 (acknowledged with w: 1) and D-MAJ (timed out). The cluster kept D0 and D-MOI. Majority-acknowledged writes are on a majority, so every possible new primary has them.|||VI: Primary cũ hoàn tác mọi lần ghi mà phía đa số không có: D-W1-1, D-W1-2, D-W1-3 (đã xác nhận với w: 1) và D-MAJ (hết giờ chờ). Cụm giữ D0 và D-MOI. Lần ghi được xác nhận majority nằm trên đa số, nên mọi primary mới có thể có đều có nó.',
      },
      {
        question: 'Replication is stopped. On the primary, local returns price 200 but majority returns 100; a read from a secondary inside a causally consistent session that just wrote 300 times out instead of returning 100. Why?|||Nhân bản đang dừng. Trên primary, local trả giá 200 còn majority trả 100; một lần đọc từ secondary trong session nhân quả vừa ghi 300 thì hết giờ thay vì trả 100. Vì sao?',
        options: [
          'The primary is corrupted and must be resynced|||Primary bị hỏng và phải đồng bộ lại',
          'majority shows only what a majority has (100, never rolled back); the causal session tells the secondary not to answer with anything older than its last write, so it waits instead of returning stale data|||majority chỉ cho thấy thứ đa số có (100, không bao giờ bị rollback); session nhân quả bảo secondary đừng trả lời bằng thứ gì cũ hơn lần ghi cuối của session, nên nó chờ thay vì trả dữ liệu cũ',
          'readConcern majority is not allowed on a primary|||readConcern majority không được dùng trên primary',
          'Causal sessions only work with linearizable reads|||Session nhân quả chỉ chạy với đọc linearizable',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: 200 exists only on the primary and would be rolled back by a failover, so majority returns 100. The causal session carries the cluster time of its write; the secondary has not reached it and waits (afterClusterTime) — once replication resumed, the same pattern read 301 from a secondary immediately. Without a session the secondary answered 100 at once, with no error.|||VI: 200 chỉ có trên primary và sẽ bị rollback nếu chuyển dự phòng, nên majority trả 100. Session nhân quả mang thời điểm cụm của lần ghi; secondary chưa tới đó nên chờ (afterClusterTime) — khi nhân bản chạy lại, cùng cách đó đọc được 301 từ secondary ngay. Không có session thì secondary trả 100 tức thì, không lỗi gì.',
      },
    ],
  },
};
