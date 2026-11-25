/**
 * Dự án xuyên suốt khoá MongoDB (docs/du-an-hop-dong.md v1) — soạn 24/11/2026, agent mgo.
 * 5 đề tài gợi ý · 10 mốc (mốc N sau Chương N, chèn trước quiz chương) · bảo vệ (rubric 10 điểm, ≥ 15 câu hội đồng).
 * Bài mốc dựng bằng baiMoc(so); bài cuối khoá bằng baiBaoVe(). Đăng ký đề tài: cờ dangKyDuAn ở bài mgo-0-9-bat-dau-hoc-the-nao.
 * Mốc viết CHUNG cho mọi đề tài; bảng banDoChuong cho biết mốc nghĩa là gì với từng đề tài.
 * Ví dụ chạy thật theo mốc ("đề tài mẫu") thêm dần khi soạn chi tiết từng chương — chưa có thì bài mốc không hiện khối đó.
 */

const GIOI_THIEU = 'By the end of this course you will have built the data layer of a real application on MongoDB — schema designed from its queries, validated, indexed with measured explain output, reports written as aggregation pipelines, the one operation where money or stock is at stake made correct under concurrency, running on a three-node replica set that survives losing a server, used from Node.js or Spring Boot, secured, backed up and load-tested. You build it a little at the end of every chapter, on a topic you choose now, and finish by defending it in front of an AI committee — exactly how a graduation project or a technical interview ends.|||Cuối khoá bạn sẽ có tầng dữ liệu của một ứng dụng thật chạy trên MongoDB — schema thiết kế từ chính các truy vấn của nó, có kiểm hợp lệ, có index kèm số đo explain, báo cáo viết bằng aggregation pipeline, thao tác dính tới tiền hay tồn kho chạy đúng khi đồng thời, chạy trên replica set ba máy sống sót khi mất một máy, được gọi từ Node.js hoặc Spring Boot, có bảo mật, có sao lưu và đã đo tải. Bạn xây dần một chút ở cuối mỗi chương, trên đề tài bạn chọn ngay bây giờ, rồi kết thúc bằng buổi bảo vệ trước hội đồng AI — đúng như cách một đồ án tốt nghiệp hay một buổi phỏng vấn kỹ thuật kết thúc.';

