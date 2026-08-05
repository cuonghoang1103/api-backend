import type { Chapter } from './types';

/**
 * Chương 0 — viết cho người CHƯA từng động vào database.
 *
 * Nguyên tắc khi soạn: không dùng một thuật ngữ nào trước khi đã giải thích nó
 * bằng thứ người đọc chắc chắn đã biết (Excel, thư mục, danh bạ). Hai widget
 * đặt cuối chương là để trả lời câu hỏi tự nhiên nảy ra sau khi hiểu bảng là
 * gì: "một triệu dòng thì nó tìm kiểu gì mà nhanh thế?".
 */
export const CH00: Chapter = {
  no: 0,
  slug: 'database-la-gi',
  title: 'Database là gì, SQL là gì',
  icon: '🗄️',
  tagline: 'Từ file Excel tới database — và vì sao lập trình web bắt buộc phải đổi',
  minutes: 35,
  goals: [
    'Giải thích được database khác file Excel/JSON ở chỗ nào, bằng lời của mình',
    'Gọi đúng tên: bảng, dòng, cột, khoá chính, kiểu dữ liệu',
    'Hiểu quan hệ client–server: câu SQL bạn gõ chạy ở đâu',
    'Viết và đọc hiểu câu SELECT đầu tiên',
    'Biết vì sao PostgreSQL tìm 1 dòng trong 1 triệu dòng chỉ mất vài mili-giây',
  ],
  labModuleId: 858,
  labModuleName: 'Getting Started with PostgreSQL',
  labCount: 10,
  labPicks: [
    { slug: 'your-first-query-select-every-column', title: 'Your First Query: Select Every Column', vi: 'Câu truy vấn đầu tiên: lấy mọi cột' },
    { slug: 'choose-specific-columns', title: 'Choose Specific Columns', vi: 'Chỉ lấy vài cột' },
    { slug: 'rename-output-columns-with-aliases', title: 'Rename Output Columns with Aliases', vi: 'Đổi tên cột kết quả bằng alias' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Giả sử bạn quản lý một cửa hàng nhỏ. Ban đầu bạn ghi hàng hoá vào một file Excel: '
        + 'mỗi hàng là một sản phẩm, mỗi cột là một thông tin (tên, giá, số lượng còn). '
        + 'Cách này chạy tốt. Cho tới lúc nó không chạy nữa.',
    },
    {
      kind: 'h',
      text: 'Vì sao file Excel không đủ cho một website',
    },
    {
      kind: 'p',
      text:
        'Không phải vì Excel dở. Mà vì một website đặt ra bốn yêu cầu mà file thường không đáp ứng nổi:',
    },
    {
      kind: 'list',
      ordered: true,
      items: [
        '**Nhiều người dùng cùng lúc.** Hai khách bấm mua món hàng cuối cùng trong cùng một giây. File Excel mở bằng hai cửa sổ sẽ ghi đè lẫn nhau, một trong hai đơn hàng biến mất không dấu vết.',
        '**Tìm nhanh trong lượng dữ liệu lớn.** Tìm một email trong 20 dòng thì mắt người còn làm được. Tìm trong 2 triệu dòng, mỗi lần có người mở trang, thì cần một cấu trúc dữ liệu chuyên dụng.',
        '**Không được sai nửa chừng.** Chuyển tiền là trừ ví A rồi cộng ví B. Nếu mất điện đúng giữa hai bước, tiền bốc hơi. Database có cơ chế bảo đảm "làm cả hai hoặc không làm gì cả".',
        '**Ràng buộc phải được canh tự động.** Không cho phép hai tài khoản trùng email, không cho phép đơn hàng trỏ tới khách đã bị xoá. Nếu để tầng ứng dụng tự nhớ kiểm tra thì sớm muộn cũng quên một chỗ.',
      ],
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Định nghĩa gọn nhất',
      text:
        'Database (cơ sở dữ liệu) là một chương trình chạy nền, giữ dữ liệu của bạn trên đĩa, '
        + 'và trả lời các câu hỏi về dữ liệu đó. Bạn không mở file ra đọc; bạn **hỏi** nó, và nó trả lời.',
    },
    {
      kind: 'h',
      text: 'Bảng, dòng, cột — ba từ phải nhớ',
    },
    {
      kind: 'p',
      text:
        'Tin tốt cho người đến từ Excel: cấu trúc gần như y hệt. Một **bảng** (table) trông đúng như một sheet:',
    },
    {
      kind: 'table',
      caption: 'Bảng products — 4 cột, 5 dòng',
      head: ['id', 'name', 'price', 'stock'],
      rows: [
        ['1', 'Bàn phím cơ', '1200000', '14'],
        ['2', 'Chuột không dây', '350000', '0'],
        ['3', 'Màn hình 27"', '5900000', '3'],
        ['4', 'Tai nghe', '890000', '27'],
        ['5', 'Webcam', '1450000', '8'],
      ],
    },
    {
      kind: 'figure',
      name: 'table-anatomy',
      title: 'Giải phẫu một bảng',
      caption: 'Ba từ này sẽ theo bạn suốt khoá học — bảng, dòng, cột. Cộng thêm khoá chính và kiểu dữ liệu.',
    },
    {
      kind: 'list',
      items: [
        '**Cột** (column) — một loại thông tin. Cột có **kiểu dữ liệu** cố định: `price` chỉ chứa số, không chứa chữ. Đây là khác biệt đầu tiên với Excel, nơi bạn gõ gì vào ô cũng được.',
        '**Dòng** (row) — một sản phẩm cụ thể. Còn gọi là **bản ghi** (record).',
        '**Khoá chính** (primary key) — cột dùng để chỉ đích danh một dòng, ở đây là `id`. Không bao giờ trùng, không bao giờ rỗng.',
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Đừng dùng tên làm khoá chính',
      text:
        'Cám dỗ đầu tiên của người mới là lấy `name` hoặc `email` làm khoá chính vì "nó đã là duy nhất rồi". '
        + 'Đừng. Tên đổi được, email đổi được, và mọi bảng khác đang trỏ tới nó sẽ hỏng theo. '
        + 'Khoá chính nên là một con số vô nghĩa, sinh tự động, không bao giờ đổi.',
    },
    {
      kind: 'h',
      text: 'SQL — ngôn ngữ để hỏi',
    },
    {
      kind: 'p',
      text:
        'SQL (đọc là "ét-cu-eo" hoặc "xi-cùn") là ngôn ngữ bạn dùng để nói chuyện với database. '
        + 'Nó được thiết kế để đọc gần như tiếng Anh. Câu đầu tiên trong đời bạn sẽ viết là thế này:',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Lấy tất cả các cột của mọi dòng trong bảng products',
      code: 'SELECT * FROM products;',
    },
    {
      kind: 'p',
      text:
        'Đọc ngược từ phải sang trái sẽ dễ hiểu hơn: **FROM products** — lấy từ bảng products; '
        + '**SELECT \\*** — lấy tất cả các cột (dấu `*` nghĩa là "mọi cột"); '
        + 'dấu chấm phẩy `;` kết thúc câu lệnh.',
    },
    {
      kind: 'p',
      text: 'Thường thì bạn không cần mọi cột. Liệt kê đúng cột cần:',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: 'SELECT name, price\nFROM products;',
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Thói quen xấu số một: SELECT *',
      text:
        'Trong bài tập thì `SELECT *` tiện. Trong code chạy thật thì nó là nguồn lỗi lâu dài: '
        + 'kéo về cả những cột bạn không dùng (tốn băng thông), và khi ai đó thêm cột mới vào bảng, '
        + 'code của bạn tự nhiên nhận thêm dữ liệu lạ. Hãy liệt kê cột ngay từ đầu.',
    },
    {
      kind: 'mssql',
      text:
        'Hai câu trên chạy Y HỆT trên SQL Server, MySQL, Oracle, SQLite. '
        + 'SQL là một chuẩn (ANSI SQL), và phần lõi — SELECT, FROM, WHERE, JOIN, GROUP BY — '
        + 'giống nhau tới 90% giữa các hệ. Cái khác nhau nằm ở phần rìa: kiểu dữ liệu, hàm xử lý chuỗi, '
        + 'cách phân trang, cách sinh số tự tăng. Chương "SQL Server ↔ Postgres" ở tab riêng liệt kê đủ.',
    },
    {
      kind: 'h',
      text: 'Câu SQL của bạn thực sự chạy ở đâu',
    },
    {
      kind: 'p',
      text:
        'Đây là chỗ người mới hay mơ hồ nhất. PostgreSQL là một **server** — một tiến trình chạy nền, '
        + 'thường nghe ở cổng 5432. Nó giữ dữ liệu, và chờ ai đó gửi câu SQL tới.',
    },
    {
      kind: 'p',
      text: 'Cái gửi câu SQL tới gọi là **client**. Trong đời một dev web, bạn sẽ gặp ba loại client:',
    },
    {
      kind: 'table',
      head: ['Client', 'Là gì', 'Dùng khi nào'],
      rows: [
        ['`psql`', 'Công cụ dòng lệnh đi kèm PostgreSQL', 'Gõ nhanh một câu để kiểm tra dữ liệu'],
        ['pgAdmin / DBeaver / TablePlus', 'Ứng dụng có giao diện', 'Xem bảng, sửa tay vài dòng, vẽ sơ đồ'],
        ['Backend của bạn (Node.js, Prisma…)', 'Thư viện trong code', 'Chạy thật, mỗi khi người dùng mở trang'],
      ],
    },
    {
      kind: 'figure',
      name: 'arch-client-server',
      title: 'Câu SQL của bạn đi qua những đâu',
      caption: 'Trình duyệt không bao giờ nói chuyện thẳng với database. Luôn có backend đứng giữa — đó cũng là lớp bảo vệ.',
    },
    {
      kind: 'note',
      tone: 'ok',
      title: 'Đó là lý do khoá này gắn với Code Lab',
      text:
        'Bạn sẽ không phải cài PostgreSQL để bắt đầu. Phần bài tập chạy trên một PostgreSQL thật '
        + 'ngay trong trình duyệt — bạn gõ câu SQL, nó chạy, và báo đúng/sai. Cài máy để sau cũng được.',
    },
    {
      kind: 'h',
      text: 'Vì sao nó nhanh đến vậy',
    },
    {
      kind: 'p',
      text:
        'Câu hỏi tự nhiên nảy ra khi hiểu bảng là gì: nếu bảng có 1 triệu dòng, muốn tìm một email cụ thể, '
        + 'chẳng phải database phải đọc hết 1 triệu dòng sao? Đúng — nếu bạn không nói gì thêm. '
        + 'Cách đọc lần lượt từ đầu tới cuối gọi là **Sequential Scan** (quét tuần tự).',
    },
    {
      kind: 'p',
      text:
        'Nhưng nếu bạn tạo một **index** trên cột đó, câu chuyện đổi hoàn toàn. '
        + 'Index là một cấu trúc RIÊNG nằm cạnh bảng, chỉ chứa cột cần tìm đã sắp xếp, kèm con trỏ về dòng thật:',
    },
    {
      kind: 'figure',
      name: 'heap-vs-index',
      title: 'Bảng thật và index — hai thứ nằm cạnh nhau',
      caption: 'Index không thay thế bảng. Nó là bản chỉ mục phụ, có cái giá riêng: tốn đĩa và làm chậm mỗi lần ghi.',
    },
    {
      kind: 'p',
      text: 'Bấm chạy thử để đếm số lần đọc của hai cách:',
    },
    {
      kind: 'widget',
      name: 'scan-compare',
      title: 'Quét tuần tự vs dùng index',
      hint: 'Bấm "Chạy tìm kiếm" để xem hai cách tìm cùng một dòng trong 100 dòng dữ liệu.',
    },
    {
      kind: 'p',
      text:
        'Bên phải nhảy thẳng tới nơi cần vì index không phải một bản sao được sắp xếp phẳng, '
        + 'mà là một **cây B+Tree**. Mỗi lần so sánh loại bỏ được phần lớn dữ liệu còn lại. '
        + 'Thử tự tìm một số trong cây dưới đây:',
    },
    {
      kind: 'widget',
      name: 'btree',
      title: 'Bên trong một index: cây B+Tree',
      hint: 'Chọn một số rồi bấm Tìm — cây sẽ tô đường đi từ gốc xuống lá.',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Con số khiến việc này đáng kinh ngạc',
      text:
        'Mỗi node của cây chiếm đúng một trang 8KB trên đĩa và chứa được vài trăm khoá. '
        + 'Một cây chỉ 3 tầng, mỗi node 500 khoá, đã trỏ được tới 500 × 500 × 500 = **125 triệu dòng**. '
        + 'Nghĩa là ba lần đọc đĩa là đủ tìm ra một dòng trong 125 triệu. '
        + 'Chương 9 sẽ mổ kỹ chuyện này — bây giờ chỉ cần biết nó tồn tại.',
    },
    {
      kind: 'quiz',
      q: 'Bạn chạy `SELECT * FROM users WHERE email = \'an@gmail.com\'` trên bảng 2 triệu dòng CHƯA có index trên cột email. Database làm gì?',
      options: [
        'Nhảy thẳng tới dòng đó nhờ khoá chính',
        'Đọc lần lượt từ dòng đầu tới khi tìm thấy — có thể phải đọc hết 2 triệu dòng',
        'Từ chối chạy vì thiếu index',
        'Tự động tạo index rồi mới chạy',
      ],
      answer: 1,
      explain:
        'Đó là Sequential Scan. Khoá chính là `id`, không giúp gì cho việc tìm theo `email`. '
        + 'Và database sẽ không tự tạo index — tạo index là quyết định có cái giá phải trả (chậm ghi, tốn đĩa) '
        + 'nên nó để bạn tự chọn.',
    },
    {
      kind: 'quiz',
      q: 'Câu nào SAI về khoá chính (primary key)?',
      options: [
        'Không được trùng giữa các dòng',
        'Không được để rỗng (NULL)',
        'Nên chọn cột mang ý nghĩa như email hoặc số điện thoại',
        'Mỗi bảng nên có đúng một khoá chính',
      ],
      answer: 2,
      explain:
        'Ngược lại mới đúng: khoá chính nên là con số vô nghĩa, sinh tự động. '
        + 'Email và số điện thoại đều đổi được, mà khoá chính đã bị các bảng khác tham chiếu tới rồi.',
    },
    {
      kind: 'try',
      text:
        'Sang Code Lab làm 3 bài đầu của module "Getting Started". Bạn sẽ gõ câu SELECT thật '
        + 'trên PostgreSQL thật và thấy kết quả trả về ngay. Xong thì quay lại đây học chương 1.',
    },
  ],
  flash: [
    { q: 'Database khác file Excel ở bốn điểm nào?', a: 'Nhiều người dùng đồng thời · tìm nhanh trong lượng lớn · không sai nửa chừng (transaction) · tự canh ràng buộc.' },
    { q: 'Khoá chính nên là gì?', a: 'Một con số vô nghĩa, sinh tự động, không bao giờ đổi. KHÔNG dùng email hay tên.' },
    { q: '`SELECT * FROM products;` nghĩa là gì?', a: 'Lấy tất cả các cột của mọi dòng trong bảng products. Trong code thật thì nên liệt kê cột thay vì dùng `*`.' },
    { q: 'Sequential Scan là gì?', a: 'Đọc lần lượt từng dòng từ đầu bảng tới cuối. Xảy ra khi không có index dùng được cho điều kiện lọc.' },
    { q: 'Vì sao index nhanh?', a: 'Nó là cây B+Tree: mỗi node chiếm một trang đĩa và chứa hàng trăm khoá, nên chỉ 3 tầng đã phủ được hơn 100 triệu dòng.' },
    { q: 'Client và server trong PostgreSQL là gì?', a: 'Server là tiến trình PostgreSQL giữ dữ liệu (cổng 5432). Client là thứ gửi câu SQL tới: psql, pgAdmin, hoặc backend Node.js của bạn.' },
  ],
};
