import type { Chapter } from './types';

/**
 * Chương 1 — thiết kế bảng.
 *
 * Chương này cố ý dài, vì đây là chỗ sai lầm đắt nhất: chọn sai kiểu dữ liệu
 * hoặc quên ràng buộc thì tới lúc phát hiện, bảng đã có hàng trăm nghìn dòng
 * và việc sửa trở thành một cuộc di trú dữ liệu. Ba cái bẫy được nhấn riêng:
 * tiền để float, thời gian không kèm múi giờ, và khoá ngoại thiếu ON DELETE.
 */
export const CH01: Chapter = {
  no: 1,
  slug: 'bang-kieu-du-lieu-rang-buoc',
  title: 'Tạo bảng, kiểu dữ liệu & ràng buộc',
  icon: '🧱',
  tagline: 'Chọn sai kiểu dữ liệu hôm nay, trả giá bằng một cuộc di trú dữ liệu sáu tháng sau',
  minutes: 50,
  goals: [
    'Viết được CREATE TABLE đầy đủ ràng buộc',
    'Chọn đúng kiểu cho tiền, thời gian, văn bản, khoá chính',
    'Dùng NOT NULL / UNIQUE / CHECK / DEFAULT để database tự canh dữ liệu bẩn',
    'Nối hai bảng bằng khoá ngoại và chọn đúng hành vi ON DELETE',
    'Biết chính xác kiểu dữ liệu nào của SQL Server tương ứng với cái nào bên Postgres',
  ],
  labModuleId: 859,
  labModuleName: 'Tables, Data Types & Constraints',
  labCount: 10,
  labPicks: [
    { slug: 'create-your-first-table', title: 'Create Your First Table', vi: 'Tạo bảng đầu tiên' },
    { slug: 'pick-the-right-data-types', title: 'Pick the Right Data Types', vi: 'Chọn đúng kiểu dữ liệu' },
    { slug: 'link-tables-with-a-foreign-key', title: 'Link Tables with a Foreign Key', vi: 'Nối bảng bằng khoá ngoại' },
    { slug: 'capstone-design-a-complete-table', title: 'Capstone: Design a Complete Table', vi: 'Tổng hợp: thiết kế trọn một bảng' },
  ],
  status: 'full',
  blocks: [
    {
      kind: 'p',
      text:
        'Chương trước bạn đọc dữ liệu có sẵn. Chương này bạn tự tạo ra chỗ chứa nó. '
        + 'Đây là chương quan trọng nhất trong tám chương nền, vì mọi thứ sau đó đều dựng trên bảng bạn thiết kế ở đây.',
    },
    {
      kind: 'h',
      text: 'CREATE TABLE — câu lệnh đầy đủ',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Bảng sản phẩm, viết đúng chuẩn production',
      code: `CREATE TABLE products (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text        NOT NULL,
  slug        text        NOT NULL UNIQUE,
  price       numeric(12,2) NOT NULL CHECK (price >= 0),
  stock       integer     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_active   boolean     NOT NULL DEFAULT true,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);`,
    },
    {
      kind: 'p',
      text:
        'Mỗi dòng trong đó là một quyết định. Phần còn lại của chương giải thích từng quyết định một, '
        + 'và cái giá nếu chọn khác.',
    },

    { kind: 'h', text: 'Kiểu dữ liệu: chọn thế nào cho đúng' },
    {
      kind: 'table',
      caption: 'Bảng chọn nhanh cho một web app điển hình',
      head: ['Bạn muốn lưu', 'Dùng kiểu', 'Vì sao'],
      rows: [
        ['Văn bản bất kỳ độ dài', '`text`', 'Trong Postgres, `text` và `varchar` nhanh như nhau. Chỉ dùng `varchar(n)` khi n là ràng buộc nghiệp vụ thật.'],
        ['Số nguyên thường', '`integer`', 'Tới hơn 2 tỉ. Đủ cho gần như mọi thứ.'],
        ['Khoá chính của bảng lớn', '`bigint`', 'Đổi `integer` sang `bigint` khi bảng đã 500 triệu dòng là một đêm mất ngủ. Chọn `bigint` từ đầu.'],
        ['**Tiền**', '`numeric(12,2)`', '**Tuyệt đối không dùng `float`/`real`.** Xem hộp cảnh báo bên dưới.'],
        ['Đúng/sai', '`boolean`', 'Nhận `true`/`false`. Không dùng `integer` 0/1.'],
        ['**Thời điểm**', '`timestamptz`', 'Có kèm múi giờ. Không dùng `timestamp` trơn.'],
        ['Chỉ ngày, không giờ', '`date`', 'Ngày sinh, ngày nghỉ lễ.'],
        ['Mã định danh công khai', '`uuid`', 'Khi không muốn lộ số lượng bản ghi qua URL.'],
        ['Dữ liệu tuỳ biến, không cố định cột', '`jsonb`', 'Cấu hình, thuộc tính phụ. Đánh index được (chương 10).'],
      ],
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Bẫy số 1 — tiền để kiểu float',
      text:
        'Kiểu `float`/`double precision` lưu số theo hệ nhị phân, nên `0.1 + 0.2` ra `0.30000000000000004`. '
        + 'Cộng một triệu đơn hàng thì sai số tích lại thành tiền thật. `numeric(12,2)` lưu chính xác từng chữ số thập phân: '
        + '12 chữ số tổng cộng, 2 chữ số sau dấu phẩy. Chậm hơn một chút, nhưng đúng.',
    },
    {
      kind: 'code',
      lang: 'sql',
      caption: 'Tự chạy thử để thấy tận mắt',
      code: `SELECT 0.1::float8 + 0.2::float8   AS kieu_float,    -- 0.30000000000000004
       0.1::numeric + 0.2::numeric  AS kieu_numeric;  -- 0.3`,
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Bẫy số 2 — thời gian không kèm múi giờ',
      text:
        '`timestamp` lưu "14:30" mà không nói 14:30 ở đâu. Server đặt ở Singapore, người dùng ở Việt Nam, '
        + 'lệch một tiếng và không có cách nào biết. `timestamptz` quy mọi thứ về UTC khi lưu và đổi lại theo múi giờ khi đọc. '
        + 'Hãy dùng `timestamptz` cho mọi mốc thời gian có ý nghĩa "lúc nào việc đó xảy ra".',
    },
    {
      kind: 'mssql',
      text:
        'Đây là chỗ hai hệ khác nhau nhiều nhất — bảng dưới là những cặp bạn sẽ gặp ngay tuần đầu.',
      ms: 'NVARCHAR(MAX) · INT · BIGINT · DECIMAL(12,2) · BIT · DATETIME2 · DATETIMEOFFSET · UNIQUEIDENTIFIER · NVARCHAR + JSON_VALUE',
      pg: 'text · integer · bigint · numeric(12,2) · boolean · timestamp · timestamptz · uuid · jsonb',
    },
    {
      kind: 'note',
      tone: 'info',
      title: 'Ba khác biệt dễ vấp nhất khi từ SQL Server sang',
      text:
        '**(1)** Postgres không phân biệt `VARCHAR` và `NVARCHAR` — mọi thứ đã là Unicode (UTF-8), '
        + 'nên không cần tiền tố `N\'...\'` khi viết chuỗi tiếng Việt. '
        + '**(2)** Postgres phân biệt HOA/thường khi so chuỗi; SQL Server mặc định thì không. '
        + '`WHERE name = \'an\'` bên Postgres sẽ KHÔNG khớp `\'An\'` — dùng `ILIKE` hoặc `lower()`. '
        + '**(3)** Tên bảng/cột không đặt trong nháy kép sẽ bị Postgres hạ hết thành chữ thường; '
        + 'nếu bạn tạo `"UserName"` có nháy kép thì về sau luôn phải viết nháy kép. '
        + 'Cách thoát: đặt tên theo kiểu `snake_case` hết, đừng dùng nháy kép.',
    },

    { kind: 'h', text: 'Ràng buộc — để database tự canh thay bạn' },
    {
      kind: 'p',
      text:
        'Ràng buộc (constraint) là luật bạn khai báo một lần, và database từ chối mọi dữ liệu vi phạm — '
        + 'kể cả khi lỗi đến từ một script chạy tay lúc 2 giờ sáng. Đây là thứ tầng ứng dụng không thay thế được.',
    },
    {
      kind: 'table',
      head: ['Ràng buộc', 'Nghĩa', 'Ví dụ dùng thật'],
      rows: [
        ['`NOT NULL`', 'Bắt buộc phải có giá trị', 'Sản phẩm phải có tên'],
        ['`UNIQUE`', 'Không được trùng', 'Mỗi email chỉ một tài khoản'],
        ['`CHECK (…)`', 'Giá trị phải thoả điều kiện', 'Giá không được âm'],
        ['`DEFAULT …`', 'Giá trị mặc định khi không đưa vào', '`created_at` tự lấy `now()`'],
        ['`PRIMARY KEY`', 'Khoá chính = `UNIQUE` + `NOT NULL`', 'Cột `id`'],
        ['`REFERENCES`', 'Khoá ngoại — phải tồn tại ở bảng kia', 'Đơn hàng phải trỏ tới một khách có thật'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Vì sao không để backend tự kiểm tra hết cho gọn?',
      text:
        'Vì backend không phải con đường duy nhất chạm vào database. Còn có: script di trú dữ liệu, '
        + 'công cụ admin, một dev mở pgAdmin sửa tay, và phiên bản cũ của chính backend đang chạy song song lúc deploy. '
        + 'Ràng buộc ở database là lớp cuối cùng, không ai đi vòng qua được.',
    },

    { kind: 'h', text: 'Khoá ngoại — nối hai bảng lại' },
    {
      kind: 'p',
      text:
        'Bảng `orders` cần biết đơn hàng này của khách nào. Cách làm là để một cột trỏ sang khoá chính của bảng `customers`:',
    },
    {
      kind: 'code',
      lang: 'sql',
      code: `CREATE TABLE customers (
  id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name  text NOT NULL
);

CREATE TABLE orders (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  customer_id bigint NOT NULL
                REFERENCES customers(id)
                ON DELETE RESTRICT,
  total       numeric(12,2) NOT NULL CHECK (total >= 0),
  created_at  timestamptz   NOT NULL DEFAULT now()
);`,
    },
    {
      kind: 'figure',
      name: 'erd-shop',
      title: 'Sơ đồ quan hệ của CSDL mẫu dùng suốt khoá',
      caption: 'Bốn bảng, ba mối quan hệ. Mũi tên đi từ khoá ngoại về khoá chính mà nó tham chiếu.',
    },
    {
      kind: 'p',
      text:
        'Từ giây phút đó, database từ chối mọi đơn hàng trỏ tới `customer_id` không tồn tại. '
        + 'Câu hỏi còn lại: nếu xoá một khách đang có đơn hàng thì sao? Đó là việc của `ON DELETE`:',
    },
    {
      kind: 'table',
      head: ['Khai báo', 'Khi xoá dòng cha', 'Dùng khi'],
      rows: [
        ['`ON DELETE RESTRICT`', 'Chặn lại, báo lỗi', 'Đơn hàng — dữ liệu tài chính, không được biến mất'],
        ['`ON DELETE CASCADE`', 'Xoá luôn các dòng con', 'Bình luận của một bài viết bị xoá'],
        ['`ON DELETE SET NULL`', 'Để cột con thành NULL', 'Bài viết mất tác giả nhưng vẫn còn nội dung'],
        ['*(không khai báo)*', 'Mặc định là `NO ACTION`, gần như `RESTRICT`', 'Nên khai báo rõ ràng thay vì để mặc định'],
      ],
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'CASCADE là con dao hai lưỡi',
      text:
        'Nó rất tiện lúc dọn dữ liệu, và rất đáng sợ lúc chạy nhầm. Một lệnh xoá một khách hàng có thể '
        + 'kéo theo toàn bộ đơn hàng, chi tiết đơn và lịch sử thanh toán — im lặng, không hỏi lại. '
        + 'Với dữ liệu tài chính hãy dùng `RESTRICT`, hoặc tốt hơn: đừng xoá, chỉ đánh dấu `deleted_at`.',
    },

    { kind: 'h', text: 'NULL — thứ không phải giá trị' },
    {
      kind: 'p',
      text:
        '`NULL` không có nghĩa là 0, cũng không phải chuỗi rỗng. Nó nghĩa là **không biết**. '
        + 'Và vì không biết, mọi phép so sánh với nó đều trả về "không biết" chứ không phải đúng/sai. '
        + 'Đây là nguồn lỗi âm thầm số một của người mới. Bấm thử:',
    },
    {
      kind: 'widget',
      name: 'null-lab',
      title: 'Phòng thí nghiệm NULL',
      hint: 'Bấm từng biểu thức để xem PostgreSQL trả về gì — và vì sao.',
    },
    {
      kind: 'note',
      tone: 'danger',
      title: 'Hệ quả thực tế',
      text:
        'Để tìm dòng thiếu dữ liệu, KHÔNG viết `WHERE description = NULL` (luôn ra rỗng) '
        + 'mà phải viết `WHERE description IS NULL`. Chương 3 sẽ đào tiếp phần này với `NOT IN` — '
        + 'cái bẫy khiến câu query trả về rỗng mà không báo lỗi gì.',
    },

    { kind: 'h', text: 'Sửa bảng đã có: ALTER TABLE' },
    {
      kind: 'code',
      lang: 'sql',
      code: `ALTER TABLE products ADD COLUMN weight_gram integer;
ALTER TABLE products ALTER COLUMN description SET NOT NULL;
ALTER TABLE products ADD CONSTRAINT chk_weight CHECK (weight_gram > 0);
ALTER TABLE products RENAME COLUMN slug TO url_slug;
ALTER TABLE products DROP COLUMN weight_gram;`,
    },
    {
      kind: 'note',
      tone: 'warn',
      title: 'Trên bảng đang chạy thật thì cẩn thận',
      text:
        'Thêm cột có `DEFAULT` hoặc bật `NOT NULL` trên bảng lớn sẽ khoá bảng trong lúc chạy. '
        + 'Với Postgres đời mới, thêm cột kèm default là thao tác tức thời, nhưng đặt `NOT NULL` thì vẫn phải quét toàn bảng. '
        + 'Chương 15 nói kỹ về migration không gây gián đoạn.',
    },

    {
      kind: 'quiz',
      q: 'Bạn lưu giá sản phẩm. Kiểu nào đúng?',
      options: [
        '`float8` — nhanh nhất',
        '`numeric(12,2)` — chính xác tuyệt đối phần thập phân',
        '`text` — linh hoạt, muốn định dạng sao cũng được',
        '`integer` rồi nhân/chia 100 ở tầng ứng dụng',
      ],
      answer: 1,
      explain:
        '`numeric` lưu chính xác từng chữ số thập phân. `float` sai số nhị phân. '
        + 'Cách lưu `integer` theo đơn vị xu cũng chính xác và được vài nơi dùng, nhưng bắt mọi chỗ trong code phải nhớ nhân chia — dễ quên.',
    },
    {
      kind: 'quiz',
      q: 'Bảng `comments` có `post_id REFERENCES posts(id) ON DELETE CASCADE`. Bạn xoá một bài viết có 40 bình luận. Chuyện gì xảy ra?',
      options: [
        'Lệnh xoá bị chặn vì còn bình luận',
        '40 bình luận bị xoá theo, không hỏi lại',
        '40 bình luận còn nguyên nhưng `post_id` thành NULL',
        'Báo lỗi vi phạm khoá ngoại',
      ],
      answer: 1,
      explain:
        'CASCADE nghĩa là xoá lan xuống. Rất tiện với bình luận. Rất nguy hiểm nếu bảng con là dữ liệu tài chính — '
        + 'ở đó hãy dùng RESTRICT.',
    },
    {
      kind: 'quiz',
      q: 'Bên SQL Server bạn quen viết `WHERE name = \'an\'` và nó khớp cả `\'An\'`. Sang PostgreSQL thì sao?',
      options: [
        'Vẫn khớp, hai hệ giống nhau ở điểm này',
        'Không khớp — Postgres phân biệt hoa thường khi so chuỗi',
        'Báo lỗi cú pháp',
        'Chỉ khớp nếu cột kiểu `text`, không khớp nếu `varchar`',
      ],
      answer: 1,
      explain:
        'Postgres phân biệt HOA/thường. Dùng `ILIKE` (so khớp không phân biệt hoa thường) '
        + 'hoặc `lower(name) = lower(\'an\')`. Lưu ý cách thứ hai làm mất index — chương 9 sẽ chỉ cách chữa.',
    },
    {
      kind: 'try',
      text:
        'Làm 4 bài Code Lab được gợi ý ngay dưới đây, đặc biệt bài Capstone — bạn sẽ tự thiết kế trọn một bảng '
        + 'có đủ khoá chính, khoá ngoại, CHECK và DEFAULT.',
    },
  ],
  flash: [
    { q: 'Kiểu nào để lưu tiền?', a: '`numeric(12,2)`. Không bao giờ dùng `float`/`real` — sai số nhị phân tích luỹ thành tiền thật.' },
    { q: '`timestamp` khác `timestamptz` thế nào?', a: '`timestamp` không có múi giờ. `timestamptz` quy về UTC khi lưu, đổi theo múi giờ khi đọc. Luôn dùng `timestamptz`.' },
    { q: 'Tại sao `WHERE x = NULL` luôn trả về rỗng?', a: 'Vì NULL nghĩa là "không biết", nên so sánh với nó ra "không biết" chứ không phải true. Phải dùng `IS NULL`.' },
    { q: 'Ba lựa chọn ON DELETE?', a: 'RESTRICT (chặn) · CASCADE (xoá lan) · SET NULL (để trống). Dữ liệu tài chính dùng RESTRICT.' },
    { q: 'NVARCHAR của SQL Server tương đương gì bên Postgres?', a: '`text`. Postgres đã là UTF-8 toàn bộ, không cần tiền tố `N\'...\'`.' },
    { q: 'Vì sao đặt ràng buộc ở DB thay vì chỉ ở backend?', a: 'Vì backend không phải con đường duy nhất: còn script migration, pgAdmin, và bản backend cũ đang chạy song song lúc deploy.' },
  ],
};
