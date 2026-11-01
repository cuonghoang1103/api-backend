/** PostgreSQL · 7.2 — Truy vấn con tương quan, EXISTS và bẫy NOT IN. */
import { mod, pg, kq, kqAn, ma, tn } from './_chung.mjs';
import { O_APP } from './_du-lieu.mjs';

const T = { thuTu: true };

export default mod('postgresql-7-2-correlated-exists', '7.2 Correlated subqueries, EXISTS & the NOT IN trap', [
  pg({
    ...O_APP, t: 'Comment count per note (correlated)', k: 'EASY', p: 5, kn: ['correlated scalar subquery'], tag: ['subquery', 'correlated'],
    en: '<p>For every note return <code>title, comments</code> — the number of comments on that note (0 when none). Order by note id. Use a correlated subquery.</p>',
    vi: '<p>Với mọi ghi chú trả về <code>title, comments</code> — số bình luận của ghi chú đó (0 nếu không có). Sắp theo id ghi chú. Dùng truy vấn con tương quan.</p>',
    yc: [['<code>(SELECT count(*) FROM comment c WHERE c.note_id = n.id)</code>.', '<code>(SELECT count(*) FROM comment c WHERE c.note_id = n.id)</code>.'], ['count(*) of an empty set is 0, not NULL.', 'count(*) của tập rỗng là 0, không phải NULL.']],
    giai: `SELECT n.title,
       (SELECT count(*) FROM comment c WHERE c.note_id = n.id) AS comments   -- re-evaluated for each n
FROM note n
ORDER BY n.id;`,
    kiem: [
      kq(['Intro to SQL 3, … , Orphan draft 0', 'Intro to SQL 3, …, Orphan draft 0'], T),
      kqAn(['New comments', 'Bình luận mới'], "INSERT INTO comment VALUES (7, 7, 1, 'Nice'), (8, 7, 3, 'Me too')", T),
      ma(['Correlated on n.id', 'Tương quan theo n.id'], 'note_id\\s*=\\s*n\\.id|n\\.id\\s*=\\s*\\w*\\.?note_id'),
    ],
    sai: ['SELECT n.title, (SELECT count(*) FROM comment c) AS comments FROM note n ORDER BY n.id', 'SELECT n.title, count(c.id) AS comments FROM note n JOIN comment c ON c.note_id = n.id GROUP BY n.id, n.title ORDER BY n.id'],
    gy: [['The inner query refers to the outer alias <code>n</code>.', 'Truy vấn trong tham chiếu bí danh ngoài <code>n</code>.'], ['No GROUP BY is needed.', 'Không cần GROUP BY.']],
    lhg: [['Forgetting the correlation — every note shows the total of all comments (6).', 'Quên điều kiện tương quan — mọi ghi chú hiện tổng số bình luận (6).'], ['An INNER JOIN + GROUP BY — notes without comments disappear instead of showing 0.', 'INNER JOIN + GROUP BY — ghi chú không bình luận biến mất thay vì hiện 0.']],
    gt: ['<p>A correlated subquery is logically run once per outer row. For small outer sets it is perfectly fine and very readable; the planner may also turn it into a join.</p>', '<p>Truy vấn con tương quan về logic chạy một lần cho mỗi dòng ngoài. Với tập ngoài nhỏ thì hoàn toàn ổn và rất dễ đọc; planner cũng có thể biến nó thành phép nối.</p>'],
    tn: [tn('correlated subquery', 'truy vấn con tương quan')],
  }),

  pg({
    ...O_APP, t: 'Users who have a pinned note (EXISTS)', k: 'MEDIUM', p: 6, kn: ['EXISTS', 'semi-join'], tag: ['subquery', 'exists'],
    en: '<p>Return <code>id, name</code> of every user who has <b>at least one pinned</b> note, each user once, ordered by id.</p>',
    vi: '<p>Trả về <code>id, name</code> của mọi user có <b>ít nhất một</b> ghi chú được ghim, mỗi user một lần, sắp theo id.</p>',
    yc: [['<code>WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id AND n.pinned)</code>.', '<code>WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id AND n.pinned)</code>.'], ['Each user at most once.', 'Mỗi user tối đa một lần.']],
    giai: `SELECT u.id, u.name
FROM app_user u
WHERE EXISTS (SELECT 1                     -- what it selects does not matter
              FROM note n
              WHERE n.user_id = u.id AND n.pinned)
ORDER BY u.id;`,
    kiem: [
      kq(['Cuong and Minh', 'Cuong và Minh'], T),
      kqAn(['Cuong pins all his notes — still listed once', 'Cuong ghim mọi ghi chú — vẫn chỉ hiện một lần'], 'UPDATE note SET pinned = true WHERE user_id = 1', T),
      ma(['Uses EXISTS', 'Dùng EXISTS'], '\\bEXISTS\\s*\\('),
    ],
    sai: ['SELECT u.id, u.name FROM app_user u JOIN note n ON n.user_id = u.id WHERE n.pinned ORDER BY u.id', 'SELECT u.id, u.name FROM app_user u WHERE EXISTS (SELECT 1 FROM note n WHERE n.pinned) ORDER BY u.id'],
    gy: [['EXISTS is true as soon as the subquery finds one row.', 'EXISTS đúng ngay khi truy vấn con tìm thấy một dòng.'], ['Correlate it with the outer user.', 'Tương quan nó với user bên ngoài.']],
    lhg: [['JOIN + WHERE pinned: a user with two pinned notes appears twice.', 'JOIN + WHERE pinned: user có hai ghi chú ghim hiện hai lần.'], ['Forgetting <code>n.user_id = u.id</code> — EXISTS is true for every user.', 'Quên <code>n.user_id = u.id</code> — EXISTS đúng với mọi user.']],
    gt: ['<p>EXISTS asks a yes/no question per outer row and stops at the first match, so it never duplicates the outer row. The hidden check pins all of Cuong\'s notes.</p>', '<p>EXISTS hỏi có/không cho từng dòng ngoài và dừng ở dòng khớp đầu tiên, nên không bao giờ nhân bản dòng ngoài. Kiểm ẩn ghim mọi ghi chú của Cuong.</p>'],
    tn: [tn('EXISTS', 'có tồn tại')],
  }),

  pg({
    ...O_APP, t: 'The NOT IN trap: who wrote nothing?', k: 'MEDIUM', p: 7, kn: ['NOT IN with NULL', 'NOT EXISTS'], tag: ['subquery', 'null', 'trap'],
    en: '<p><code>SELECT name FROM app_user WHERE id NOT IN (SELECT user_id FROM note)</code> returns <b>nothing</b> — even though Hoa wrote no note. Write the correct query: <code>id, name</code> of users with no note, ordered by id.</p>',
    vi: '<p><code>SELECT name FROM app_user WHERE id NOT IN (SELECT user_id FROM note)</code> trả về <b>không gì cả</b> — dù Hoa chưa viết ghi chú nào. Viết câu đúng: <code>id, name</code> của user không có ghi chú, sắp theo id.</p>',
    yc: [['Use <code>NOT EXISTS</code> (NULL-safe).', 'Dùng <code>NOT EXISTS</code> (an toàn với NULL).'], ['Do not "fix" it by deleting the orphan draft.', 'Đừng "sửa" bằng cách xoá bản nháp mồ côi.']],
    giai: `SELECT u.id, u.name
FROM app_user u
WHERE NOT EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id)   -- NULL user_id never matches, never poisons
ORDER BY u.id;`,
    kiem: [
      kq(['Only Hoa', 'Chỉ Hoa'], T),
      kqAn(['Two more users without notes', 'Thêm hai user chưa có ghi chú'], "INSERT INTO app_user VALUES (5, 'Khoa', 'Hanoi'), (6, 'Linh', 'Hue')", T),
      ma(['NOT EXISTS (or NOT IN with IS NOT NULL)', 'NOT EXISTS (hoặc NOT IN kèm IS NOT NULL)'], 'NOT\\s+EXISTS|NOT\\s+IN[\\s\\S]*IS\\s+NOT\\s+NULL'),
    ],
    sai: ['SELECT u.id, u.name FROM app_user u WHERE u.id NOT IN (SELECT user_id FROM note) ORDER BY u.id'],
    gy: [['<code>x NOT IN (1, 3, NULL)</code> means x &lt;&gt; 1 AND x &lt;&gt; 3 AND x &lt;&gt; NULL — the last part is UNKNOWN.', '<code>x NOT IN (1, 3, NULL)</code> nghĩa là x &lt;&gt; 1 AND x &lt;&gt; 3 AND x &lt;&gt; NULL — phần cuối là UNKNOWN.'], ['NOT EXISTS only asks "is there a matching row?" — NULLs cannot match, so they cannot poison it.', 'NOT EXISTS chỉ hỏi "có dòng khớp không?" — NULL không khớp được nên không làm hỏng được.']],
    lhg: [['NOT IN over a column that can contain NULL — the result silently becomes empty.', 'NOT IN trên cột có thể chứa NULL — kết quả lặng lẽ thành rỗng.'], ['Patching it with <code>WHERE user_id IS NOT NULL</code> works, but the next nullable column bites again; prefer NOT EXISTS.', 'Vá bằng <code>WHERE user_id IS NOT NULL</code> thì chạy, nhưng cột cho phép NULL kế tiếp lại cắn; nên dùng NOT EXISTS.']],
    gt: ['<p>Because the orphan draft has user_id NULL, <code>NOT IN</code> compares every user with a NULL and the whole predicate is UNKNOWN, never TRUE. NOT EXISTS has no such trap.</p>', '<p>Vì bản nháp mồ côi có user_id NULL, <code>NOT IN</code> so mọi user với một NULL và cả vị từ thành UNKNOWN, không bao giờ TRUE. NOT EXISTS không có bẫy đó.</p>'],
    tn: [tn('NOT IN trap', 'bẫy NOT IN với NULL'), tn('NOT EXISTS', 'không tồn tại')],
  }),

  pg({
    t: 'Products priced above their category average', k: 'HARD', p: 10, kn: ['correlated subquery with the outer row', 'comparison per group'], tag: ['subquery', 'correlated', 'ctshop'],
    en: '<p>For pricing review, return <code>sku, name, price, cat_avg</code> of every active product whose price is above the average price of the active products of <b>its own category</b>; <code>cat_avg</code> rounded to whole đồng. Order by sku.</p>',
    vi: '<p>Để rà soát giá, trả về <code>sku, name, price, cat_avg</code> của mọi sản phẩm đang bán có giá cao hơn giá trung bình của các sản phẩm đang bán trong <b>chính danh mục của nó</b>; <code>cat_avg</code> làm tròn tới đồng. Sắp theo sku.</p>',
    yc: [['The inner query filters on <code>category_id = p.category_id</code>.', 'Truy vấn trong lọc theo <code>category_id = p.category_id</code>.'], ['Only active products, both outside and inside.', 'Chỉ sản phẩm đang bán, cả ngoài lẫn trong.']],
    giai: `SELECT p.sku, p.name, p.price,
       (SELECT round(avg(x.price)) FROM product x
        WHERE x.category_id = p.category_id AND x.is_active) AS cat_avg
FROM product p
WHERE p.is_active
  AND p.price > (SELECT avg(x.price) FROM product x
                 WHERE x.category_id = p.category_id AND x.is_active)
ORDER BY p.sku;`,
    kiem: [
      kq(['Six products', 'Sáu sản phẩm'], T),
      kqAn(['A cheaper calculator lowers the bar of its category', 'Một máy tính rẻ hơn kéo ngưỡng của danh mục xuống'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1003', 'Máy tính Vinacal 570ES Plus II', 10, 345000)", T),
      ma(['Correlated on category_id', 'Tương quan theo category_id'], 'category_id\\s*=\\s*p\\.category_id|p\\.category_id\\s*=\\s*\\w+\\.category_id'),
    ],
    sai: ['SELECT p.sku, p.name, p.price, (SELECT round(avg(price)) FROM product WHERE is_active) AS cat_avg FROM product p WHERE p.is_active AND p.price > (SELECT avg(price) FROM product WHERE is_active) ORDER BY p.sku', 'SELECT p.sku, p.name, p.price, (SELECT round(avg(x.price)) FROM product x WHERE x.category_id = p.category_id) AS cat_avg FROM product p WHERE p.is_active AND p.price > (SELECT avg(x.price) FROM product x WHERE x.category_id = p.category_id) ORDER BY p.sku'],
    gy: [['Give the inner product table its own alias (x) so <code>p.category_id</code> clearly means the outer row.', 'Đặt bí danh riêng cho bảng product bên trong (x) để <code>p.category_id</code> rõ là dòng ngoài.'], ['A category with a single active product never qualifies (its price equals its own average).', 'Danh mục chỉ có một sản phẩm đang bán không bao giờ thoả (giá bằng chính trung bình).']],
    lhg: [['Comparing with the average of the whole shop — calculators look "expensive" against pencils.', 'So với trung bình cả cửa hàng — máy tính trông "đắt" so với bút chì.'], ['Forgetting is_active inside: the discontinued Deli calculator still pulls its category average.', 'Quên is_active bên trong: máy tính Deli đã ngừng bán vẫn kéo trung bình danh mục.']],
    gt: ['<p>The correlated subquery recomputes the average for the category of each outer product. The same answer can be written with a window function (<code>avg(price) OVER (PARTITION BY category_id)</code>, chapter 8) — usually cheaper on large tables.</p>', '<p>Truy vấn con tương quan tính lại trung bình cho danh mục của từng sản phẩm ngoài. Có thể viết cùng đáp án bằng hàm cửa sổ (<code>avg(price) OVER (PARTITION BY category_id)</code>, chương 8) — thường rẻ hơn trên bảng lớn.</p>'],
    tn: [tn('correlated subquery', 'truy vấn con tương quan')],
  }),
]);
