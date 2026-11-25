/**
 * 0.3 — Kiểm tra Mục 0 (soạn 24/11/2026, agent mgo). 10 câu: tài liệu vs bảng, ACID/transaction, lịch sử + SSPL, BSON,
 * khi nào KHÔNG chọn MongoDB, lỗi trường gõ sai (904 ≠ 905), vụ tống tiền 2017, cổng Docker, replica set một thành viên,
 * directConnection. Phân bố đáp án: A ×2 (5, 9) · B ×3 (1, 4, 8) · C ×3 (2, 6, 10) · D ×2 (3, 7).
 */
export default {
  title: '0.3 — Section 0 quiz|||0.3 — Kiểm tra Mục 0',
  slug: 'mgo-0-3-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười tình huống: tờ phiếu và sổ cái, MongoDB có ACID không, giấy phép SSPL, Decimal128, khi nào không chọn MongoDB, trường gõ sai làm lệch báo cáo, bài học tống tiền 2017, cổng Docker vượt ufw, vì sao lab là replica set, directConnection.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Quiz</span>
<h2>Before Chapter 1: check the foundations</h2>
<p class="lead">Ten short situations from Section 0. Read every explanation — several of them are interview answers you will reuse.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the document model with an everyday picture and say what it makes cheap and what it makes expensive.</li>
<li>I can name three cases for MongoDB and three against it, with reasons.</li>
<li>I can retell the 2017 ransom wave and the four rules that prevent it.</li>
<li>My lab is running: <code>db.orders.countDocuments({ status: 'PAID' })</code> returns 903.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Trước Chương 1: kiểm lại phần nền</h2>
<p class="lead">Mười tình huống ngắn từ Mục 0. Đọc kỹ mọi lời giải thích — vài câu trong đó là câu trả lời phỏng vấn bạn sẽ dùng lại.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được mô hình tài liệu bằng một hình ảnh đời thường và nói được nó làm cái gì rẻ, cái gì đắt.</li>
<li>Tôi kể được ba trường hợp nên dùng MongoDB và ba trường hợp không nên, kèm lý do.</li>
<li>Tôi kể lại được làn sóng tống tiền 2017 và bốn luật ngăn nó.</li>
<li>Lab của tôi đang chạy: <code>db.orders.countDocuments({ status: 'PAID' })</code> trả về 903.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 600,
    questions: [
      {
        question: 'In the "order slip vs ledger" picture, what does the document model make cheap?|||Trong hình ảnh "tờ phiếu và sổ cái", mô hình tài liệu làm cho việc gì trở nên rẻ?',
        options: [
          'Changing one piece of data that is shared by thousands of records|||Sửa một mẩu dữ liệu được hàng nghìn bản ghi dùng chung',
          'Reading or writing one complete unit (an order with its lines) in a single operation|||Đọc hoặc ghi trọn một đơn vị (đơn hàng kèm các dòng) trong một thao tác',
          'Rejecting a reference to a customer that does not exist|||Từ chối tham chiếu tới một khách hàng không tồn tại',
          'Ad-hoc reports joining many entities written by analysts|||Báo cáo tuỳ ý nối nhiều thực thể do người phân tích viết',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: What is read together is stored together, so one aggregate is one read or one atomic write. Shared data, foreign keys and ad-hoc joins are exactly where the ledger (SQL) is stronger.|||VI: Thứ đọc cùng nhau được cất cùng nhau, nên một khối là một lần đọc hoặc một lần ghi nguyên tử. Dữ liệu dùng chung, khoá ngoại và JOIN tuỳ ý chính là chỗ sổ cái (SQL) mạnh hơn.',
      },
      {
        question: 'An interviewer says: "MongoDB has no transactions, right?" The best answer is…|||Người phỏng vấn nói: "MongoDB không có transaction, đúng không?" Câu trả lời tốt nhất là…',
        options: [
          'Right — that is why banks never use it|||Đúng — vì vậy ngân hàng không bao giờ dùng nó',
          'Right, but you can emulate them with Redis locks|||Đúng, nhưng có thể giả lập bằng khoá Redis',
          'Single-document writes are always atomic; multi-document ACID transactions exist since 4.0 (replica sets) and 4.2 (sharded) — and good schema design needs them rarely|||Ghi trên một tài liệu luôn nguyên tử; transaction ACID nhiều tài liệu có từ 4.0 (replica set) và 4.2 (cụm shard) — và schema tốt hiếm khi cần tới',
          'Only in MongoDB Atlas, not in the self-hosted version|||Chỉ có trên MongoDB Atlas, bản tự cài thì không',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The "no transactions" claim is outdated since June 2018. Add the design point: related data in one document makes most operations single-document and atomic.|||VI: Câu "không có transaction" đã lỗi thời từ 06/2018. Nói thêm ý thiết kế: dữ liệu liên quan nằm chung một tài liệu khiến phần lớn thao tác là đơn tài liệu và nguyên tử.',
      },
      {
        question: 'Why are AWS DocumentDB and Azure Cosmos DB "MongoDB-compatible" rather than running MongoDB itself?|||Vì sao AWS DocumentDB và Azure Cosmos DB chỉ "tương thích MongoDB" thay vì chạy chính MongoDB?',
        options: [
          'MongoDB is closed source and cannot be downloaded|||MongoDB là mã đóng, không tải về được',
          'MongoDB only runs on Linux|||MongoDB chỉ chạy trên Linux',
          'The AGPL licence forbids any commercial use|||Giấy phép AGPL cấm mọi mục đích thương mại',
          'Since 10/2018 the SSPL licence restricts offering MongoDB as a service unless the provider open-sources its whole service stack|||Từ 10/2018 giấy phép SSPL hạn chế việc cung cấp MongoDB dạng dịch vụ trừ khi nhà cung cấp mở mã toàn bộ hệ thống dịch vụ',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: You may use MongoDB freely in your own product; the SSPL targets companies selling "MongoDB as a service". Cloud vendors therefore built their own engines that speak the MongoDB protocol.|||VI: Bạn dùng MongoDB tự do trong sản phẩm của mình; SSPL nhắm vào các công ty bán "MongoDB dạng dịch vụ". Vì thế các hãng đám mây tự viết bộ máy riêng nói được giao thức MongoDB.',
      },
      {
        question: 'CT Shop stores prices as Decimal128 instead of a normal JavaScript number. Why?|||CT Shop lưu giá bằng Decimal128 thay vì số JavaScript thường. Vì sao?',
        options: [
          'Decimal128 uses less disk space|||Decimal128 tốn ít ổ đĩa hơn',
          'A double cannot represent most decimal fractions exactly (0.1 + 0.2 ≠ 0.3); money needs exact decimal arithmetic|||Số double không biểu diễn chính xác phần lớn phân số thập phân (0.1 + 0.2 ≠ 0.3); tiền cần phép tính thập phân chính xác',
          'Numbers cannot be indexed in MongoDB|||Số không đánh index được trong MongoDB',
          'mongosh cannot display large numbers|||mongosh không hiển thị được số lớn',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Binary floating point rounds decimal fractions; sums of many prices drift. Decimal128 is BSON’s exact decimal type — Lesson 1.2 shows the bug for real.|||VI: Số thực nhị phân làm tròn phân số thập phân; cộng nhiều giá sẽ lệch dần. Decimal128 là kiểu thập phân chính xác của BSON — Bài 1.2 cho thấy lỗi chạy thật.',
      },
      {
        question: 'Which system is the WEAKEST fit for MongoDB as its main database?|||Hệ thống nào KÉM hợp nhất để dùng MongoDB làm cơ sở dữ liệu chính?',
        options: [
          'A wallet app recording top-ups and transfers that must reconcile to the last đồng|||Ví điện tử ghi nạp tiền và chuyển tiền phải khớp tới từng đồng',
          'A product catalogue where every category has different attributes|||Danh mục sản phẩm mà mỗi loại có thuộc tính khác nhau',
          'A CMS where posts can be articles, galleries or videos|||CMS mà bài đăng có thể là bài viết, bộ ảnh hay video',
          'A store of device readings arriving every few seconds|||Kho số đo thiết bị gửi tới vài giây một lần',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A ledger wants constraints, foreign keys and mature SQL transaction tooling; nothing in MongoDB stops a bug from writing an orphan. The other three are varied shapes or high-volume aggregates — MongoDB’s home ground.|||VI: Sổ cái cần ràng buộc, khoá ngoại và bộ công cụ transaction SQL trưởng thành; trong MongoDB không gì ngăn một lỗi lập trình ghi ra bản ghi mồ côi. Ba hệ còn lại là dữ liệu nhiều hình dạng hoặc khối lượng lớn — sân nhà của MongoDB.',
      },
      {
        question: 'In Lesson 0.1 two orders were inserted, but the count of PAID orders rose from 903 to 904, not 905. Why?|||Ở Bài 0.1 đã chèn hai đơn, nhưng số đơn PAID chỉ tăng từ 903 lên 904 chứ không phải 905. Vì sao?',
        options: [
          'countDocuments is approximate|||countDocuments chỉ là ước lượng',
          'The order for customer KH9999 was rejected|||Đơn của khách KH9999 bị từ chối',
          'One order was saved with the field "stauts", so the filter { status: "PAID" } does not match it — and MongoDB accepted it silently because no validator exists|||Một đơn được lưu với trường "stauts", nên bộ lọc { status: "PAID" } không khớp nó — và MongoDB im lặng nhận vì chưa có validator',
          'The second insert is still in a transaction that was not committed|||Lệnh chèn thứ hai vẫn nằm trong một transaction chưa commit',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Both inserts were acknowledged. The typo field makes the order invisible to every query on status. PostgreSQL rejected the same insert ("column stauts does not exist"); in MongoDB a $jsonSchema validator (Lesson 1.3) is how you get that protection.|||VI: Cả hai lệnh chèn đều được xác nhận. Trường gõ sai khiến đơn đó vô hình với mọi truy vấn theo status. PostgreSQL từ chối đúng lệnh chèn đó ("column stauts does not exist"); trong MongoDB, validator $jsonSchema (Bài 1.3) là cách lấy lại sự bảo vệ ấy.',
      },
      {
        question: 'January 2017: what made tens of thousands of MongoDB databases easy to wipe?|||Tháng 1/2017: điều gì khiến hàng chục nghìn database MongoDB dễ bị xoá sạch?',
        options: [
          'A zero-day remote code execution bug in MongoDB 3.4|||Một lỗ hổng thực thi mã từ xa chưa được vá trong MongoDB 3.4',
          'Stolen administrator passwords from a phishing campaign|||Mật khẩu quản trị bị đánh cắp qua chiến dịch lừa đảo',
          'Weak encryption of the data files|||Mã hoá tệp dữ liệu yếu',
          'Servers reachable from the internet with authentication off — anyone could list, read and drop databases with ordinary commands|||Máy chủ chạm được từ Internet mà không bật xác thực — ai cũng liệt kê, đọc và xoá database bằng lệnh thông thường',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: No exploit was needed: three normal commands, as you replayed on port 47018. Krebs reported 52,000+ open databases on Shodan and at least 29,000 erased; competing gangs overwrote each other’s notes, so payers got nothing.|||VI: Không cần khai thác lỗ hổng nào: ba câu lệnh bình thường, như bạn đã diễn lại trên cổng 47018. Krebs đưa tin hơn 52.000 database mở trên Shodan và ít nhất 29.000 bị xoá; các nhóm tranh nhau đè lời nhắn của nhau, nên người trả tiền không nhận lại gì.',
      },
      {
        question: 'Your VPS runs MongoDB with docker run -p 27017:27017 and ufw blocks port 27017. Is it safe?|||VPS của bạn chạy MongoDB bằng docker run -p 27017:27017 và ufw đã chặn cổng 27017. Có an toàn không?',
        options: [
          'Yes — ufw blocks it|||An toàn — ufw đã chặn',
          'Not necessarily — Docker inserts its own firewall rules that are applied before ufw, so the port can still be reachable; publish on 127.0.0.1 or a private network instead|||Chưa chắc — Docker chèn luật tường lửa riêng được áp trước ufw, nên cổng vẫn có thể chạm tới được; hãy chỉ mở trên 127.0.0.1 hoặc mạng riêng',
          'Yes, because MongoDB 8.0 binds to localhost by default inside the container|||An toàn, vì MongoDB 8.0 mặc định chỉ nghe localhost bên trong container',
          'Only if the server is in Vietnam|||Chỉ an toàn nếu máy chủ đặt ở Việt Nam',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Docker’s published ports bypass ufw on Linux. And the official image starts mongod listening on all interfaces inside the container, so the localhost default does not help. Bind the published port to 127.0.0.1 and turn authentication on.|||VI: Cổng Docker mở ra vượt qua ufw trên Linux. Và ảnh chính thức cho mongod nghe mọi giao diện bên trong container, nên mặc định localhost chẳng giúp gì. Hãy gắn cổng mở ra vào 127.0.0.1 và bật xác thực.',
      },
      {
        question: 'Why does the course lab start MongoDB as a replica set with only ONE member?|||Vì sao lab của khoá khởi động MongoDB dạng replica set chỉ có MỘT thành viên?',
        options: [
          'Transactions and change streams only work on a replica set, so the lab never has to be rebuilt later|||Transaction và change stream chỉ chạy trên replica set, nên về sau không phải dựng lại lab',
          'A one-member replica set gives automatic failover|||Replica set một thành viên cho chuyển dự phòng tự động',
          'It doubles the write speed|||Nó tăng gấp đôi tốc độ ghi',
          'mongosh refuses to connect to a standalone server|||mongosh từ chối kết nối máy chủ đơn lẻ',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: One member gives no redundancy at all — failover needs at least three members (Chapter 7). It is there to enable the features that require a replica set.|||VI: Một thành viên thì không dự phòng gì cả — chuyển dự phòng cần ít nhất ba thành viên (Chương 7). Nó có mặt để mở các tính năng đòi hỏi replica set.',
      },
      {
        question: 'From the host, mongodb://127.0.0.1:47017/?replicaSet=rs0 fails with ECONNREFUSED 127.0.0.1:27017. What is the fix for the one-member lab?|||Từ máy thật, mongodb://127.0.0.1:47017/?replicaSet=rs0 báo lỗi ECONNREFUSED 127.0.0.1:27017. Sửa thế nào cho lab một thành viên?',
        options: [
          'Open port 27017 on the host firewall|||Mở cổng 27017 trên tường lửa máy thật',
          'Change the image to mongo:latest|||Đổi ảnh sang mongo:latest',
          'Use directConnection=true so the driver talks to exactly 127.0.0.1:47017 instead of the member name localhost:27017 it discovered|||Dùng directConnection=true để driver nói chuyện đúng với 127.0.0.1:47017 thay vì tên thành viên localhost:27017 mà nó dò được',
          'Run rs.initiate() again|||Chạy lại rs.initiate()',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: With replicaSet=rs0 the driver asks for the member list and gets "localhost:27017" — the name inside the container. directConnection skips discovery. In Chapter 7 you fix it properly with resolvable member names.|||VI: Với replicaSet=rs0, driver hỏi danh sách thành viên và nhận "localhost:27017" — tên bên trong container. directConnection bỏ qua bước dò. Ở Chương 7 bạn sửa bài bản bằng tên thành viên phân giải được.',
      },
    ],
  },
};