const DE_TAI = [
  {
    slug: 'shop-thoi-trang-bien-the',
    ten: 'Fashion shop with product variants|||Cửa hàng thời trang nhiều biến thể',
    moTa: 'An online clothing shop where each product has many variants (size × colour) with their own stock, plus orders, reviews and a sales dashboard. The catalogue is where documents shine; the stock is where concurrency bites.|||Cửa hàng quần áo trực tuyến, mỗi sản phẩm có nhiều biến thể (cỡ × màu) với tồn kho riêng, kèm đơn hàng, đánh giá và bảng điều khiển doanh số. Danh mục là chỗ tài liệu toả sáng; tồn kho là chỗ đồng thời cắn bạn.',
    doKho: 2,
    tinhNang: [
      'Catalogue with category-specific attributes and variants|||Danh mục có thuộc tính riêng theo loại hàng và biến thể',
      'Search and filter by attributes, price range, size in stock|||Tìm và lọc theo thuộc tính, khoảng giá, cỡ còn hàng',
      'Cart and checkout that never oversells a variant|||Giỏ hàng và đặt hàng không bao giờ bán vượt tồn kho một biến thể',
      'Orders with line items and price at purchase time|||Đơn hàng có các dòng và giá lúc mua',
      'Reviews with rating summary per product|||Đánh giá kèm tóm tắt số sao theo sản phẩm',
      'Sales dashboard: revenue by day, top products, repeat customers|||Bảng doanh số: doanh thu theo ngày, sản phẩm bán chạy, khách quay lại',
      'Admin price change that does not rewrite old orders|||Quản trị đổi giá mà không làm sai đơn cũ',
    ],
    banDoChuong: [
      { moc: 1, dung: 'products with variants, orders, reviews; validator on products and orders; Decimal128 prices|||products có biến thể, orders, reviews; validator cho products và orders; giá Decimal128' },
      { moc: 2, dung: 'filter queries, add/remove variant, atomic stock decrement, keyset-paged product list|||truy vấn lọc, thêm/bớt biến thể, trừ kho nguyên tử, danh sách sản phẩm phân trang keyset' },
      { moc: 3, dung: 'embed variants, extended reference in order lines, subset pattern for latest reviews|||nhúng biến thể, extended reference trong dòng đơn, subset pattern cho đánh giá mới nhất' },
      { moc: 4, dung: 'indexes for category + price filters and "my orders", explain before/after|||index cho lọc danh mục + giá và "đơn của tôi", explain trước/sau' },
      { moc: 5, dung: 'revenue by day (Asia/Ho_Chi_Minh), top 10 products, rating histogram with $bucket|||doanh thu theo ngày (giờ Việt Nam), top 10 sản phẩm, biểu đồ số sao bằng $bucket' },
      { moc: 6, dung: 'checkout that reserves stock for several variants in one transaction|||đặt hàng giữ kho nhiều biến thể trong một transaction' },
      { moc: 7, dung: 'checkout still works while the primary is killed|||đặt hàng vẫn chạy khi giết primary' },
      { moc: 8, dung: 'product and order API in Express + Mongoose or Spring Data|||API sản phẩm và đơn hàng bằng Express + Mongoose hoặc Spring Data' },
      { moc: 9, dung: 'login and search endpoints proven safe from operator injection|||endpoint đăng nhập và tìm kiếm được chứng minh an toàn trước chèn toán tử' },
      { moc: 10, dung: 'restore drill after a bad price update, load test of the product list|||diễn tập khôi phục sau lần cập nhật giá sai, đo tải danh sách sản phẩm' },
    ],
    thamKhaoThat: ['Product pages of Shopee, Tiki, Zara — one product, many size/colour variants|||Trang sản phẩm của Shopee, Tiki, Zara — một sản phẩm, nhiều biến thể cỡ/màu'],
    anh: null,
  },
  {
    slug: 'giam-sat-cam-bien',
    ten: 'Sensor monitoring platform|||Nền tảng giám sát cảm biến',
    moTa: 'Devices in a greenhouse or a server room send temperature, humidity and power readings every few seconds. The platform stores them efficiently, raises alerts, and shows dashboards per device and per hour. A pure write-heavy, time-based workload.|||Thiết bị trong nhà kính hoặc phòng máy gửi nhiệt độ, độ ẩm, điện năng vài giây một lần. Nền tảng lưu chúng hiệu quả, bắn cảnh báo, và vẽ bảng điều khiển theo thiết bị, theo giờ. Một khối việc thuần ghi nhiều, theo thời gian.',
    doKho: 3,
    tinhNang: [
      'Device registry with per-model attributes|||Danh bạ thiết bị có thuộc tính riêng theo đời máy',
      'Ingest endpoint accepting batches of readings|||Endpoint nhận số đo theo lô',
      'Bucket pattern or time series collection for readings|||Bucket pattern hoặc time series collection cho số đo',
      'Hourly/daily min-avg-max per device|||Nhỏ nhất – trung bình – lớn nhất theo giờ/ngày cho từng thiết bị',
      'Threshold alerts with acknowledge and history|||Cảnh báo theo ngưỡng, có xác nhận và lịch sử',
      'Automatic expiry of raw data after 30 days (TTL)|||Tự xoá dữ liệu thô sau 30 ngày (TTL)',
      'Simulator script generating realistic readings|||Kịch bản giả lập sinh số đo giống thật',
    ],
    banDoChuong: [
      { moc: 1, dung: 'devices, readings, alerts; validator; Date in UTC, numbers as double on purpose|||devices, readings, alerts; validator; Date theo UTC, số đo cố ý dùng double' },
      { moc: 2, dung: 'insertMany batches, latest reading per device, acknowledge alert atomically|||chèn lô insertMany, số đo mới nhất mỗi thiết bị, xác nhận cảnh báo nguyên tử' },
      { moc: 3, dung: 'bucket pattern (one document per device per hour) vs one document per reading — measured|||bucket pattern (một tài liệu mỗi thiết bị mỗi giờ) so với mỗi số đo một tài liệu — có đo' },
      { moc: 4, dung: 'compound index device + time, TTL index for raw data|||index phức hợp thiết bị + thời gian, index TTL cho dữ liệu thô' },
      { moc: 5, dung: 'hourly aggregates with $dateTrunc, moving average with $setWindowFields|||tổng hợp theo giờ bằng $dateTrunc, trung bình trượt bằng $setWindowFields' },
      { moc: 6, dung: 'raising an alert exactly once while many readings arrive concurrently|||bắn cảnh báo đúng một lần khi nhiều số đo tới đồng thời' },
      { moc: 7, dung: 'ingest with w:"majority" survives a primary failure; shard key proposal for 100k devices|||nhận số đo với w:"majority" sống sót khi primary chết; đề xuất shard key cho 100.000 thiết bị' },
      { moc: 8, dung: 'ingest + dashboard API from Node.js driver or Spring Data|||API nhận số đo + bảng điều khiển bằng driver Node.js hoặc Spring Data' },
      { moc: 9, dung: 'device API keys, ingest user that can only insert|||khoá API thiết bị, tài khoản nhận số đo chỉ được chèn' },
      { moc: 10, dung: 'load test the ingest endpoint, change stream pushing live alerts|||đo tải endpoint nhận số đo, change stream đẩy cảnh báo trực tiếp' },
    ],
    thamKhaoThat: ['Smart-home and smart-farm dashboards (Xiaomi Home, Rạng Đông Smart Farm) — readings, charts, alerts|||Bảng điều khiển nhà thông minh, nông trại thông minh (Xiaomi Home, Rạng Đông Smart Farm) — số đo, biểu đồ, cảnh báo'],
    anh: null,
  },
  {
    slug: 'cms-blog-nhieu-kieu',
    ten: 'Blog / CMS with many content types|||Blog / CMS nhiều kiểu nội dung',
    moTa: 'A publishing platform where a post can be an article, a gallery, a video or a quiz, each with different fields; with tags, comments, full-text search and a "most read this week" list. The friendliest topic if this is your first database project.|||Nền tảng đăng bài mà một bài có thể là bài viết, bộ ảnh, video hoặc câu đố, mỗi kiểu có trường riêng; có thẻ, bình luận, tìm kiếm toàn văn và danh sách "đọc nhiều tuần này". Đề tài dễ thở nhất nếu đây là dự án cơ sở dữ liệu đầu tiên của bạn.',
    doKho: 1,
    tinhNang: [
      'Polymorphic posts (article, gallery, video, quiz)|||Bài đăng đa hình (bài viết, bộ ảnh, video, câu đố)',
      'Draft → review → published workflow with history|||Quy trình nháp → duyệt → đăng có lịch sử',
      'Tags and tag pages|||Thẻ và trang theo thẻ',
      'Comments with bounded embedding + overflow collection|||Bình luận nhúng có giới hạn + collection tràn',
      'Full-text search in Vietnamese titles and bodies|||Tìm kiếm toàn văn trong tiêu đề và nội dung tiếng Việt',
      'View counter and "most read this week"|||Bộ đếm lượt xem và "đọc nhiều tuần này"',
    ],
    banDoChuong: [
      { moc: 1, dung: 'posts with a type field, authors, comments; validator with oneOf per type|||posts có trường type, authors, comments; validator dùng oneOf theo từng kiểu' },
      { moc: 2, dung: 'publish/unpublish, $addToSet tags, $inc views, keyset-paged feed|||đăng/gỡ, $addToSet thẻ, $inc lượt xem, bảng tin phân trang keyset' },
      { moc: 3, dung: 'polymorphic pattern, subset pattern for comments, schema versioning for an old post format|||polymorphic pattern, subset pattern cho bình luận, schema versioning cho định dạng bài cũ' },
      { moc: 4, dung: 'text index, partial index on published posts|||text index, partial index trên bài đã đăng' },
      { moc: 5, dung: 'posts per tag, most read this week, author leaderboard|||số bài theo thẻ, đọc nhiều tuần này, bảng xếp hạng tác giả' },
      { moc: 6, dung: 'publishing a post and updating the tag counters together|||đăng bài và cập nhật bộ đếm thẻ cùng lúc' },
      { moc: 7, dung: 'reading the feed from secondaries — and explaining the stale read you saw|||đọc bảng tin từ secondary — và giải thích lần đọc dữ liệu cũ bạn gặp' },
      { moc: 8, dung: 'post API with Mongoose discriminators or Spring Data inheritance|||API bài đăng bằng discriminator của Mongoose hoặc kế thừa trong Spring Data' },
      { moc: 9, dung: 'editor vs reader roles, safe search input, no $where|||vai trò biên tập và người đọc, đầu vào tìm kiếm an toàn, không $where' },
      { moc: 10, dung: 'nightly backup + restore drill, load test of the feed|||sao lưu hằng đêm + diễn tập khôi phục, đo tải bảng tin' },
    ],
    thamKhaoThat: ['Medium, Viblo, VnExpress — articles, galleries, videos, tags and comments|||Medium, Viblo, VnExpress — bài viết, bộ ảnh, video, thẻ và bình luận'],
    anh: null,
  },
  {
    slug: 'dat-ve-su-kien',
    ten: 'Event ticketing with seat selection|||Đặt vé sự kiện có chọn ghế',
    moTa: 'Concerts and talks with seat maps; users hold seats for 10 minutes, pay (simulated), and get a ticket. Thousands of people want the same front-row seats at 20:00 sharp — the hardest topic, all about concurrency and consistency.|||Các buổi hoà nhạc, hội thảo có sơ đồ ghế; người dùng giữ ghế 10 phút, thanh toán (giả lập), rồi nhận vé. Hàng nghìn người cùng muốn ghế hàng đầu đúng 20:00 — đề tài khó nhất, xoay quanh đồng thời và nhất quán.',
    doKho: 3,
    tinhNang: [
      'Events with venues and seat maps|||Sự kiện kèm địa điểm và sơ đồ ghế',
      'Seat hold that expires automatically|||Giữ ghế tự hết hạn',
      'Purchase that can never double-sell a seat|||Mua vé không bao giờ bán trùng một ghế',
      'Tickets with QR code and check-in|||Vé có mã QR và soát vé',
      'Waiting list when sold out|||Danh sách chờ khi hết vé',
      'Sales report per event and per price tier|||Báo cáo bán vé theo sự kiện và theo hạng giá',
    ],
    banDoChuong: [
      { moc: 1, dung: 'events, seats, holds, tickets; validator; Decimal128 prices|||events, seats, holds, tickets; validator; giá Decimal128' },
      { moc: 2, dung: 'hold a seat with one conditional update, release, list free seats|||giữ ghế bằng một lệnh cập nhật có điều kiện, nhả ghế, liệt kê ghế trống' },
      { moc: 3, dung: 'seats embedded per section vs one document per seat — decide with numbers|||ghế nhúng theo khu vực hay mỗi ghế một tài liệu — quyết định bằng số đo' },
      { moc: 4, dung: 'unique index that makes double-selling impossible, TTL index on holds|||unique index khiến bán trùng là không thể, index TTL cho lượt giữ ghế' },
      { moc: 5, dung: 'sales per tier, fill rate per section, hourly sales curve|||doanh số theo hạng, tỉ lệ lấp đầy theo khu, đường bán theo giờ' },
      { moc: 6, dung: 'hold → pay → ticket in one transaction, 200 concurrent buyers test|||giữ → trả → xuất vé trong một transaction, thử 200 người mua đồng thời' },
      { moc: 7, dung: 'no ticket lost when the primary dies mid-purchase (w:"majority")|||không mất vé nào khi primary chết giữa lúc mua (w:"majority")' },
      { moc: 8, dung: 'booking API with retryable transactions in the driver|||API đặt vé có transaction tự thử lại trong driver' },
      { moc: 9, dung: 'per-user rate limit, no injection in seat queries, ticket codes not guessable|||giới hạn tần suất mỗi người, không chèn được vào truy vấn ghế, mã vé không đoán được' },
      { moc: 10, dung: 'load test of the 20:00 rush, p99 under your target|||đo tải cơn mở bán 20:00, p99 dưới mục tiêu của bạn' },
    ],
    thamKhaoThat: ['Ticketbox, Ticketmaster — seat maps, holds and sell-outs in minutes|||Ticketbox, Ticketmaster — sơ đồ ghế, giữ chỗ và cháy vé trong vài phút'],
    anh: null,
  },
  {
    slug: 'nhat-ky-hoat-dong-hoc-tap',
    ten: 'Activity log and notifications for a learning app|||Nhật ký hoạt động và thông báo cho ứng dụng học tập',
    moTa: 'A service beside an existing learning website (think cuongthai.com): it records every learner action (opened a lesson, finished a quiz, posted a comment), builds streaks and progress, and sends notifications. High write volume, varied event shapes, and a real "MongoDB next to PostgreSQL" architecture.|||Một dịch vụ đặt cạnh một trang học trực tuyến có sẵn (hình dung cuongthai.com): ghi lại mọi hành động của người học (mở bài, xong quiz, viết bình luận), tính chuỗi ngày học và tiến độ, gửi thông báo. Lượng ghi lớn, sự kiện nhiều hình dạng, và một kiến trúc thật "MongoDB đặt cạnh PostgreSQL".',
    doKho: 2,
    tinhNang: [
      'Event ingestion with different payload per event type|||Nhận sự kiện, mỗi kiểu sự kiện một dạng dữ liệu',
      'Per-learner activity feed|||Bảng tin hoạt động của từng người học',
      'Daily streaks and weekly progress|||Chuỗi ngày học và tiến độ theo tuần',
      'Notifications with read/unread and expiry|||Thông báo có đã đọc/chưa đọc và hết hạn',
      'Admin analytics: active learners per day, drop-off per lesson|||Thống kê quản trị: người học hoạt động mỗi ngày, rơi rụng theo bài',
      'Real-time push of new notifications|||Đẩy thông báo mới theo thời gian thực',
    ],
    banDoChuong: [
      { moc: 1, dung: 'events, notifications, progress; validator with required common fields|||events, notifications, progress; validator với các trường chung bắt buộc' },
      { moc: 2, dung: 'insert events, feed per learner, mark all notifications read|||chèn sự kiện, bảng tin theo người học, đánh dấu đã đọc tất cả thông báo' },
      { moc: 3, dung: 'computed pattern for streaks, bucket pattern for events, reference to PostgreSQL user ids|||computed pattern cho chuỗi ngày, bucket pattern cho sự kiện, tham chiếu id người dùng bên PostgreSQL' },
      { moc: 4, dung: 'learner + time index, partial index on unread, TTL on notifications|||index người học + thời gian, partial index trên chưa đọc, TTL cho thông báo' },
      { moc: 5, dung: 'daily active learners, funnel of lesson completion, streak leaderboard|||người học hoạt động mỗi ngày, phễu hoàn thành bài, bảng xếp hạng chuỗi ngày' },
      { moc: 6, dung: 'updating progress and inserting the event consistently|||cập nhật tiến độ và chèn sự kiện một cách nhất quán' },
      { moc: 7, dung: 'event ingestion during failover; shard key for 1 million learners|||nhận sự kiện trong lúc chuyển dự phòng; shard key cho một triệu người học' },
      { moc: 8, dung: 'event API + change stream pushing notifications to the browser|||API sự kiện + change stream đẩy thông báo tới trình duyệt' },
      { moc: 9, dung: 'events hold no personal data beyond ids; service account with minimal roles|||sự kiện không chứa dữ liệu cá nhân ngoài id; tài khoản dịch vụ quyền tối thiểu' },
      { moc: 10, dung: 'load test ingestion at 1,000 events/s, backup policy for 90 days|||đo tải nhận 1.000 sự kiện/giây, chính sách sao lưu 90 ngày' },
    ],
    thamKhaoThat: ['Duolingo streaks and notifications; activity feeds of GitHub and LinkedIn|||Chuỗi ngày học và thông báo của Duolingo; bảng tin hoạt động của GitHub và LinkedIn'],
    anh: null,
  },
];

