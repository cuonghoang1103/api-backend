/**
 * 5.7 — Kiểm tra Chương 5 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 5.1–5.6.
 * Phân bố đáp án: A ×2 (3, 7) · B ×3 (1, 5, 10) · C ×3 (2, 6, 9) · D ×2 (4, 8).
 */
export default {
  title: '5.7 — Chapter 5 quiz|||5.7 — Kiểm tra Chương 5',
  slug: 'mgo-5-7-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 5: quên dấu $ trong $group, trường gõ sai cộng ra 0, tổng bị nhân ba sau $unwind, $unwind làm mất tài liệu, $lookup không index (NestedLoopJoin), báo cáo theo ngày thiếu timezone, $bucket thiếu default, $densify trôi tháng, $match trên trường tính ra quét cả triệu tài liệu, và API nhận pipeline từ client.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Chapter 5 check: the aggregation pipeline</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 5.1–5.6. Most wrong reports in real projects come from exactly these ten mistakes — read every explanation.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can build a report stage by stage and say how many documents leave each stage.</li>
<li>I know which fields may be summed after <code>$unwind</code> and when <code>$unwind</code> drops documents.</li>
<li>I can predict the join strategy of a <code>$lookup</code> and make it use an index.</li>
<li>Every date grouping I write has a time zone, and I know where <code>$densify</code> drifts.</li>
<li>I can read a pipeline explain, and I know what a client-supplied pipeline can do.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Kiểm Chương 5: aggregation pipeline</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 5.1–5.6. Phần lớn báo cáo sai ở dự án thật đến từ đúng mười lỗi này — hãy đọc kỹ mọi lời giải thích.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi dựng được một báo cáo theo từng stage và nói được bao nhiêu tài liệu ra khỏi mỗi stage.</li>
<li>Tôi biết trường nào được cộng sau <code>$unwind</code> và khi nào <code>$unwind</code> làm mất tài liệu.</li>
<li>Tôi đoán được chiến lược nối của một <code>$lookup</code> và làm nó dùng được index.</li>
<li>Mọi phép gom theo ngày tôi viết đều có múi giờ, và tôi biết <code>$densify</code> trôi ở đâu.</li>
<li>Tôi đọc được explain của pipeline, và biết một pipeline do client gửi lên làm được gì.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'A report uses { $match: { status: "PAID" } }, { $group: { _id: "shipTo.city", soDon: { $sum: 1 } } }. What does it return on CT Shop?|||Một báo cáo dùng { $match: { status: "PAID" } }, { $group: { _id: "shipTo.city", soDon: { $sum: 1 } } }. Trên CT Shop nó trả về gì?',
        options: [
          'Six documents, one per city|||Sáu tài liệu, mỗi thành phố một',
          'One document { _id: "shipTo.city", soDon: 903 } — without $ the key is a string constant|||Một tài liệu { _id: "shipTo.city", soDon: 903 } — không có $ thì khoá là một chuỗi hằng',
          'An error: unknown field|||Lỗi: trường không tồn tại',
          'Zero documents|||Không tài liệu nào',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A field path starts with $. "shipTo.city" is a literal, identical for every document, so all 903 PAID orders fall into one group named after the string. No error is raised.|||VI: Đường dẫn trường bắt đầu bằng $. "shipTo.city" là một hằng, giống nhau với mọi tài liệu, nên cả 903 đơn PAID rơi vào một nhóm mang tên chuỗi đó. Không có lỗi nào.',
      },
      {
        question: 'Revenue per city shows 0 for every city. The pipeline is { $group: { _id: "$shipTo.city", doanhThu: { $sum: "$totl" } } }. Why?|||Doanh thu theo thành phố hiện 0 cho mọi thành phố. Pipeline là { $group: { _id: "$shipTo.city", doanhThu: { $sum: "$totl" } } }. Vì sao?',
        options: [
          'Decimal128 values cannot be summed|||Giá trị Decimal128 không cộng được',
          '$sum needs a $match before it|||$sum cần một $match phía trước',
          'The field name is misspelled; $sum of a missing field is 0, silently|||Tên trường gõ sai; $sum của một trường vắng là 0, không báo gì',
          'The orders are not loaded|||Đơn hàng chưa được nạp',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: MongoDB has no column list to validate field names. "$totl" is missing in every document, and $sum ignores non-numeric/missing values, giving 0. Check each stage on a few documents and reconcile with a number computed another way.|||VI: MongoDB không có danh sách cột để kiểm tên trường. "$totl" vắng ở mọi tài liệu, và $sum bỏ qua giá trị không phải số/vắng, nên ra 0. Hãy kiểm từng stage trên vài tài liệu và đối soát với một con số tính bằng cách khác.',
      },
      {
        question: 'Total revenue is 36.9 billion with $group over orders, but 110.9 billion when the same $sum of "$total" runs after { $unwind: "$items" }. What happened?|||Tổng doanh thu là 36,9 tỉ khi $group trên đơn, nhưng 110,9 tỉ khi cùng $sum "$total" chạy sau { $unwind: "$items" }. Chuyện gì đã xảy ra?',
        options: [
          'Each order\'s total was repeated once per item, so orders were counted several times|||Tổng của mỗi đơn bị lặp lại một lần cho mỗi món, nên đơn bị tính nhiều lần',
          '$unwind converts Decimal128 to double and adds rounding errors|||$unwind đổi Decimal128 sang double và thêm sai số làm tròn',
          '$unwind adds the orders of other collections|||$unwind thêm đơn của collection khác',
          'The first number is wrong because it ignores items|||Con số đầu sai vì bỏ qua các món',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: After $unwind, 2,000 orders become 4,969 documents, each carrying the order-level total. Sum only element fields (items.price × items.qty) after $unwind, or compute order totals before it.|||VI: Sau $unwind, 2.000 đơn thành 4.969 tài liệu, mỗi tài liệu mang theo tổng cấp đơn. Sau $unwind chỉ cộng trường của phần tử (items.price × items.qty), hoặc tính tổng cấp đơn trước đó.',
      },
      {
        question: 'Four orders: items ["A","B"], items [], no items field, items "C". How many documents does { $unwind: "$items" } output by default?|||Bốn đơn: items ["A","B"], items [], không có trường items, items "C". Mặc định { $unwind: "$items" } cho ra bao nhiêu tài liệu?',
        options: [
          '5 — one per order plus one extra|||5 — mỗi đơn một và thêm một',
          '4 — one per order|||4 — mỗi đơn một',
          'An error because "C" is not an array|||Lỗi vì "C" không phải mảng',
          '3 — the empty and missing arrays are dropped, "C" is treated as one element|||3 — mảng rỗng và trường vắng bị bỏ, "C" được coi là một phần tử',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: By default $unwind drops documents whose array is empty, null or missing, and treats a non-array value as a one-element array. preserveNullAndEmptyArrays: true keeps them (5 documents in the lesson).|||VI: Mặc định $unwind bỏ tài liệu có mảng rỗng, null hoặc vắng, và coi giá trị không phải mảng là mảng một phần tử. preserveNullAndEmptyArrays: true giữ chúng lại (5 tài liệu trong bài).',
      },
      {
        question: 'A $lookup from 20 customer codes into a million orders on foreignField "khach" takes seconds; explain shows strategy NestedLoopJoin. What is the fix?|||Một $lookup từ 20 mã khách vào một triệu đơn trên foreignField "khach" mất vài giây; explain cho strategy NestedLoopJoin. Cách sửa là gì?',
        options: [
          'Add allowDiskUse: true|||Thêm allowDiskUse: true',
          'Create an index on khach in the orders collection — the plan becomes IndexedLoopJoin, a few milliseconds|||Tạo index trên khach ở collection đơn — kế hoạch thành IndexedLoopJoin, vài mili giây',
          'Replace $lookup with $unionWith|||Thay $lookup bằng $unionWith',
          'Put $unwind before $lookup|||Đặt $unwind trước $lookup',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: NestedLoopJoin scans the foreign collection for each input document. With an index on the foreignField the server does one index lookup per input: in the lesson, 385 keys for 385 orders in a few ms, hundreds of times faster.|||VI: NestedLoopJoin quét collection bên kia cho mỗi tài liệu đầu vào. Có index trên foreignField thì máy chủ tra index một lần cho mỗi đầu vào: trong bài là 385 khoá cho 385 đơn trong vài mili giây, nhanh hơn hàng trăm lần.',
      },
      {
        question: 'Orders per day around New Year: 1,480 on 31 December with $dateToString (no timezone), 1,051 with timezone "Asia/Ho_Chi_Minh". Which statement is right?|||Số đơn mỗi ngày quanh Tết dương lịch: 1.480 đơn ngày 31/12 với $dateToString (không timezone), 1.051 với timezone "Asia/Ho_Chi_Minh". Câu nào đúng?',
        options: [
          'The first is right; the time zone only changes the display|||Con số đầu đúng; múi giờ chỉ đổi cách hiển thị',
          'Both are wrong; dates must be stored as strings|||Cả hai đều sai; ngày phải lưu dưới dạng chuỗi',
          'Dates are stored in UTC; a Vietnamese business day needs Vietnam-time boundaries in $match and timezone in the grouping — 1,051 is the right count|||Ngày lưu theo UTC; một ngày làm việc ở Việt Nam cần mốc giờ Việt Nam trong $match và timezone trong phép gom — 1.051 là con số đúng',
          'The difference comes from daylight saving time in Vietnam|||Chênh lệch đến từ giờ mùa hè ở Việt Nam',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Without timezone, a day is cut at UTC midnight (07:00 in Vietnam). Seven hours move between days, and a quarterly report can even grow a fake December (378 orders in the lesson). Vietnam has no daylight saving time.|||VI: Không có timezone, ngày bị cắt ở nửa đêm UTC (07:00 ở Việt Nam). Bảy tiếng bị dời giữa các ngày, và một báo cáo quý còn có thể mọc ra tháng 12 giả (378 đơn trong bài). Việt Nam không có giờ mùa hè.',
      },
      {
        question: '{ $bucket: { groupBy: "$total", boundaries: [0, 1000000, 5000000] } } on CT Shop orders fails with "$switch could not find a matching branch". Why?|||{ $bucket: { groupBy: "$total", boundaries: [0, 1000000, 5000000] } } trên đơn CT Shop lỗi "$switch could not find a matching branch". Vì sao?',
        options: [
          'Some orders are worth 5 million or more and there is no default bucket — every value must fall in a bucket or the pipeline fails|||Có đơn từ 5 triệu trở lên mà không có khoảng default — mọi giá trị phải rơi vào một khoảng, nếu không pipeline thất bại',
          '$bucket cannot group Decimal128 values|||$bucket không gom được giá trị Decimal128',
          'Boundaries must be strings|||Mốc phải là chuỗi',
          '$switch must be written before $bucket|||Phải viết $switch trước $bucket',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The server rewrites $bucket into $group with a $switch; a value outside all boundaries has no branch. Add default: "từ 50 triệu" (the lesson then shows 5 buckets, 246 orders in the last). $bucketAuto chooses boundaries itself.|||VI: Máy chủ viết lại $bucket thành $group với một $switch; giá trị nằm ngoài mọi mốc thì không có nhánh nào. Thêm default: "từ 50 triệu" (bài khi đó cho 5 khoảng, 246 đơn ở khoảng cuối). $bucketAuto tự chọn mốc.',
      },
      {
        question: 'Months are grouped with $dateTrunc (unit month, timezone Asia/Ho_Chi_Minh), then $densify with step 1 month fills gaps. The output has keys on the 28th and duplicated months. Why?|||Tháng được gom bằng $dateTrunc (unit month, timezone Asia/Ho_Chi_Minh), rồi $densify bước 1 tháng để lấp chỗ trống. Kết quả có khoá rơi vào ngày 28 và tháng bị trùng. Vì sao?',
        options: [
          '$densify only works on numbers|||$densify chỉ chạy trên số',
          'The bounds must be strings|||Biên phải là chuỗi',
          '$fill changed the dates|||$fill đã đổi ngày',
          '$densify has no time zone: it adds months in UTC from 17:00 on the last day, drifts to the 28th after February and no longer matches the real keys|||$densify không có múi giờ: nó cộng tháng theo UTC từ 17:00 ngày cuối tháng, sau tháng 2 trôi về ngày 28 và không còn khớp khoá thật',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Local-midnight keys are UTC instants like 2026-05-31T17:00Z. Stepping month by month from 31 December gives 31 Jan, 28 Feb, 28 Mar… Use calendar keys built with $dateFromParts from the Vietnam-time year and month (00:00 UTC), then densify.|||VI: Khoá nửa đêm giờ địa phương là thời điểm UTC kiểu 2026-05-31T17:00Z. Bước từng tháng từ 31/12 ra 31/1, 28/2, 28/3… Hãy dùng khoá theo lịch dựng bằng $dateFromParts từ năm và tháng giờ Việt Nam (00:00 UTC), rồi mới densify.',
      },
      {
        question: 'On a million orders with index { trangThai: 1, ngay: 1 }, [{ $set: { nam: { $year: "$ngay" } } }, { $match: { nam: 2026 } }, { $count: "n" }] does a COLLSCAN of 1,000,000 documents. Best fix?|||Trên một triệu đơn có index { trangThai: 1, ngay: 1 }, [{ $set: { nam: { $year: "$ngay" } } }, { $match: { nam: 2026 } }, { $count: "n" }] làm COLLSCAN 1.000.000 tài liệu. Cách sửa tốt nhất?',
        options: [
          'Move $match before $set without changing it|||Đưa $match lên trước $set mà không sửa gì',
          'Add hint on the index|||Thêm hint vào index',
          'Write the condition on the stored field as a date range (plus the status) so the index is used — COUNT_SCAN on index keys only|||Viết điều kiện trên trường đã lưu dưới dạng khoảng ngày (kèm trạng thái) để dùng được index — COUNT_SCAN chỉ trên khoá index',
          'Add allowDiskUse: true|||Thêm allowDiskUse: true',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: nam exists only after $set, so no index can serve it; before $set the field does not even exist. A range on ngay (Vietnam-time boundaries) is indexable: the lesson counts 4,840 keys, 0 documents. The optimizer moves and splits $match, but cannot index an expression.|||VI: nam chỉ tồn tại sau $set, nên không index nào phục vụ được; trước $set thì trường đó còn chưa có. Một khoảng trên ngay (mốc giờ Việt Nam) thì dùng được index: bài đếm 4.840 khoá, 0 tài liệu. Bộ tối ưu dời và tách $match, nhưng không index được một biểu thức.',
      },
      {
        question: 'A "custom report" endpoint appends the client\'s pipeline after its own { $match: { status: "PAID" } }. What did the lesson show, and what is the primary defence?|||Một endpoint "báo cáo tuỳ biến" nối pipeline của client vào sau { $match: { status: "PAID" } } của nó. Bài đã cho thấy gì, và lớp phòng thủ chính là gì?',
        options: [
          'Nothing dangerous — the server-side $match limits the data|||Không có gì nguy hiểm — $match phía máy chủ đã giới hạn dữ liệu',
          '$lookup read password hashes from users and $merge changed a product price; accept parameters instead of stages, use a least-privilege user, disable server-side JavaScript|||$lookup đọc được mật khẩu băm trong users và $merge đổi được giá sản phẩm; nhận tham số thay vì stage, dùng user quyền tối thiểu, tắt JavaScript phía máy chủ',
          'Only $function is dangerous, so blocking it is enough|||Chỉ $function là nguy hiểm, nên chặn nó là đủ',
          'Adding maxTimeMS makes it safe|||Thêm maxTimeMS là an toàn',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A pipeline can read other collections ($lookup, $unionWith), write ($merge, $out) and run code ($function, $where). The SP001 laptop went from 9,504,000 to 1,000 đồng with one request. Build pipelines from parameters; privileges per collection stop what slips through; an allowlist with a deep scan is the last line.|||VI: Pipeline đọc được collection khác ($lookup, $unionWith), ghi được ($merge, $out) và chạy được mã ($function, $where). Laptop SP001 từ 9.504.000 xuống 1.000 đồng chỉ với một request. Dựng pipeline từ tham số; quyền theo từng collection chặn thứ lọt qua; danh sách trắng kèm quét sâu là tuyến cuối.',
      },
    ],
  },
};
