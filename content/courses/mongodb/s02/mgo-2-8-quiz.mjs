/**
 * 2.8 — Kiểm tra Chương 2 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 2.1–2.6.
 * Phân bố đáp án: A ×2 (3, 7) · B ×3 (1, 5, 9) · C ×3 (4, 8, 10) · D ×2 (2, 6).
 */
export default {
  title: '2.8 — Chapter 2 quiz|||2.8 — Kiểm tra Chương 2',
  slug: 'mgo-2-8-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 2: lô chèn có thứ tự gặp trùng khoá, so số với chuỗi, khoá trùng trong object JavaScript, $ne và trường vắng mặt, điều kiện mảng rơi vào hai phần tử, so khớp nguyên tài liệu nhúng, findOneAndUpdate trả bản trước, chống bán quá số hàng, chi phí skip, collation tiếng Việt.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Chapter 2 check: writes, queries, arrays, atomicity, pagination</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 2.1–2.6. Read every explanation — most are ready-made interview answers.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can predict which documents an ordered and an unordered failed batch leave behind.</li>
<li>I know three ways a query silently returns the wrong count (type, duplicate key, missing field).</li>
<li>I can say when two array conditions need <code>$elemMatch</code>.</li>
<li>I can write a stock reservation that cannot oversell, and a keyset page with a tie-breaker.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm Chương 2: ghi, truy vấn, mảng, tính nguyên tử, phân trang</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 2.1–2.6. Đọc kỹ mọi lời giải thích — phần lớn là câu trả lời phỏng vấn dùng được ngay.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đoán được một lô lỗi có thứ tự và không thứ tự để lại những tài liệu nào.</li>
<li>Tôi biết ba cách một truy vấn lặng lẽ trả về số đếm sai (kiểu, khoá trùng, trường vắng mặt).</li>
<li>Tôi nói được khi nào hai điều kiện trên mảng cần <code>$elemMatch</code>.</li>
<li>Tôi viết được lệnh giữ hàng không thể bán quá, và một trang keyset có khoá phá hoà.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'insertMany([GIAM10, GIAM20, GIAM10, FREESHIP, GIAM20]) runs with the default options on an empty collection. What is in the collection afterwards?|||insertMany([GIAM10, GIAM20, GIAM10, FREESHIP, GIAM20]) chạy với tuỳ chọn mặc định trên một collection rỗng. Sau đó collection có gì?',
        options: [
          'Nothing — the batch is rolled back because of the error|||Không có gì — cả lô bị rollback vì có lỗi',
          'GIAM10 and GIAM20 only|||Chỉ GIAM10 và GIAM20',
          'GIAM10, GIAM20 and FREESHIP|||GIAM10, GIAM20 và FREESHIP',
          'All five documents, the duplicates get new ids|||Cả năm tài liệu, bản trùng được cấp id mới',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Default is ordered: true — stop at the first error, keep what came before. The run showed insertedCount = 2, error at index 2. With ordered: false you would get 3 (GIAM10, GIAM20, FREESHIP) and errors at 2 and 4. Neither mode rolls back.|||VI: Mặc định là ordered: true — dừng ở lỗi đầu tiên, giữ phần đứng trước. Lần chạy cho insertedCount = 2, lỗi ở chỉ số 2. Với ordered: false bạn được 3 (GIAM10, GIAM20, FREESHIP) và lỗi ở 2 và 4. Không chế độ nào rollback.',
      },
      {
        question: 'An API passes ?min=20000000 from the URL straight into { total: { $gte: req.query.min } }. total is Decimal128. What does the count return?|||Một API đưa thẳng ?min=20000000 từ URL vào { total: { $gte: req.query.min } }. total là Decimal128. Lệnh đếm trả về gì?',
        options: [
          '549, the same as with a number — MongoDB converts the string|||549, giống như với số — MongoDB tự chuyển chuỗi',
          'An error: cannot compare string with Decimal128|||Lỗi: không so được chuỗi với Decimal128',
          'Every order, because strings sort after numbers|||Mọi đơn, vì chuỗi đứng sau số khi sắp',
          '0, with no error|||0, không báo lỗi',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Query comparison operators only match values of the same type bracket. Decimal128(…) and the number 20000000 both gave 549; the string gave 0, silently. Query parameters are always strings — convert and validate at the API boundary.|||VI: Toán tử so sánh trong truy vấn chỉ khớp giá trị cùng nhóm kiểu. Decimal128(…) và số 20000000 đều cho 549; chuỗi cho 0, im lặng. Tham số query luôn là chuỗi — hãy chuyển kiểu và kiểm ngay ở biên API.',
      },
      {
        question: 'const f = { total: { $gte: A }, total: { $lt: B } }; countDocuments(f) gave 1525, the correct answer is 74. Why?|||const f = { total: { $gte: A }, total: { $lt: B } }; countDocuments(f) cho 1525, đáp án đúng là 74. Vì sao?',
        options: [
          'The second total key replaced the first in the JavaScript object, so only $lt B was sent|||Khoá total thứ hai thay khoá thứ nhất trong object JavaScript, nên chỉ $lt B được gửi đi',
          'MongoDB joins two conditions on the same field with OR|||MongoDB nối hai điều kiện trên cùng một trường bằng OR',
          'Decimal128 ranges need $and|||Khoảng Decimal128 bắt buộc dùng $and',
          'countDocuments ignores the second operator|||countDocuments bỏ qua toán tử thứ hai',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: An object cannot hold the same key twice; printjson(f) showed only { total: { $lt: … } }. Put both operators in one sub-document: { total: { $gte: A, $lt: B } }. ESLint no-dupe-keys catches the literal form; tests catch filters built step by step.|||VI: Một object không thể chứa cùng một khoá hai lần; printjson(f) chỉ còn { total: { $lt: … } }. Đặt cả hai toán tử trong một tài liệu con: { total: { $gte: A, $lt: B } }. ESLint no-dupe-keys bắt dạng literal; test bắt các bộ lọc dựng từng bước.',
      },
      {
        question: 'A buggy service inserted one order without a status field. The dashboard counts "unpaid" with { status: { $ne: "PAID" } }. What happens to that order?|||Một dịch vụ lỗi chèn một đơn không có trường status. Dashboard đếm "chưa trả tiền" bằng { status: { $ne: "PAID" } }. Đơn đó bị tính thế nào?',
        options: [
          'Excluded — $ne only looks at documents that have the field|||Bị loại — $ne chỉ xét tài liệu có trường đó',
          'The query fails with "missing field"|||Truy vấn lỗi "thiếu trường"',
          'Included — $ne (and $nin) also match documents without the field|||Được tính — $ne (và $nin) khớp cả tài liệu không có trường',
          'Included only if a validator exists|||Chỉ được tính nếu có validator',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: "Not PAID" gave 1,098 = 2,001 − 903, counting the status-less order. $nin ["PAID","SHIPPED","PENDING"] also returned it next to the CANCELLED orders. Use positive conditions, or add $exists: true, and require status in a validator.|||VI: "Không PAID" cho 1.098 = 2.001 − 903, tính cả đơn không có status. $nin ["PAID","SHIPPED","PENDING"] cũng trả về nó cạnh các đơn CANCELLED. Dùng điều kiện khẳng định, hoặc thêm $exists: true, và bắt buộc status bằng validator.',
      },
      {
        question: '{ "items.qty": { $gte: 3 }, "items.price": { $gte: 10000000 } } counted 357 orders; the $elemMatch version counted 204. Which statement is right?|||{ "items.qty": { $gte: 3 }, "items.price": { $gte: 10000000 } } đếm được 357 đơn; bản $elemMatch đếm được 204. Phát biểu nào đúng?',
        options: [
          '$elemMatch is wrong: it misses orders with more than one matching item|||$elemMatch sai: nó bỏ sót đơn có nhiều hơn một món khớp',
          'The dot-notation query also counts orders where the two conditions are met by two different items|||Truy vấn dấu chấm còn đếm cả đơn mà hai điều kiện được thoả bởi hai món khác nhau',
          'The difference comes from Decimal128 rounding|||Chênh lệch là do làm tròn Decimal128',
          'Both are correct; MongoDB counts arrays twice in dot notation|||Cả hai đều đúng; MongoDB đếm mảng hai lần khi dùng dấu chấm',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Each dot condition is checked on its own: "some item has qty ≥ 3" AND "some item has price ≥ 10M". Order 1 had a ×3 course and expensive laptops ×1 — no single line with both. Same element ⇒ $elemMatch.|||VI: Mỗi điều kiện dấu chấm được kiểm riêng: "có món nào đó qty ≥ 3" VÀ "có món nào đó giá ≥ 10 triệu". Đơn 1 có khoá học ×3 và các laptop đắt ×1 — không dòng nào có cả hai. Cùng phần tử ⇒ $elemMatch.',
      },
      {
        question: 'A report uses { shipTo: { city: "Huế" } }. Next month the team adds a district field to every shipping address. What happens to the report?|||Một báo cáo dùng { shipTo: { city: "Huế" } }. Tháng sau nhóm thêm trường district vào mọi địa chỉ giao hàng. Báo cáo sẽ ra sao?',
        options: [
          'Nothing changes — extra fields are ignored|||Không đổi gì — trường thừa bị bỏ qua',
          'It now also matches orders to other cities|||Giờ nó khớp cả đơn giao tới thành phố khác',
          'It throws an error about the new field|||Nó báo lỗi về trường mới',
          'It silently drops to 0 — the embedded document is no longer exactly { city: "Huế" }|||Nó lặng lẽ tụt về 0 — tài liệu nhúng không còn đúng y { city: "Huế" }',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Equality on an embedded document requires the same fields, values and order — the two addresses that differed only in field order already showed it (only document 1 matched). Use dot notation: { "shipTo.city": "Huế" }.|||VI: So bằng trên tài liệu nhúng đòi cùng trường, cùng giá trị và cùng thứ tự — hai địa chỉ chỉ khác thứ tự trường đã cho thấy điều đó (chỉ tài liệu 1 khớp). Hãy dùng dấu chấm: { "shipTo.city": "Huế" }.',
      },
      {
        question: 'An invoice service calls findOneAndUpdate({ _id: "hoaDon2026" }, { $inc: { seq: 1 } }) and prints .seq as the new invoice number. What is wrong?|||Một dịch vụ hoá đơn gọi findOneAndUpdate({ _id: "hoaDon2026" }, { $inc: { seq: 1 } }) và in .seq làm số hoá đơn mới. Sai ở đâu?',
        options: [
          'It returns the document before the increment, so it prints the previous number — two invoices can show the same number|||Nó trả tài liệu trước khi tăng, nên in ra số cũ — hai hoá đơn có thể mang cùng một số',
          'Nothing — findOneAndUpdate always returns the new document|||Không sai gì — findOneAndUpdate luôn trả tài liệu mới',
          '$inc is not atomic, two servers can get the same number|||$inc không nguyên tử, hai máy chủ có thể nhận cùng một số',
          'It must be a transaction to be correct|||Phải là transaction mới đúng',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The default is the document before the change; the demo returned seq: 3 although the call had just reserved 4. Add returnDocument: "after" (and upsert: true to create the counter). The increment itself is atomic.|||VI: Mặc định là tài liệu trước khi đổi; demo trả seq: 3 dù lần gọi vừa giữ số 4. Thêm returnDocument: "after" (và upsert: true để tạo bộ đếm). Bản thân phép tăng là nguyên tử.',
      },
      {
        question: 'Five units in stock, four processes buying at the same time. Which code can never sell a sixth unit?|||Còn 5 chiếc, bốn tiến trình mua cùng lúc. Đoạn mã nào không bao giờ bán được chiếc thứ sáu?',
        options: [
          'const p = findOne({ _id }); if (p.stock >= 1) updateOne({ _id }, { $set: { stock: p.stock - 1 } })|||const p = findOne({ _id }); if (p.stock >= 1) updateOne({ _id }, { $set: { stock: p.stock - 1 } })',
          'const p = findOne({ _id }); if (p.stock >= 1) updateOne({ _id }, { $inc: { stock: -1 } })|||const p = findOne({ _id }); if (p.stock >= 1) updateOne({ _id }, { $inc: { stock: -1 } })',
          'updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } }) and check modifiedCount|||updateOne({ _id, stock: { $gte: 1 } }, { $inc: { stock: -1 } }) rồi kiểm modifiedCount',
          'Any of them, if each request waits a random 50 ms first|||Đoạn nào cũng được, nếu mỗi request chờ ngẫu nhiên 50 ms trước',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Only C makes check and write one atomic operation; the demo sold exactly 5 with it and more than 5 with the naive version. B can push stock below zero. Random delays make the race rarer, not impossible — Homakov noted this in the Starbucks race (2015).|||VI: Chỉ C biến việc kiểm và ghi thành một thao tác nguyên tử; demo bán đúng 5 với nó và hơn 5 với bản ngây thơ. B có thể đẩy tồn xuống âm. Độ trễ ngẫu nhiên làm tranh chấp hiếm đi, không phải không thể — Homakov đã nhận xét điều này trong vụ Starbucks (2015).',
      },
      {
        question: 'On 200,000 documents, find().sort({ _id: 1 }).skip(199980).limit(20) — how many index keys did explain report as examined?|||Trên 200.000 tài liệu, find().sort({ _id: 1 }).skip(199980).limit(20) — explain báo đã quét bao nhiêu khoá chỉ mục?',
        options: [
          '20 — skip jumps straight to the position|||20 — skip nhảy thẳng tới vị trí',
          '200,000 — the server walks past every skipped entry|||200.000 — máy chủ đi qua từng mục bị bỏ',
          '0 — skip uses only metadata|||0 — skip chỉ dùng metadata',
          '199,980 documents were fetched from disk|||199.980 tài liệu được đọc từ đĩa',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: totalKeysExamined was 200,000 with only 20 documents examined; the keyset version (_id > 199960) examined 20 keys. Deep skip pages cost proportional to the offset — use keyset for APIs, feeds and exports.|||VI: totalKeysExamined là 200.000 trong khi chỉ đọc 20 tài liệu; bản keyset (_id > 199960) quét 20 khoá. Trang skip càng sâu càng tốn tỉ lệ với độ lệch — dùng keyset cho API, feed và xuất dữ liệu.',
      },
      {
        question: 'find({ t: "an" }).collation({ locale: "vi", strength: 1 }) on values an, An, án, àn, Ân, ăn, AN. Which are returned?|||find({ t: "an" }).collation({ locale: "vi", strength: 1 }) trên các giá trị an, An, án, àn, Ân, ăn, AN. Những giá trị nào được trả về?',
        options: [
          'Only an|||Chỉ an',
          'an, An, AN|||an, An, AN',
          'an, An, án, àn, AN — not Ân, ăn|||an, An, án, àn, AN — không có Ân, ăn',
          'All seven|||Cả bảy',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Strength 1 ignores case and tone marks, but in the Vietnamese collation ă and â are separate letters. The en locale at strength 1 returned all seven. For accent-free search ("nguyen" → "Nguyễn") store a normalised search field instead.|||VI: Strength 1 bỏ qua hoa thường và dấu thanh, nhưng trong collation tiếng Việt ă và â là chữ cái riêng. Locale en ở strength 1 trả về cả bảy. Với tìm kiếm không dấu ("nguyen" → "Nguyễn"), hãy lưu một trường tìm kiếm đã chuẩn hoá.',
      },
    ],
  },
};