const MOC = [
  {
    so: 1, chuong: 1, slug: 'mgo-moc-1', sauChuong: 'Chapter 1|||Chương 1',
    ten: 'Collections, sample documents and a validator|||Collection, tài liệu mẫu và bộ kiểm hợp lệ',
    lead: 'Turn your topic into collections and real documents, and make the database reject the obviously wrong ones from day one.|||Biến đề tài thành các collection và tài liệu thật, và bắt cơ sở dữ liệu từ chối những tài liệu sai rõ ràng ngay từ ngày đầu.',
    yeuCau: [
      'A Git repository with compose.yaml (MongoDB 8.0, port on 127.0.0.1 only) and a README|||Một repo Git có compose.yaml (MongoDB 8.0, cổng chỉ trên 127.0.0.1) và README',
      'At least 3 collections for your topic, each with 2–3 hand-written sample documents in a seed script|||Ít nhất 3 collection cho đề tài, mỗi collection 2–3 tài liệu mẫu viết tay trong một kịch bản nạp',
      'Correct BSON types: Date for time, Decimal128 for money, ids chosen on purpose|||Đúng kiểu BSON: Date cho thời gian, Decimal128 cho tiền, id chọn có chủ đích',
      'A $jsonSchema validator on your main collection that rejects a missing required field and a misspelled status|||Một $jsonSchema validator trên collection chính, từ chối thiếu trường bắt buộc và trạng thái gõ sai',
    ],
    nangCao: ['A deterministic seed of 1,000+ documents (fixed random seed) for later chapters|||Bộ nạp tất định 1.000+ tài liệu (hạt giống cố định) cho các chương sau'],
    datKhi: [
      'docker compose up + the seed script produce the same data on a fresh machine|||docker compose up + kịch bản nạp ra đúng cùng dữ liệu trên máy mới',
      'The README shows one insert rejected by the validator, with the real error output|||README có một lệnh chèn bị validator từ chối, kèm output lỗi thật',
    ],
    goiY: [
      'Start from the screens: write what each screen shows, then group what is shown together|||Bắt đầu từ các màn hình: viết mỗi màn hiện gì, rồi gom những thứ hiện cùng nhau',
      'Use validationAction "error" during development so mistakes fail loudly|||Dùng validationAction "error" khi phát triển để lỗi hiện to rõ',
      'For enums use { enum: [...] }; for money { bsonType: "decimal" }|||Với tập giá trị dùng { enum: [...] }; với tiền { bsonType: "decimal" }',
    ],
    bangChung: ['Repository link (commit for this milestone)|||Link repo (commit của mốc này)', 'Screenshot or pasted output of the rejected insert|||Ảnh hoặc output dán của lệnh chèn bị từ chối'],
    nop: ['repo', 'anh'],
  },
  {
    so: 2, chuong: 2, slug: 'mgo-moc-2', sauChuong: 'Chapter 2|||Chương 2',
    ten: 'The queries your app really runs|||Những truy vấn ứng dụng bạn thật sự chạy',
    lead: 'Write, as a runnable script, every read and write your application will do — before any API code exists.|||Viết thành kịch bản chạy được mọi lệnh đọc và ghi ứng dụng sẽ làm — trước khi có dòng mã API nào.',
    yeuCau: [
      'A queries file with at least 8 named operations (find, filter, update, delete) for your topic|||Một tệp truy vấn có ít nhất 8 thao tác đặt tên (tìm, lọc, cập nhật, xoá) cho đề tài',
      'At least one atomic update that must not race (stock, seat, counter) written as a single conditional updateOne|||Ít nhất một cập nhật nguyên tử không được đua nhau (tồn kho, ghế, bộ đếm) viết bằng một updateOne có điều kiện',
      'One array update with $push/$pull or arrayFilters|||Một cập nhật mảng bằng $push/$pull hoặc arrayFilters',
      'A list endpoint query with keyset pagination (no skip)|||Truy vấn cho một danh sách phân trang keyset (không dùng skip)',
    ],
    nangCao: ['Vietnamese collation for sorting names|||Collation tiếng Việt khi sắp xếp tên'],
    datKhi: [
      'Running the script prints the real result of every operation|||Chạy kịch bản in ra kết quả thật của từng thao tác',
      'The README explains why the atomic update cannot oversell, in two sentences|||README giải thích trong hai câu vì sao cập nhật nguyên tử không thể bán vượt',
    ],
    goiY: [
      'Put the condition in the filter: { _id, stock: { $gte: qty } } then check modifiedCount|||Đặt điều kiện vào bộ lọc: { _id, stock: { $gte: qty } } rồi kiểm modifiedCount',
      'Keyset: sort by (createdAt, _id) and pass the last pair as the cursor|||Keyset: sắp theo (createdAt, _id) và truyền cặp cuối cùng làm con trỏ',
      'Name operations after user stories ("customer sees my orders") not after methods|||Đặt tên thao tác theo user story ("khách xem đơn của tôi") chứ không theo tên hàm',
    ],
    bangChung: ['Repository link|||Link repo', 'Pasted output of the queries script|||Output dán của kịch bản truy vấn'],
    nop: ['repo'],
  },
  {
    so: 3, chuong: 3, slug: 'mgo-moc-3', sauChuong: 'Chapter 3|||Chương 3',
    ten: 'Schema design document|||Tài liệu thiết kế schema',
    lead: 'Write the design a senior would ask to see: the queries, the shape that serves them, and every embed/reference decision with its reason.|||Viết bản thiết kế mà một người có kinh nghiệm sẽ đòi xem: các truy vấn, hình dạng phục vụ chúng, và mọi quyết định nhúng/tham chiếu kèm lý do.',
    yeuCau: [
      'A table of your top queries with expected frequency (per second/day)|||Bảng các truy vấn chính kèm tần suất dự kiến (mỗi giây/ngày)',
      'For every relationship: embed or reference, cardinality, and why|||Với mọi quan hệ: nhúng hay tham chiếu, số lượng, và vì sao',
      'At least two named patterns applied (subset, extended reference, bucket, computed, polymorphic…)|||Áp dụng ít nhất hai pattern có tên (subset, extended reference, bucket, computed, polymorphic…)',
      'Every array has a stated upper bound; the one that could grow forever is redesigned|||Mọi mảng có giới hạn trên ghi rõ; mảng có thể phình mãi được thiết kế lại',
    ],
    nangCao: ['Measure document size with Object.bsonsize-equivalent ($bsonSize) for your largest document|||Đo cỡ tài liệu lớn nhất bằng $bsonSize'],
    datKhi: [
      'Someone who has not seen your project can answer "where does X live and why" from the document|||Người chưa xem dự án trả lời được "X nằm ở đâu và vì sao" chỉ từ tài liệu',
      'The seed and queries from milestones 1–2 are updated to the new design and still run|||Bộ nạp và truy vấn của mốc 1–2 đã cập nhật theo thiết kế mới và vẫn chạy',
    ],
    goiY: [
      'Data read together is stored together; data shared by many is referenced|||Đọc cùng nhau thì cất cùng nhau; dùng chung bởi nhiều nơi thì tham chiếu',
      'Ask "how many?" for each relationship: few, many, or squillions|||Với mỗi quan hệ hỏi "bao nhiêu?": vài, nhiều, hay vô số',
      'A copied field (extended reference) needs a written rule for when it is refreshed|||Một trường chép (extended reference) cần luật ghi rõ khi nào được làm mới',
    ],
    bangChung: ['Link to the design document in the repository|||Link tới tài liệu thiết kế trong repo'],
    nop: ['repo'],
  },
  {
    so: 4, chuong: 4, slug: 'mgo-moc-4', sauChuong: 'Chapter 4|||Chương 4',
    ten: 'Indexes with explain proof|||Index có bằng chứng explain',
    lead: 'Make your five most important queries use the right index — and prove it with numbers, not with "it feels faster".|||Cho năm truy vấn quan trọng nhất dùng đúng index — và chứng minh bằng số, không phải "cảm giác nhanh hơn".',
    yeuCau: [
      'At least 100,000 documents in the main collection (generated)|||Ít nhất 100.000 tài liệu trong collection chính (sinh tự động)',
      'For 5 queries: explain("executionStats") before and after, with keys examined, docs examined, returned, time|||Với 5 truy vấn: explain("executionStats") trước và sau, có số khoá duyệt, tài liệu duyệt, trả về, thời gian',
      'At least one compound index designed with the ESR rule, explained in the README|||Ít nhất một index phức hợp thiết kế theo luật ESR, giải thích trong README',
      'An index creation script that is safe to run twice|||Kịch bản tạo index chạy hai lần vẫn an toàn',
    ],
    nangCao: ['One covered query (no FETCH stage)|||Một truy vấn được phủ (không có stage FETCH)', 'Measure insert speed with and without your indexes|||Đo tốc độ chèn khi có và không có các index'],
    datKhi: [
      'Every one of the 5 queries shows IXSCAN and docsExamined close to nReturned|||Cả 5 truy vấn đều hiện IXSCAN và docsExamined gần bằng nReturned',
      'No index exists that no query uses|||Không có index nào mà không truy vấn nào dùng',
    ],
    goiY: [
      'Equality fields first, then the sort field, then range fields|||Trường bằng trước, rồi trường sắp xếp, rồi trường khoảng',
      'Look for SORT stage in the plan: it means sorting in memory|||Tìm stage SORT trong kế hoạch: nghĩa là đang sắp xếp trong bộ nhớ',
      '$indexStats shows which indexes are actually used|||$indexStats cho biết index nào thật sự được dùng',
    ],
    bangChung: ['Repository link with an explain table in the README|||Link repo có bảng explain trong README'],
    nop: ['repo'],
  },
  {
    so: 5, chuong: 5, slug: 'mgo-moc-5', sauChuong: 'Chapter 5|||Chương 5',
    ten: 'Three reports as aggregation pipelines|||Ba báo cáo bằng aggregation pipeline',
    lead: 'Answer three real business questions inside the database, with pipelines that use indexes and stay under the memory limit.|||Trả lời ba câu hỏi kinh doanh thật ngay trong cơ sở dữ liệu, bằng pipeline dùng được index và không vượt giới hạn bộ nhớ.',
    yeuCau: [
      'Three pipelines answering questions a manager of your product would ask|||Ba pipeline trả lời câu hỏi mà người quản lý sản phẩm của bạn sẽ hỏi',
      'At least one uses $lookup, one uses dates grouped in the Asia/Ho_Chi_Minh time zone|||Ít nhất một cái dùng $lookup, một cái gom theo ngày ở múi giờ Asia/Ho_Chi_Minh',
      'Each pipeline starts with $match that can use an index (shown by explain)|||Mỗi pipeline bắt đầu bằng $match dùng được index (explain chứng minh)',
    ],
    nangCao: ['$setWindowFields for a running total or ranking|||$setWindowFields cho luỹ kế hoặc xếp hạng', 'A nightly $merge into a summary collection|||$merge hằng đêm vào một collection tổng hợp'],
    datKhi: [
      'Each report output is pasted in the README and checked by hand on a small sample|||Output mỗi báo cáo dán trong README và được kiểm tay trên một mẫu nhỏ',
    ],
    goiY: [
      'Write the expected result for 5 documents first, then the pipeline|||Viết kết quả mong đợi cho 5 tài liệu trước, rồi mới viết pipeline',
      'Run the pipeline stage by stage, adding one stage at a time|||Chạy pipeline từng stage, mỗi lần thêm một stage',
      'Dates are stored in UTC — group with timezone, or reports at midnight are wrong|||Ngày lưu theo UTC — gom có timezone, kẻo báo cáo quanh nửa đêm sai',
    ],
    bangChung: ['Repository link|||Link repo', 'Pasted report outputs|||Output báo cáo dán vào'],
    nop: ['repo'],
  },
  {
    so: 6, chuong: 6, slug: 'mgo-moc-6', sauChuong: 'Chapter 6|||Chương 6',
    ten: 'The critical operation, correct under concurrency|||Thao tác then chốt, đúng khi đồng thời',
    lead: 'Find the one operation in your topic where two users racing would cause damage, make it correct, and prove it with a concurrent test.|||Tìm thao tác duy nhất trong đề tài mà hai người đua nhau sẽ gây hại, làm nó đúng, và chứng minh bằng một bài thử đồng thời.',
    yeuCau: [
      'Name the critical operation and the invariant ("stock never below 0", "a seat sold once")|||Gọi tên thao tác then chốt và bất biến ("tồn kho không bao giờ dưới 0", "một ghế chỉ bán một lần")',
      'Implement it with a conditional single-document update, or a transaction when several documents must change|||Cài bằng cập nhật có điều kiện trên một tài liệu, hoặc transaction khi nhiều tài liệu phải đổi cùng lúc',
      'A test firing at least 100 concurrent requests, then checking the invariant|||Một bài thử bắn ít nhất 100 yêu cầu đồng thời, rồi kiểm bất biến',
      'Writes that matter use writeConcern majority|||Các lần ghi quan trọng dùng writeConcern majority',
    ],
    nangCao: ['Show the broken version first (read-then-write) and the number of oversells it produced|||Cho thấy bản hỏng trước (đọc rồi mới ghi) và số lần bán vượt nó gây ra'],
    datKhi: [
      'The concurrent test passes 5 runs in a row with the invariant intact|||Bài thử đồng thời qua 5 lần liên tiếp, bất biến còn nguyên',
      'The README says why a transaction was or was not needed|||README nói vì sao cần hoặc không cần transaction',
    ],
    goiY: [
      'If everything that changes is in one document, you do not need a transaction|||Nếu mọi thứ thay đổi nằm trong một tài liệu, bạn không cần transaction',
      'withTransaction retries TransientTransactionError for you|||withTransaction tự thử lại TransientTransactionError cho bạn',
      'Keep transactions short: no network calls inside|||Giữ transaction ngắn: không gọi mạng bên trong',
    ],
    bangChung: ['Repository link|||Link repo', 'Output of 5 test runs|||Output của 5 lần chạy thử'],
    nop: ['repo'],
  },
  {
    so: 7, chuong: 7, slug: 'mgo-moc-7', sauChuong: 'Chapter 7|||Chương 7',
    ten: 'Three nodes and a failover drill|||Ba máy và buổi diễn tập chuyển dự phòng',
    lead: 'Run your project on a three-member replica set and show that killing the primary costs seconds, not data.|||Chạy dự án trên replica set ba thành viên và cho thấy giết primary chỉ tốn vài giây, không tốn dữ liệu.',
    yeuCau: [
      'compose file with a three-member replica set; the app connects without directConnection|||Tệp compose có replica set ba thành viên; ứng dụng kết nối không dùng directConnection',
      'A drill script: write continuously, kill the primary, measure the gap, count lost writes|||Kịch bản diễn tập: ghi liên tục, giết primary, đo khoảng gián đoạn, đếm số lần ghi mất',
      'A one-page shard key proposal for 100× your data, with the queries it targets|||Đề xuất shard key một trang cho dữ liệu gấp 100 lần, kèm các truy vấn nó nhắm tới',
    ],
    nangCao: ['A delayed hidden member and a recovery of an accidental delete from it|||Một thành viên ẩn trễ giờ và khôi phục một lần xoá nhầm từ nó'],
    datKhi: [
      'Zero acknowledged writes lost with w:"majority" in the drill|||Không mất lần ghi nào đã được xác nhận với w:"majority" trong buổi diễn tập',
      'The measured failover time is in the README|||Thời gian chuyển dự phòng đo được có trong README',
    ],
    goiY: [
      'Retryable writes are on by default in modern drivers — check your connection string|||Retryable writes mặc định bật ở driver mới — kiểm chuỗi kết nối của bạn',
      'Give members hostnames that resolve both inside Docker and from the host|||Đặt tên máy cho thành viên phân giải được cả trong Docker lẫn từ máy thật',
    ],
    bangChung: ['Repository link|||Link repo', 'Drill output|||Output buổi diễn tập'],
    nop: ['repo', 'demo'],
  },
  {
    so: 8, chuong: 8, slug: 'mgo-moc-8', sauChuong: 'Chapter 8|||Chương 8',
    ten: 'The API on top of your data layer|||API trên tầng dữ liệu của bạn',
    lead: 'Expose your operations through a real API in Express + Mongoose (or the driver) or Spring Boot + Spring Data, without the classic ORM traps.|||Đưa các thao tác ra một API thật bằng Express + Mongoose (hoặc driver) hoặc Spring Boot + Spring Data, không dính các bẫy ORM kinh điển.',
    yeuCau: [
      'At least 6 endpoints covering your main user stories|||Ít nhất 6 endpoint phủ các user story chính',
      'One MongoClient/connection for the whole app, pool size chosen on purpose|||Một MongoClient/kết nối cho cả ứng dụng, cỡ pool chọn có chủ đích',
      'No N+1: a list endpoint makes a constant number of queries (show the log)|||Không N+1: endpoint danh sách chạy số truy vấn cố định (cho xem log)',
      'Duplicate key errors become HTTP 409, validation errors 400|||Lỗi trùng khoá thành HTTP 409, lỗi kiểm hợp lệ thành 400',
      'Integration tests against a real MongoDB container|||Test tích hợp chạy trên container MongoDB thật',
    ],
    nangCao: ['The same API in the other stack, passing the same HTTP test suite|||Cùng API ở nền tảng còn lại, qua cùng bộ test HTTP'],
    datKhi: ['The test suite passes from a clean clone with one command|||Bộ test qua từ một bản clone sạch bằng một lệnh'],
    goiY: [
      'Use lean() for read-only lists in Mongoose|||Dùng lean() cho danh sách chỉ đọc trong Mongoose',
      'Turn on query logging once and count the queries per request|||Bật log truy vấn một lần và đếm số truy vấn mỗi request',
    ],
    bangChung: ['Repository link|||Link repo', 'Test output|||Output chạy test'],
    nop: ['repo', 'demo'],
  },
  {
    so: 9, chuong: 9, slug: 'mgo-moc-9', sauChuong: 'Chapter 9|||Chương 9',
    ten: 'Lock it down|||Khoá chặt nó lại',
    lead: 'Attack your own project the way Chapter 9 attacked the lab, then close every hole and keep the attacks as tests.|||Tấn công chính dự án của bạn như Chương 9 tấn công lab, rồi bịt mọi lỗ và giữ các đòn tấn công thành test.',
    yeuCau: [
      'Authentication on; the app uses its own user with only the roles it needs (no root)|||Bật xác thực; ứng dụng dùng tài khoản riêng chỉ có các vai trò cần thiết (không root)',
      'Tests that send operator-injection payloads ({"$ne": null}, {"$gt": ""}) to every input and expect rejection|||Test gửi payload chèn toán tử ({"$ne": null}, {"$gt": ""}) vào mọi đầu vào và mong bị từ chối',
      'No secrets in the repository history (checked with a scanner)|||Không có bí mật nào trong lịch sử repo (kiểm bằng công cụ quét)',
      'A security checklist in the README with each item marked done|||Danh sách kiểm bảo mật trong README, từng mục đánh dấu xong',
    ],
    nangCao: ['TLS between the app and MongoDB in compose|||TLS giữa ứng dụng và MongoDB trong compose', 'Client-side field level encryption for one sensitive field|||Mã hoá phía client cho một trường nhạy cảm'],
    datKhi: ['Every injection test fails to change behaviour; the app user cannot drop a collection|||Mọi test chèn đều không đổi được hành vi; tài khoản ứng dụng không xoá được collection'],
    goiY: [
      'Validate types at the boundary: a string field must be a string|||Kiểm kiểu ở biên: trường chuỗi phải là chuỗi',
      'Mongoose: set sanitizeFilter; Spring: never build queries from raw JSON strings|||Mongoose: bật sanitizeFilter; Spring: không dựng truy vấn từ chuỗi JSON thô',
    ],
    bangChung: ['Repository link|||Link repo', 'Output of the injection tests|||Output của các test chèn'],
    nop: ['repo'],
  },
  {
    so: 10, chuong: 10, slug: 'mgo-moc-10', sauChuong: 'Chapter 10|||Chương 10',
    ten: 'Backups, a restore drill and a load test|||Sao lưu, diễn tập khôi phục và đo tải',
    lead: 'Prove you can get the data back and know where the system breaks — the two questions every operations review asks.|||Chứng minh bạn lấy lại được dữ liệu và biết hệ thống gãy ở đâu — hai câu hỏi mọi buổi rà soát vận hành đều hỏi.',
    yeuCau: [
      'A backup script (mongodump with --oplog or equivalent) and a written retention policy|||Kịch bản sao lưu (mongodump có --oplog hoặc tương đương) và chính sách giữ bản sao lưu viết ra',
      'A restore drill into a fresh container, with the time it took and a data check|||Buổi diễn tập khôi phục vào container mới, có thời gian thực hiện và bước kiểm dữ liệu',
      'A load test of your two hottest endpoints with p50/p95/p99 at increasing load|||Đo tải hai endpoint nóng nhất với p50/p95/p99 khi tăng dần tải',
      'A short postmortem-style note: where it broke and what you would change|||Một ghi chú ngắn kiểu postmortem: gãy ở đâu và bạn sẽ đổi gì',
    ],
    nangCao: ['Point-in-time restore to just before an accidental delete|||Khôi phục tới đúng trước một lần xoá nhầm', 'A change stream feature (live notifications)|||Một tính năng dùng change stream (thông báo trực tiếp)'],
    datKhi: ['Someone else can restore your backup by following the README alone|||Người khác khôi phục được bản sao lưu chỉ bằng cách làm theo README'],
    goiY: [
      'A backup that was never restored is not a backup|||Bản sao lưu chưa từng khôi phục thử thì chưa phải bản sao lưu',
      'Increase load in steps and watch where p99 jumps, not where the average moves|||Tăng tải theo bậc và nhìn chỗ p99 nhảy vọt, không phải chỗ trung bình nhích',
    ],
    bangChung: ['Repository link|||Link repo', 'Restore and load test outputs|||Output khôi phục và đo tải'],
    nop: ['repo', 'demo'],
  },
];

