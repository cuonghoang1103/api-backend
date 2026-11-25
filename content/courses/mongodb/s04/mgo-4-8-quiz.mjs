/**
 * 4.8 — Kiểm tra Chương 4 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 4.1–4.6.
 * Phân bố đáp án: A ×2 (2, 8) · B ×3 (1, 5, 10) · C ×3 (3, 6, 9) · D ×2 (4, 7).
 */
export default {
  title: '4.8 — Chapter 4 quiz|||4.8 — Kiểm tra Chương 4',
  slug: 'mgo-4-8-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 4: đọc tỉ lệ khoá/tài liệu/nReturned, filter trên FETCH, cách bộ lập kế hoạch chọn index, thứ tự ESR (42 với 125.575 khoá), tiền tố index, sắp xếp vượt 100 MB, partial index không được dùng, TTL không xoá ngay, truy vấn được phủ bị _id phá, defaultMaxTimeMS bị bỏ qua khi không xác thực.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Chapter 4 check: indexes and explain</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 4.1–4.6. Read every explanation — they are the sentences a performance review expects from you.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read an explain bottom-up and name what is wrong from the counters and the stages.</li>
<li>I can classify every field of a query as E, S or R and write the compound index.</li>
<li>I know the surprise rule of multikey, unique, partial, TTL, hidden and collation indexes.</li>
<li>I can make a query covered on purpose and find unused indexes.</li>
<li>I can go from "it is slow" to the guilty query with the slow log, the profiler and currentOp.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm Chương 4: index và explain</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 4.1–4.6. Đọc kỹ mọi lời giải thích — đó là những câu mà một buổi review hiệu năng chờ nghe từ bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được explain từ dưới lên và nói ra chỗ hỏng từ các bộ đếm và các tầng.</li>
<li>Tôi xếp được mọi trường của một truy vấn vào E, S hay R và viết ra index phức hợp.</li>
<li>Tôi biết luật gây bất ngờ của index multikey, unique, partial, TTL, hidden và collation.</li>
<li>Tôi chủ động làm được một truy vấn được phủ và tìm được index không dùng.</li>
<li>Tôi đi được từ "nó chậm" tới truy vấn có tội bằng log chậm, profiler và currentOp.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'An explain shows: stage IXSCAN on trangThai_1, FETCH with filter { tinh: "Huế" }, then SORT; totalKeysExamined 9,909, totalDocsExamined 9,909, nReturned 1,669. What is the best diagnosis?|||Một explain cho: tầng IXSCAN trên trangThai_1, FETCH có filter { tinh: "Huế" }, rồi SORT; totalKeysExamined 9.909, totalDocsExamined 9.909, nReturned 1.669. Chẩn đoán nào đúng nhất?',
        options: [
          'Everything is fine because the plan uses an index|||Mọi thứ ổn vì kế hoạch có dùng index',
          'The index covers only part of the query: six documents are read per result and the sort happens in memory — a compound index { trangThai, tinh, ngay } is needed|||Index chỉ phủ một phần truy vấn: đọc sáu tài liệu cho mỗi kết quả và phải sắp trong bộ nhớ — cần index phức hợp { trangThai, tinh, ngay }',
          'The collection needs to be sharded|||Collection cần được shard',
          'The query should use hint("trangThai_1") to be faster|||Truy vấn nên dùng hint("trangThai_1") để nhanh hơn',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A filter on FETCH means the index did not answer that condition; docs/nReturned ≈ 6 and a SORT stage both point to a compound index with equality fields then the sort field (Lessons 4.2–4.3). The plan already uses trangThai_1, so a hint changes nothing.|||VI: Filter nằm trên FETCH nghĩa là index không trả lời được điều kiện đó; tỉ lệ tài liệu/nReturned ≈ 6 và có tầng SORT đều chỉ về một index phức hợp gồm các trường bằng rồi trường sắp xếp (Bài 4.2–4.3). Kế hoạch đang dùng trangThai_1 sẵn rồi, nên hint chẳng đổi được gì.',
      },
      {
        question: 'With indexes trangThai_1 and tinh_1_ngay_-1, how does MongoDB 8.0 (classic multi-planner) choose between them for a new query shape?|||Có hai index trangThai_1 và tinh_1_ngay_-1, MongoDB 8.0 (multi-planner cổ điển) chọn giữa chúng thế nào cho một hình dạng truy vấn mới?',
        options: [
          'It runs both candidate plans for a short trial and keeps the one that produced the most results for the least work, then caches it per query shape|||Cho cả hai kế hoạch ứng viên chạy thử một lúc ngắn, giữ kế hoạch cho ra nhiều kết quả nhất với ít công nhất, rồi lưu vào cache theo hình dạng truy vấn',
          'It always picks the index that was created first|||Luôn chọn index được tạo trước',
          'It uses table statistics collected by ANALYZE|||Dùng thống kê bảng do ANALYZE thu thập',
          'It picks the index with the most fields|||Chọn index có nhiều trường nhất',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: allPlansExecution showed the race: both did 10,011 works; trangThai_1 had produced 101 results, tinh_1_ngay_-1 only 88. The winner is cached per shape (filter fields, sort, projection — not values). explain itself ignores the plan cache.|||VI: allPlansExecution cho thấy cuộc đua: cả hai làm 10.011 works; trangThai_1 đã cho ra 101 kết quả, tinh_1_ngay_-1 chỉ 88. Kẻ thắng được lưu theo hình dạng (trường lọc, sắp xếp, phép chiếu — không tính giá trị). Bản thân explain bỏ qua plan cache.',
      },
      {
        question: 'Screen: status = PAID, total ≥ 10,000,000, sort by date descending, limit 20. Which index examined only 42 keys in the lab?|||Màn hình: trạng thái = PAID, tổng ≥ 10.000.000, sắp theo ngày giảm dần, lấy 20. Index nào chỉ xét 42 khoá trong lab?',
        options: [
          '{ trangThai: 1, tong: 1, ngay: -1 }|||{ trangThai: 1, tong: 1, ngay: -1 }',
          '{ tong: 1, trangThai: 1, ngay: -1 }|||{ tong: 1, trangThai: 1, ngay: -1 }',
          '{ trangThai: 1, ngay: -1, tong: 1 }|||{ trangThai: 1, ngay: -1, tong: 1 }',
          '{ ngay: -1 }|||{ ngay: -1 }',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Equality–Sort–Range: walk the PAID block already in date order, check tong inside each key, stop at 20 — 42 keys, no SORT. E–R–S examined 125,575 keys and sorted; R–E–S 145,272. The order of fields in the query object is irrelevant; the order in the index decides.|||VI: Equality–Sort–Range: đi qua khối PAID đã theo thứ tự ngày, kiểm tong ngay trong mỗi khoá, dừng ở 20 — 42 khoá, không có SORT. E–R–S xét 125.575 khoá và phải sắp; R–E–S 145.272. Thứ tự trường trong object truy vấn không quan trọng; thứ tự trong index mới quyết định.',
      },
      {
        question: 'Only the index { trangThai: 1, ngay: -1, tong: 1 } exists. Which query is a COLLSCAN?|||Chỉ có index { trangThai: 1, ngay: -1, tong: 1 }. Truy vấn nào là COLLSCAN?',
        options: [
          'find({ trangThai: "NEW" })|||find({ trangThai: "NEW" })',
          'find({ trangThai: "NEW", ngay: { $gte: ISODate("2026-11-01") } })|||find({ trangThai: "NEW", ngay: { $gte: ISODate("2026-11-01") } })',
          'find({ trangThai: "NEW", tong: 50000 })|||find({ trangThai: "NEW", tong: 50000 })',
          'find({ ngay: { $gte: ISODate("2026-11-01") } })|||find({ ngay: { $gte: ISODate("2026-11-01") } })',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A compound index serves its prefixes (trangThai; trangThai + ngay). Skipping the middle field still uses the index with tong checked on keys (9,910 keys). Dates alone are sorted only inside each status block, so the query on ngay alone scanned 1,000,000 documents — the phone book sorted by city then surname.|||VI: Index phức hợp phục vụ các tiền tố của nó (trangThai; trangThai + ngay). Bỏ qua trường giữa vẫn dùng được index, tong được kiểm trên khoá (9.910 khoá). Riêng ngày chỉ được xếp bên trong từng khối trạng thái, nên truy vấn chỉ theo ngay quét 1.000.000 tài liệu — cuốn danh bạ xếp theo thành phố rồi theo họ.',
      },
      {
        question: 'Sorting the whole collection by { tinh: 1, tong: -1 } (no matching index) needed 263.6 MB. What happened on MongoDB 8.0?|||Sắp cả collection theo { tinh: 1, tong: -1 } (không có index phù hợp) cần 263,6 MB. Chuyện gì đã xảy ra trên MongoDB 8.0?',
        options: [
          'The server ran out of memory and crashed|||Máy chủ hết bộ nhớ và sập',
          'The sort exceeded the 100 MB limit and spilled to disk (usedDisk: true); with allowDiskUse(false) the same query failed|||Phép sắp vượt giới hạn 100 MB và tràn xuống đĩa (usedDisk: true); với allowDiskUse(false) cùng truy vấn bị lỗi',
          'MongoDB built a temporary index automatically|||MongoDB tự dựng một index tạm',
          'The result was silently truncated at 100 MB|||Kết quả bị cắt âm thầm ở mốc 100 MB',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: In-memory sorts are limited to 100 MB; since 6.0 allowDiskUse is on by default, so the sort spilled 3 times and succeeded slowly. Disabled, it fails with QueryExceededMemoryLimitNoDiskUseAllowed. The real fix is an index matching the sort.|||VI: Sắp trong bộ nhớ bị giới hạn 100 MB; từ 6.0 allowDiskUse bật sẵn, nên phép sắp tràn đĩa 3 lần và vẫn xong, nhưng chậm. Tắt đi thì lỗi QueryExceededMemoryLimitNoDiskUseAllowed. Cách sửa thật là một index khớp với phép sắp.',
      },
      {
        question: 'A partial unique index { email: 1 } with partialFilterExpression { daXoa: false } exists. find({ email: "a@x.vn" }) is a COLLSCAN. Why?|||Có index unique partial { email: 1 } với partialFilterExpression { daXoa: false }. find({ email: "a@x.vn" }) lại là COLLSCAN. Vì sao?',
        options: [
          'Partial indexes cannot be used by find, only by unique checks|||Index partial không dùng được cho find, chỉ dùng để kiểm trùng',
          'The index is still being built|||Index vẫn đang được dựng',
          'The query does not include daXoa: false, so it might need deleted accounts that are not in the index|||Truy vấn không có daXoa: false, nên nó có thể cần cả tài khoản đã xoá vốn không nằm trong index',
          'Emails must be lowercase to use an index|||Email phải viết thường mới dùng được index',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The planner uses a partial index only when the query implies its filter; with { email, daXoa: false } it chose email_1. Put the condition in every query that should use the index (e.g. findActiveByEmail).|||VI: Bộ lập kế hoạch chỉ dùng index partial khi truy vấn bao hàm bộ lọc của nó; với { email, daXoa: false } nó chọn email_1. Hãy đưa điều kiện đó vào mọi truy vấn cần dùng index (ví dụ findActiveByEmail).',
      },
      {
        question: 'A TTL index { hetHan: 1 } with expireAfterSeconds: 0. A session expired one second ago, another document has hetHan: "ngày mai" (a string). What did the lab show?|||Index TTL { hetHan: 1 } với expireAfterSeconds: 0. Một phiên hết hạn từ một giây trước, một tài liệu khác có hetHan: "ngày mai" (chuỗi). Lab cho thấy gì?',
        options: [
          'Both documents were deleted immediately|||Cả hai tài liệu bị xoá ngay lập tức',
          'The expired session was deleted at once; the string one after a day|||Phiên hết hạn bị xoá ngay; tài liệu chuỗi bị xoá sau một ngày',
          'Nothing is deleted until the server restarts|||Không gì bị xoá cho tới khi máy chủ khởi động lại',
          'The expired session disappeared within about a minute (TTL task every 60 s); the string one was never deleted|||Phiên hết hạn biến mất trong vòng chừng một phút (tác vụ TTL mỗi 60 giây); tài liệu chuỗi không bao giờ bị xoá',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: TTL is cleanup by a background task every 60 seconds and only for BSON Dates. Therefore an OTP or session check must still compare hetHan > now in the query.|||VI: TTL là việc dọn dẹp của một tác vụ nền chạy mỗi 60 giây và chỉ với kiểu Date của BSON. Vì thế kiểm OTP hay phiên đăng nhập vẫn phải so hetHan > bây giờ trong truy vấn.',
      },
      {
        question: 'Index { khach: 1, ngay: -1, tong: 1 }. find({ khach: "KH01234" }, { ngay: 1, tong: 1 }) still shows FETCH with 23 documents examined. What is the fix to make it covered?|||Index { khach: 1, ngay: -1, tong: 1 }. find({ khach: "KH01234" }, { ngay: 1, tong: 1 }) vẫn có FETCH, đọc 23 tài liệu. Sửa thế nào để nó được phủ?',
        options: [
          'Exclude _id in the projection: { _id: 0, ngay: 1, tong: 1 }|||Loại _id khỏi phép chiếu: { _id: 0, ngay: 1, tong: 1 }',
          'Add .hint("khach_1_ngay_-1_tong_1")|||Thêm .hint("khach_1_ngay_-1_tong_1")',
          'Add .limit(23)|||Thêm .limit(23)',
          'Make the index unique|||Đặt index thành unique',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: _id is returned by default and is not in the index, so every document had to be fetched. With _id: 0 the plan became PROJECTION_COVERED with 0 documents examined. One extra non-indexed field (tinh) breaks it again; array fields can never be covered.|||VI: _id mặc định được trả về mà không nằm trong index, nên phải FETCH mọi tài liệu. Với _id: 0, kế hoạch thành PROJECTION_COVERED và đọc 0 tài liệu. Thêm một trường ngoài index (tinh) là hỏng lại; trường mảng thì không bao giờ phủ được.',
      },
      {
        question: 'On the lab server (no authentication), defaultMaxTimeMS was set to 100 ms but a 300 ms query still finished. On the --auth server, the readWrite user was stopped and root was not. Why?|||Trên máy lab (không xác thực), defaultMaxTimeMS đặt 100 ms mà truy vấn 300 ms vẫn chạy xong. Trên máy --auth, người dùng readWrite bị dừng còn root thì không. Vì sao?',
        options: [
          'defaultMaxTimeMS only applies to writes|||defaultMaxTimeMS chỉ áp dụng cho lệnh ghi',
          'The parameter needs a server restart|||Tham số cần khởi động lại máy chủ',
          'Users with the bypassDefaultMaxTimeMS privilege ignore it — and without access control every connection has every privilege|||Người dùng có quyền bypassDefaultMaxTimeMS bỏ qua nó — và khi không bật kiểm soát truy cập thì mọi kết nối có mọi quyền',
          'mongosh overrides it with its own timeout|||mongosh ghi đè nó bằng thời gian chờ riêng',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: New in 8.0, defaultMaxTimeMS limits reads, but the bypassDefaultMaxTimeMS action (included in root) ignores it. Without --auth nothing is restricted. The default protects you only when the application uses a least-privilege user — another reason a lab without authentication is not production.|||VI: Mới ở 8.0, defaultMaxTimeMS giới hạn lệnh đọc, nhưng quyền bypassDefaultMaxTimeMS (có trong root) bỏ qua nó. Không có --auth thì không gì bị giới hạn. Giá trị mặc định chỉ bảo vệ bạn khi ứng dụng dùng người dùng quyền tối thiểu — thêm một lý do lab không xác thực không phải production.',
      },
      {
        question: 'A search box sends the user\'s text as { khach: /0123/ } on an indexed field. What did explain show, and what is the safe design?|||Ô tìm kiếm gửi chữ người dùng gõ dưới dạng { khach: /0123/ } trên một trường có index. Explain cho thấy gì, và thiết kế an toàn là gì?',
        options: [
          'IXSCAN with 293 keys; regex is always efficient on an index|||IXSCAN với 293 khoá; regex luôn hiệu quả trên index',
          'IXSCAN over all 1,000,000 keys; use an escaped, anchored, case-sensitive prefix (/^…/), a minimum length and maxTimeMS|||IXSCAN qua cả 1.000.000 khoá; dùng tiền tố có neo, phân biệt hoa thường, đã thoát ký tự (/^…/), độ dài tối thiểu và maxTimeMS',
          'COLLSCAN; regex can never use an index|||COLLSCAN; regex không bao giờ dùng được index',
          'An error: regex is not allowed on indexed fields|||Lỗi: không được dùng regex trên trường có index',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Only an anchored, case-sensitive prefix becomes an index range (/^KH0123/: 198 keys). Unanchored or /i patterns test every key (1,000,000) on every keystroke. Cloudflare 2019 shows what one expensive expression evaluated on every request does to a whole fleet.|||VI: Chỉ tiền tố có neo, phân biệt hoa thường mới thành khoảng index (/^KH0123/: 198 khoá). Mẫu không neo hay có /i thì thử mọi khoá (1.000.000) ở mỗi lần gõ phím. Cloudflare 2019 cho thấy một biểu thức đắt được tính ở mọi lượt gọi làm gì với cả một hệ thống máy chủ.',
      },
    ],
  },
};
