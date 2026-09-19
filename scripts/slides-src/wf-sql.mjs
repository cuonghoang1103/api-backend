/** Web Foundations · Deck wf-sql — Chương 8: Dữ liệu & SQL. */
import { code, F } from './_wf-chung.mjs';

export const deck = { key: 'wf-sql', code: 'WF · CH8', title: 'Dữ liệu & SQL', sub: 'Nền tảng Lập trình Web · Chương 8' };

export const slides = [
  { kind: 'cover', t: 'Chương 8 — Dữ liệu & SQL', sub: 'Bảng · SELECT · INSERT/UPDATE/DELETE · JOIN · ORM',
    body: `<p class="cov-meta">Nền tảng Lập trình Web · cuongthai.com</p>` },

  { t: 'Nội dung chương', body: `
    <ol class="toc">
      <li>Cơ sở dữ liệu là gì, và vì sao không lưu vào file</li>
      <li>Đọc dữ liệu với <b>SELECT</b></li>
      <li>Thay đổi dữ liệu: INSERT · UPDATE · DELETE</li>
      <li>Quan hệ &amp; <b>JOIN</b></li>
      <li>ORM &amp; Prisma</li>
    </ol>` },

  { t: 'Vì sao không lưu vào file cho xong', body: `
    <div class="two">
      <div class="card"><b>File JSON</b><p>Hai người sửa cùng lúc → mất dữ liệu. Tìm một dòng phải đọc cả file. Không kiểm được ràng buộc.</p></div>
      <div class="card"><b>Cơ sở dữ liệu</b><p>Nhiều người ghi an toàn. Có chỉ mục nên tìm nhanh. Tự bảo đảm ràng buộc và giao dịch.</p></div>
    </div>
    <div class="box">Bốn chữ hay nghe: <b>CRUD</b> = Create · Read · Update · Delete. Gần như mọi ứng dụng đều chỉ là bốn việc đó lặp lại trên nhiều bảng khác nhau.</div>` },

  { t: 'Bảng · hàng · cột · khoá', body: `
    <table class="t big2">
      <tr><th>id</th><th>ten</th><th>gia</th><th>loai_id</th></tr>
      <tr><td class="hl">1</td><td>Margherita</td><td>149000</td><td>2</td></tr>
      <tr><td class="hl">2</td><td>Pepperoni</td><td>199000</td><td>1</td></tr>
    </table>
    <div class="grid2">
      <div class="f"><b>Khoá chính (PRIMARY KEY)</b><br/><code>id</code> — duy nhất, không trùng</div>
      <div class="f"><b>Khoá ngoại (FOREIGN KEY)</b><br/><code>loai_id</code> — trỏ sang bảng khác</div>
    </div>
    <div class="box">Khoá ngoại không chỉ để "nhớ": cơ sở dữ liệu sẽ <b>từ chối</b> ghi một <code>loai_id</code> không tồn tại — dữ liệu không thể mồ côi.</div>` },

  { t: 'SELECT — câu lệnh dùng nhiều nhất', body: `
    ${code(`SELECT ten, gia FROM pizzas;              -- chọn cột
SELECT * FROM pizzas;                     -- mọi cột (tránh dùng khi chạy thật)

SELECT * FROM pizzas WHERE gia < 200000;
SELECT * FROM pizzas WHERE loai = 'chay' AND gia < 200000;
SELECT * FROM pizzas WHERE ten LIKE '%hải sản%';
SELECT * FROM pizzas WHERE gia BETWEEN 150000 AND 250000;

SELECT * FROM pizzas ORDER BY gia DESC LIMIT 5;`, 'sql')}
    <div class="box warn">SQL không phân biệt hoa thường ở từ khoá, nhưng <b>có</b> phân biệt ở dữ liệu. <code>WHERE ten = 'pizza'</code> sẽ không khớp <code>'Pizza'</code>.</div>` },

  { t: 'Gộp nhóm: COUNT · SUM · GROUP BY', body: `
    ${code(`SELECT COUNT(*) FROM pizzas;                  -- đếm tất cả
SELECT AVG(gia), MAX(gia), MIN(gia) FROM pizzas;

SELECT loai, COUNT(*) AS so_luong
FROM pizzas
GROUP BY loai;                                -- đếm theo từng loại

SELECT loai, COUNT(*) AS n
FROM pizzas
GROUP BY loai
HAVING COUNT(*) > 2;    -- HAVING lọc SAU khi gộp; WHERE lọc TRƯỚC`, 'sql')}
    <div class="box"><b>WHERE</b> lọc từng hàng trước khi gộp. <b>HAVING</b> lọc kết quả đã gộp. Nhầm hai cái này là lỗi SQL kinh điển.</div>` },

  { t: 'Thay đổi dữ liệu', body: `
    ${code(`INSERT INTO pizzas (ten, gia, loai)
VALUES ('Hải sản', 239000, 'thit');

UPDATE pizzas SET gia = 209000 WHERE id = 3;

DELETE FROM pizzas WHERE id = 3;`, 'sql')}
    <div class="box warn">⚠️ <b>Quên WHERE là sửa/xoá TOÀN BỘ bảng.</b> <code>UPDATE pizzas SET gia = 0;</code> đặt giá 0 cho mọi món và không có nút hoàn tác. Thói quen tốt: viết <code>SELECT</code> với đúng điều kiện đó trước, xem trúng bao nhiêu hàng, rồi mới đổi thành UPDATE.</div>` },

  { t: 'Quan hệ — ba kiểu', body: `
    <div class="grid3">
      <div class="card"><b>1 – 1</b><p>Một người ↔ một hồ sơ</p></div>
      <div class="card"><b>1 – n</b><p>Một loại ↔ nhiều pizza<br/><i>hay gặp nhất</i></p></div>
      <div class="card"><b>n – n</b><p>Nhiều đơn ↔ nhiều món<br/><i>cần bảng trung gian</i></p></div>
    </div>
    <div class="dg">
      <div class="bx">pizzas</div><div class="ar">→<small>loai_id</small></div><div class="bx">loai</div>
    </div>
    <div class="box">Quan hệ n–n luôn cần <b>bảng thứ ba</b> (ví dụ <code>don_hang_mon</code>) chứa hai khoá ngoại — không có cách nào làm trực tiếp bằng hai bảng.</div>` },

  { t: 'JOIN — ghép dữ liệu từ nhiều bảng', body: `
    ${code(`SELECT p.ten, p.gia, l.ten AS ten_loai
FROM pizzas p
JOIN loai l ON p.loai_id = l.id;          -- chỉ hàng KHỚP cả hai bên

SELECT p.ten, l.ten AS ten_loai
FROM pizzas p
LEFT JOIN loai l ON p.loai_id = l.id;     -- giữ MỌI pizza, thiếu loại thì NULL`, 'sql')}
    <div class="two">
      <div class="card"><b>JOIN (INNER)</b><p>Chỉ giữ hàng khớp ở cả hai bảng</p></div>
      <div class="card"><b>LEFT JOIN</b><p>Giữ mọi hàng bảng trái; bên phải thiếu thì NULL</p></div>
    </div>
    <div class="box warn">Quên <code>ON</code> là sinh <b>tích Descartes</b>: 1.000 × 1.000 = một triệu hàng. Truy vấn treo, và tưởng là máy chủ hỏng.</div>` },

  { t: 'Chỉ mục — vì sao truy vấn chậm', body: `
    ${code(`-- Không có chỉ mục: quét TOÀN BỘ bảng để tìm một email
SELECT * FROM users WHERE email = 'a@b.com';

CREATE INDEX idx_users_email ON users(email);
-- → giờ tìm theo email nhanh hơn hàng trăm lần

EXPLAIN SELECT * FROM users WHERE email = 'a@b.com';
-- xem cơ sở dữ liệu thật sự làm gì: quét bảng hay dùng chỉ mục`, 'sql')}
    <div class="box">Chỉ mục không miễn phí: mỗi lần ghi phải cập nhật nó. Đánh chỉ mục cho cột hay dùng trong <code>WHERE</code> và <code>JOIN</code>, không phải cho mọi cột.</div>` },

  { t: 'SQL Injection — và cách chặn', body: `
    ${code(`// ❌ NGUY HIỂM — ghép chuỗi
const q = "SELECT * FROM users WHERE email = '" + input + "'";
// input = "' OR '1'='1"  →  lấy về TOÀN BỘ người dùng

// ✅ AN TOÀN — truy vấn tham số hoá
db.query('SELECT * FROM users WHERE email = $1', [input]);`, 'javascript')}
    <div class="box ok">Tham số hoá không phải là "lọc kỹ hơn" — nó gửi câu lệnh và dữ liệu <b>riêng</b>, nên dữ liệu không bao giờ được hiểu thành lệnh. ORM làm việc này sẵn cho bạn.</div>` },

  { t: `ORM & Prisma — viết SQL bằng JavaScript ${F()}`, body: `
    ${code(`// Cùng một việc, viết bằng Prisma
const re = await prisma.pizza.findMany({
  where: { gia: { lt: 200000 }, loai: 'chay' },
  orderBy: { gia: 'desc' },
  take: 5,
  include: { loaiPizza: true },      // JOIN
});

await prisma.pizza.create({ data: { ten: 'Hải sản', gia: 239000 } });
await prisma.pizza.update({ where: { id: 3 }, data: { gia: 209000 } });`, 'javascript', 'sm')}
    <div class="two">
      <div class="card"><b>Lợi</b><p>An toàn khỏi injection, có gợi ý kiểu, đổi CSDL dễ hơn</p></div>
      <div class="card"><b>Hại</b><p>Che mất SQL thật — truy vấn chậm mà không biết vì sao</p></div>
    </div>
    <div class="box">Vẫn phải học SQL: khi ORM sinh ra truy vấn chậm, bạn cần đọc được nó để sửa.</div>` },

  { t: 'Tự luyện', body: `
    ${code(`-- Dùng sqliteonline.com hoặc db-fiddle.com, không cần cài gì

-- 1. Tạo bảng pizzas(id, ten, gia, loai) và thêm 5 dòng
-- 2. Lấy các món dưới 200.000, sắp xếp giá giảm dần
-- 3. Đếm số món theo từng loại
-- 4. Tạo bảng loai(id, ten), thêm cột loai_id vào pizzas, rồi JOIN hai bảng
-- 5. Thử UPDATE có WHERE và UPDATE không WHERE trên bảng nháp —
--    để tự thấy sức tàn phá của việc quên WHERE`, 'sql', 'sm')}` },
];