const BAO_VE = {
  rubric: [
    { tieuChi: 'Schema design from queries|||Thiết kế schema từ truy vấn', diem: 2, moTa: 'Every embed/reference decision is justified by access patterns and bounded growth|||Mọi quyết định nhúng/tham chiếu có lý do từ cách truy cập và giới hạn tăng trưởng' },
    { tieuChi: 'Indexes and performance evidence|||Index và bằng chứng hiệu năng', diem: 2, moTa: 'explain before/after, ESR reasoning, load test numbers|||explain trước/sau, lập luận ESR, số đo tải' },
    { tieuChi: 'Correctness under concurrency|||Đúng khi đồng thời', diem: 1.5, moTa: 'Invariant named, implementation right, concurrent test passes|||Bất biến được gọi tên, cài đúng, bài thử đồng thời qua' },
    { tieuChi: 'Reports with aggregation|||Báo cáo bằng aggregation', diem: 1, moTa: 'Correct results, time zone handled, index used by the first stage|||Kết quả đúng, xử lý múi giờ, stage đầu dùng index' },
    { tieuChi: 'Availability and recovery|||Sẵn sàng và khôi phục', diem: 1.5, moTa: 'Replica set drill without lost acknowledged writes; restore drill documented|||Diễn tập replica set không mất lần ghi đã xác nhận; diễn tập khôi phục có tài liệu' },
    { tieuChi: 'Security|||Bảo mật', diem: 1, moTa: 'Auth, least privilege, injection tests, no secrets in history|||Xác thực, quyền tối thiểu, test chèn, không bí mật trong lịch sử' },
    { tieuChi: 'Explaining and defending|||Giải thích và bảo vệ', diem: 1, moTa: 'Clear answers with the code open, honest about trade-offs and limits|||Trả lời rõ khi mở mã, trung thực về đánh đổi và giới hạn' },
  ],
  cauHoiMau: [
    'Why MongoDB for this project and not PostgreSQL? What would be easier in PostgreSQL?|||Vì sao dự án này dùng MongoDB mà không phải PostgreSQL? Điều gì sẽ dễ hơn ở PostgreSQL?',
    'Show me your largest document. How big can it get in a year?|||Cho tôi xem tài liệu lớn nhất. Một năm nữa nó lớn tới đâu?',
    'Which array in your schema could grow without limit, and what did you do about it?|||Mảng nào trong schema có thể phình không giới hạn, và bạn đã xử lý ra sao?',
    'You copied a field into another collection. What happens when the original changes?|||Bạn chép một trường sang collection khác. Bản gốc đổi thì sao?',
    'Open the explain output of your slowest query. Read me the three numbers that matter.|||Mở explain của truy vấn chậm nhất. Đọc cho tôi ba con số quan trọng.',
    'Why is this compound index in this order? What breaks if I swap the fields?|||Vì sao index phức hợp này xếp theo thứ tự này? Đổi chỗ hai trường thì hỏng gì?',
    'Which index would you drop first if writes became too slow?|||Nếu ghi quá chậm, bạn bỏ index nào trước?',
    'Two users click buy on the last item at the same millisecond. Walk me through what happens.|||Hai người bấm mua món cuối cùng cùng một phần nghìn giây. Kể từng bước chuyện gì xảy ra.',
    'Did you need a transaction? Why, or why not?|||Bạn có cần transaction không? Vì sao có hoặc vì sao không?',
    'What does w:"majority" protect you from? What does it cost?|||w:"majority" bảo vệ bạn khỏi điều gì? Nó tốn gì?',
    'The primary just died. What does your API return during those seconds?|||Primary vừa chết. Trong mấy giây đó API của bạn trả về gì?',
    'Propose a shard key for 100 times your data. Which query becomes scatter-gather?|||Đề xuất shard key cho dữ liệu gấp 100 lần. Truy vấn nào thành phát tán?',
    'Send {"$ne": null} as the password to your login. What happens and why?|||Gửi {"$ne": null} làm mật khẩu cho trang đăng nhập. Chuyện gì xảy ra và vì sao?',
    'Which MongoDB roles does your application user have? Why not readWriteAnyDatabase?|||Tài khoản ứng dụng có những vai trò MongoDB nào? Sao không dùng readWriteAnyDatabase?',
    'Someone deleted half the orders at 14:03. Restore them without losing the orders placed at 14:10.|||Có người xoá nửa số đơn lúc 14:03. Khôi phục chúng mà không mất các đơn đặt lúc 14:10.',
    'Where does p99 jump in your load test, and what is the bottleneck there?|||Trong bài đo tải, p99 nhảy vọt ở đâu, và nút thắt ở đó là gì?',
    'How many queries does your list endpoint run? Prove it.|||Endpoint danh sách của bạn chạy bao nhiêu truy vấn? Chứng minh đi.',
    'If the product owner adds a new field tomorrow, what do you change, and what happens to old documents?|||Nếu ngày mai chủ sản phẩm thêm một trường mới, bạn sửa gì, và tài liệu cũ thì sao?',
  ],
  chuanBi: [
    'A fresh clone starts with docker compose up and one seed command; README lists every command|||Một bản clone sạch chạy được bằng docker compose up và một lệnh nạp; README liệt kê mọi lệnh',
    'The design document, explain table, drill outputs and load test chart are linked from the README|||Tài liệu thiết kế, bảng explain, output diễn tập và biểu đồ đo tải đều có link từ README',
    'You can open, without searching: the validator, the index script, the critical operation, one pipeline, the backup script|||Bạn mở được ngay không cần tìm: validator, kịch bản index, thao tác then chốt, một pipeline, kịch bản sao lưu',
    'Two terminals ready: mongosh on the replica set, and the concurrent test|||Sẵn hai terminal: mongosh nối replica set, và bài thử đồng thời',
    'No real personal data and no real passwords anywhere in the demo|||Không có dữ liệu cá nhân thật hay mật khẩu thật ở bất kỳ đâu trong buổi demo',
  ],
};

export const DU_AN = {
  version: 1,
  gioiThieu: GIOI_THIEU,
  deTai: DE_TAI,
  tuChon: {
    yeuCauToiThieu: [
      'At least 3 collections with a real relationship decision (embed vs reference) to defend|||Ít nhất 3 collection có một quyết định quan hệ thật (nhúng hay tham chiếu) để bảo vệ',
      'Data whose shape varies, or that is read as a whole aggregate — a reason to choose MongoDB|||Có dữ liệu hình dạng thay đổi, hoặc được đọc trọn một khối — lý do để chọn MongoDB',
      'One scarce resource or counter that concurrent users can fight over|||Một tài nguyên khan hiếm hoặc bộ đếm mà nhiều người dùng đồng thời tranh nhau',
      'At least three reports a manager would ask for|||Ít nhất ba báo cáo mà người quản lý sẽ đòi',
      'Enough generated data (≥ 100,000 documents) to make indexes matter|||Đủ dữ liệu sinh ra (≥ 100.000 tài liệu) để index có ý nghĩa',
      'No real personal, medical or payment data; payments are simulated|||Không dùng dữ liệu cá nhân, y tế hay thanh toán thật; thanh toán là giả lập',
    ],
    goiYQuyMo: 'Aim for 3–6 collections, 6–10 user stories, one critical concurrent operation and three reports — about 50–80 hours across the course. Too small: one collection of notes with no relationships and no concurrency. Too big: a social network, microservices, real-time chat or AI features — keep a core you can finish and defend, list the rest as future work.|||Nhắm tới 3–6 collection, 6–10 user story, một thao tác đồng thời then chốt và ba báo cáo — khoảng 50–80 giờ rải theo khoá. Quá nhỏ: một collection ghi chú không quan hệ, không đồng thời. Quá to: mạng xã hội, microservice, chat thời gian thực hay tính năng AI — giữ phần lõi làm xong và bảo vệ được, phần còn lại ghi "hướng phát triển".',
  },
  moc: MOC.map(({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop }) => ({ so, slug, ten, sauChuong, yeuCau, nangCao, datKhi, goiY, nop })),
  baoVe: BAO_VE,
};
export default DU_AN;

/** Chỉ số section (0 = Mục 0) ⇒ số mốc, để mongodb.mjs chèn đúng bài. */
export const MOC_THEO_CHUONG = Object.fromEntries(MOC.map((m) => [m.chuong, m.so]));

/* ───────────────────── Dựng bài mốc & bài bảo vệ ───────────────────── */
const tach = (s, i) => { const p = String(s).split('|||'); return (p[i] ?? p[0]).trim(); };
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const li = (arr, i) => arr.map((x) => '<li>' + esc(tach(x, i)) + '</li>').join('');

const NHAN = [
  {
    eyebrow: (m) => 'Course project · Milestone ' + m.so + ' of ' + MOC.length + ' · after ' + tach(m.sauChuong, 0),
    topic: 'This milestone applies to the topic you registered at the start of the course (Start here 2/2). The table says what it means for each suggested topic; a self-chosen topic follows the same requirements — if one makes no sense for your topic, write in the README which feature practises that skill instead.',
    req: '✅ Required', stretch: '⭐ Stretch (optional)', map: '🧭 What this milestone means for each topic', th: ['Topic', 'What you build now'],
    hints: '💡 Hints — open one layer at a time', hintNote: 'Try the task first. Read hint 1 only when stuck, then hint 2, then hint 3.',
    done: '🎯 Done when', submit: '📤 What to submit',
    submitNote: 'Paste the links and notes into the submission box below this lesson, then mark the milestone as done. The defence committee will open exactly these links.',
  },
  {
    eyebrow: (m) => 'Dự án cuối khoá · Mốc ' + m.so + '/' + MOC.length + ' · sau ' + tach(m.sauChuong, 1),
    topic: 'Mốc này áp vào đề tài bạn đã đăng ký đầu khoá (Bắt đầu tại đây 2/2). Bảng cho biết với từng đề tài gợi ý thì mốc này nghĩa là gì; đề tài tự chọn làm theo đúng các yêu cầu chung — yêu cầu nào không hợp với đề tài thì ghi trong README tính năng nào luyện kỹ năng đó thay thế.',
    req: '✅ Yêu cầu bắt buộc', stretch: '⭐ Nâng cao (tuỳ chọn)', map: '🧭 Mốc này nghĩa là gì với từng đề tài', th: ['Đề tài', 'Phần bạn làm ở mốc này'],
    hints: '💡 Gợi ý — mở từng tầng một', hintNote: 'Tự làm trước. Kẹt mới đọc gợi ý 1, rồi gợi ý 2, rồi gợi ý 3.',
    done: '🎯 Đạt khi', submit: '📤 Nộp gì',
    submitNote: 'Dán link và ghi chú vào khung nộp bài bên dưới bài này, rồi đánh dấu mốc đã xong. Hội đồng bảo vệ sẽ mở đúng những link này.',
  },
];

export function baiMoc(so) {
  const m = MOC.find((x) => x.so === so);
  if (!m) throw new Error('mongodb _du-an: không có mốc ' + so);
  const khoi = (i) => {
    const N = NHAN[i];
    const ban = DE_TAI.map((d) => {
      const b = d.banDoChuong.find((x) => x.moc === so);
      return '<tr><td>' + esc(tach(d.ten, i)) + '</td><td>' + esc(b ? tach(b.dung, i) : '—') + '</td></tr>';
    }).join('');
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + esc(N.eyebrow(m)) + '</span>',
      '<h2>' + esc(tach(m.ten, i)) + '</h2>',
      '<p class="lead">' + esc(tach(m.lead, i)) + '</p>',
      '<p>' + N.topic + '</p>',
      '<h3>' + N.req + '</h3>', '<ol>' + li(m.yeuCau, i) + '</ol>',
      '<h3>' + N.stretch + '</h3>', '<ul>' + li(m.nangCao, i) + '</ul>',
      '<h3>' + N.map + '</h3>',
      '<table><thead><tr><th>' + N.th[0] + '</th><th>' + N.th[1] + '</th></tr></thead><tbody>' + ban + '</tbody></table>',
      '<h3>' + N.hints + '</h3>',
      '<div class="callout warn"><ol>' + li(m.goiY, i) + '</ol><p>' + N.hintNote + '</p></div>',
      '<h3>' + N.done + '</h3>', '<div class="callout ok"><ul>' + li(m.datKhi, i) + '</ul></div>',
      '<h3>' + N.submit + '</h3>', '<ul>' + li(m.bangChung, i) + '</ul>', '<p>' + N.submitNote + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🛠 Project milestone ' + so + ' — ' + tach(m.ten, 0) + '|||🛠 Mốc dự án ' + so + ' — ' + tach(m.ten, 1),
    slug: m.slug,
    type: 'EXERCISE',
    mocDuAn: so,
    isFreePreview: true,
    description: 'Mốc dự án ' + so + '/' + MOC.length + ' (sau ' + tach(m.sauChuong, 1) + '): ' + tach(m.ten, 1) + ' — yêu cầu, bảng theo đề tài, gợi ý theo tầng, đạt khi, nộp gì.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}

export function baiBaoVe() {
  const tong = BAO_VE.rubric.reduce((a, r) => a + r.diem, 0);
  const khoi = (i) => {
    const so = (x) => (i === 0 ? String(x) : String(x).replace('.', ','));
    const rub = BAO_VE.rubric.map((r) => '<tr><td>' + esc(tach(r.tieuChi, i)) + '</td><td>' + so(r.diem) + '</td><td>' + esc(tach(r.moTa, i)) + '</td></tr>').join('');
    const t = i === 0
      ? { eb: 'Course project · Finish & defend', h2: 'Finish your MongoDB project and defend it', lead: 'Ten milestones turned the topic you registered into a data layer with a defended schema, measured indexes, correct concurrency, a replica set that survives failure, security and tested backups. Now hand in something that runs, then explain it. The AI defence room below plays the committee: it reads what you submit and asks follow-up questions until it is sure you built and understand the project.', c: '☑️ Before the defence — checklist', r: '🧮 Rubric (' + tong + ' points)', th: '<tr><th>Criterion</th><th>Points</th><th>What earns the points</th></tr>', q: '🎤 Questions committees really ask', qn: 'Practise answering out loud with mongosh and the code open. A good answer has three parts: what it does, why you chose it, and what you would change if the requirement changed. Expect at least one live demonstration: an explain, the concurrent test, killing the primary.', f: 'When you are ready, open the defence room below. It asks one question at a time, scores you on the rubric and writes feedback; fix what it finds and you may defend again.' }
      : { eb: 'Dự án cuối khoá · Hoàn thiện & bảo vệ', h2: 'Hoàn thiện dự án MongoDB và bảo vệ nó', lead: 'Mười mốc đã biến đề tài bạn đăng ký thành một tầng dữ liệu có schema bảo vệ được, index có số đo, đồng thời chạy đúng, replica set sống sót khi hỏng máy, có bảo mật và bản sao lưu đã khôi phục thử. Giờ bạn nộp thứ chạy được, rồi giải thích nó. Phòng bảo vệ AI bên dưới đóng vai hội đồng: nó đọc thứ bạn nộp và hỏi vặn tới khi chắc rằng bạn tự làm và hiểu dự án.', c: '☑️ Trước buổi bảo vệ — checklist', r: '🧮 Rubric (' + tong + ' điểm)', th: '<tr><th>Tiêu chí</th><th>Điểm</th><th>Thế nào thì được điểm</th></tr>', q: '🎤 Những câu hội đồng hay hỏi thật', qn: 'Tập trả lời thành tiếng, mở sẵn mongosh và mã nguồn. Câu trả lời tốt có ba phần: nó làm gì, vì sao bạn chọn cách đó, và nếu yêu cầu đổi thì bạn sửa gì. Chuẩn bị ít nhất một màn chứng minh trực tiếp: một explain, bài thử đồng thời, giết primary.', f: 'Khi đã sẵn sàng, mở phòng bảo vệ bên dưới. Nó hỏi từng câu một, chấm theo rubric và viết nhận xét; sửa xong những gì nó chỉ ra thì được bảo vệ lại.' };
    return [
      '<div class="' + (i === 0 ? 'ml-en' : 'ml-vi') + '">',
      '<span class="eyebrow">' + t.eb + '</span>', '<h2>' + t.h2 + '</h2>', '<p class="lead">' + t.lead + '</p>',
      '<h3>' + t.c + '</h3>', '<div class="callout ok"><ul>' + li(BAO_VE.chuanBi, i) + '</ul></div>',
      '<h3>' + t.r + '</h3>',
      '<table><thead>' + t.th + '</thead><tbody>' + rub + '<tr><td><strong>' + (i === 0 ? 'Total' : 'Tổng') + '</strong></td><td><strong>' + so(tong) + '</strong></td><td></td></tr></tbody></table>',
      '<h3>' + t.q + '</h3>', '<p>' + t.qn + '</p>', '<ol>' + li(BAO_VE.cauHoiMau, i) + '</ol>',
      '<p class="note-ct">' + t.f + '</p>',
      '</div>',
    ].join('\n');
  };
  return {
    title: '🎓 Finish & defend your course project|||🎓 Hoàn thiện & bảo vệ dự án cuối khoá',
    slug: 'mgo-bao-ve-du-an',
    type: 'EXERCISE',
    baoVeDuAn: true,
    isFreePreview: true,
    description: 'Bài cuối khoá: checklist hoàn thiện dự án MongoDB, rubric 10 điểm, ' + BAO_VE.cauHoiMau.length + ' câu hội đồng hay hỏi, và phòng bảo vệ AI.',
    content: '\n' + khoi(0) + '\n' + khoi(1) + '\n',
  };
}
