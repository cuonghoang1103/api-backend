/**
 * PostgreSQL · 7.4 — CTE đệ quy: đi xuống cây danh mục, dựng đường dẫn, chống vòng lặp. Loại 'sql-pg'.
 * Bài 3 có dữ liệu VÒNG (category 2 ↔ 5): câu đệ quy không chặn vòng chạy mãi ⇒ máy chấm trình duyệt dừng worker
 * sau `timeoutMs` (4 s) và báo "Quá … giây". Không đưa câu vô hạn vào saiMau (bộ xuất Node không có giới hạn giờ).
 * CSDL: CT Shop thu gọn. Bài giảng: postgresql-7-4-recursive-cte.
 */
import { doiDau, KHOA, CT_SHOP, sqlPg, kq, kqAn, ma, TN } from './_chung.mjs';

const VONG = `${CT_SHOP}

-- data bug: someone moved "Điện thoại" (2) under "iPhone" (5), which is itself under "Điện thoại" ⇒ a cycle 2 → 5 → 2
UPDATE category SET parent_id = 5 WHERE id = 2;`;

export default doiDau({
  slug: 'postgresql-7-4-recursive-cte',
  ten: '7.4 Recursive CTEs: walking a hierarchy',
  khoa: KHOA,
  baiHoc: 'postgresql-7-4-recursive-cte',
  de: [
    sqlPg({
      tieuDe: 'Everything under "Điện tử", with its depth',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['WITH RECURSIVE', 'anchor + recursive member', 'UNION ALL', 'depth counter'], the: ['cte', 'recursive', 'hierarchy', 'ctshop'],
      moTa: {
        en: '<p>The menu "Điện tử" must show every category below it, at any depth. Return <code>id, name, depth</code> for category 1 (<b>Điện tử</b>, depth 0) and all its descendants (children depth 1, grandchildren depth 2, …). Row order does not matter.</p>',
        vi: '<p>Menu "Điện tử" phải hiện mọi danh mục bên dưới nó, ở bất kỳ độ sâu nào. Trả về <code>id, name, depth</code> cho danh mục 1 (<b>Điện tử</b>, depth 0) và mọi hậu duệ (con depth 1, cháu depth 2, …). Thứ tự dòng không quan trọng.</p>',
      },
      yeuCau: {
        en: ['One <code>WITH RECURSIVE</code> query.', 'Anchor: category 1 with depth 0. Recursive member: children of the rows found so far, depth + 1.', 'It must work for ANY depth — no fixed number of self-joins.'],
        vi: ['Một truy vấn <code>WITH RECURSIVE</code>.', 'Neo: danh mục 1 với depth 0. Phần đệ quy: con của các dòng đã tìm được, depth + 1.', 'Phải đúng với MỌI độ sâu — không nối cứng một số lần.'],
      },
      giai: `WITH RECURSIVE sub AS (
    SELECT id, name, 0 AS depth          -- anchor: where the walk starts
    FROM category
    WHERE id = 1
  UNION ALL
    SELECT c.id, c.name, s.depth + 1     -- recursive member: one level further down
    FROM category c
    JOIN sub s ON c.parent_id = s.id
)
SELECT id, name, depth FROM sub;`,
      kiem: [
        kq('Điện tử and its 4 descendants with the right depth'),
        kqAn('A new third level appears (Laptop → Laptop gaming → Phụ kiện gaming)', "INSERT INTO category (name, parent_id) VALUES ('Laptop gaming', 3); INSERT INTO category (name, parent_id) VALUES ('Phụ kiện gaming', 9)"),
        ma('Uses WITH RECURSIVE', '\\bWITH\\s+RECURSIVE\\b'),
      ],
      saiMau: [
        'SELECT c.id, c.name, 1 AS depth FROM category c WHERE c.parent_id = 1',
        'WITH RECURSIVE sub AS (SELECT id, name, 1 AS depth FROM category WHERE id = 1 UNION ALL SELECT c.id, c.name, s.depth + 1 FROM category c JOIN sub s ON c.parent_id = s.id) SELECT id, name, depth FROM sub',
      ],
      goiY: ['WITH RECURSIVE sub AS ( anchor UNION ALL recursive ) SELECT … FROM sub.', 'The recursive member joins category to sub: c.parent_id = s.id ("children of what I already have").'],
      loiHayGap: [
        { en: 'Joining the wrong way round (c.id = s.parent_id) — the walk goes UP to the parents instead of down to the children.', vi: 'Nối ngược chiều (c.id = s.parent_id) — đi LÊN cha thay vì đi xuống con.' },
        { en: 'Two or three fixed LEFT JOINs instead of recursion — correct today, silently wrong the day the tree gets one level deeper.', vi: 'Hai, ba LEFT JOIN cố định thay cho đệ quy — hôm nay đúng, ngày cây sâu thêm một tầng là sai âm thầm.' },
      ],
      giaiThich: { en: '<p>PostgreSQL runs the anchor once, then repeats the recursive member on the rows produced by the previous round until a round returns nothing. Each round is one level deeper, so <code>depth + 1</code> counts levels.</p>', vi: '<p>PostgreSQL chạy phần neo một lần, rồi lặp phần đệ quy trên các dòng vòng trước sinh ra cho tới khi một vòng không còn dòng nào. Mỗi vòng sâu thêm một tầng nên <code>depth + 1</code> đếm được tầng.</p>' },
      thuatNgu: [TN.cte, TN.recursive],
    }),
    sqlPg({
      tieuDe: 'Breadcrumbs for every category',
      doKho: 'MEDIUM', phut: 10,
      khaiNiem: ['WITH RECURSIVE from the roots', 'string concatenation ||'], the: ['cte', 'recursive', 'string', 'ctshop'],
      moTa: {
        en: '<p>Every product page shows a breadcrumb such as <code>Điện tử &gt; Điện thoại &gt; Android</code>. Return <code>id, path</code> for <b>every</b> category, where <code>path</code> is the chain of names from its root down to it, joined by <code>" &gt; "</code>. Order by <code>id</code>.</p>',
        vi: '<p>Mỗi trang sản phẩm hiện đường dẫn kiểu <code>Điện tử &gt; Điện thoại &gt; Android</code>. Trả về <code>id, path</code> cho <b>mọi</b> danh mục, trong đó <code>path</code> là chuỗi tên từ gốc xuống tới nó, nối bằng <code>" &gt; "</code>. Sắp theo <code>id</code>.</p>',
      },
      yeuCau: {
        en: ['Start from the roots (<code>parent_id IS NULL</code>) and walk down.', 'Separator: space, &gt;, space.', 'Order by id.'],
        vi: ['Bắt đầu từ các gốc (<code>parent_id IS NULL</code>) rồi đi xuống.', 'Dấu nối: dấu cách, &gt;, dấu cách.', 'Sắp theo id.'],
      },
      giai: `WITH RECURSIVE tree AS (
    SELECT id, name::text AS path
    FROM category
    WHERE parent_id IS NULL
  UNION ALL
    SELECT c.id, t.path || ' > ' || c.name
    FROM category c
    JOIN tree t ON c.parent_id = t.id
)
SELECT id, path
FROM tree
ORDER BY id;`,
      kiem: [
        kq('Every category with its full path, by id', { thuTu: true }),
        kqAn('A renamed root and a new deep leaf', "UPDATE category SET name = 'Đồ điện tử' WHERE id = 1; INSERT INTO category (name, parent_id) VALUES ('Android Go', 4)", { thuTu: true }),
        ma('Uses WITH RECURSIVE', '\\bWITH\\s+RECURSIVE\\b'),
      ],
      saiMau: [
        "WITH RECURSIVE tree AS (SELECT id, name::text AS path FROM category WHERE parent_id IS NULL UNION ALL SELECT c.id, c.name || ' > ' || t.path FROM category c JOIN tree t ON c.parent_id = t.id) SELECT id, path FROM tree ORDER BY id",
        "WITH RECURSIVE tree AS (SELECT id, name::text AS path FROM category WHERE id = 1 UNION ALL SELECT c.id, t.path || ' > ' || c.name FROM category c JOIN tree t ON c.parent_id = t.id) SELECT id, path FROM tree ORDER BY id",
      ],
      goiY: ['Anchor: the roots, with path = their own name.', 'Recursive member: path = parent\'s path || \' > \' || child name.'],
      loiHayGap: [
        { en: 'Starting only from "Điện tử" — the other roots (Gia dụng, Sách) and their children disappear.', vi: 'Chỉ bắt đầu từ "Điện tử" — các gốc khác (Gia dụng, Sách) và con của chúng biến mất.' },
        { en: 'Concatenating child || parent — the breadcrumb comes out backwards.', vi: 'Nối con || cha — đường dẫn bị ngược.' },
      ],
      giaiThich: { en: '<p>Walking from the roots carries the path down: each level appends its own name to the parent\'s path. <code>name::text</code> in the anchor fixes the column type so the longer strings of later rounds fit (in a recursive CTE the anchor decides the column types).</p>', vi: '<p>Đi từ gốc xuống mang theo đường dẫn: mỗi tầng nối tên mình vào đường dẫn của cha. <code>name::text</code> ở phần neo cố định kiểu cột để chuỗi dài hơn ở các vòng sau vẫn vừa (trong CTE đệ quy, phần neo quyết định kiểu cột).</p>' },
      thuatNgu: [TN.recursive, { en: 'breadcrumb', vi: 'đường dẫn phân cấp' }],
    }),
    sqlPg({
      tieuDe: 'Walk a tree that contains a cycle',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['cycle detection', 'CYCLE clause', 'path array', 'statement timeout'], the: ['cte', 'recursive', 'cycle', 'ctshop'],
      csdl: VONG,
      moTa: {
        en: '<p>A bad admin edit set the parent of <b>Điện thoại</b> (2) to <b>iPhone</b> (5) — which is itself a child of Điện thoại. The category tree now contains a <b>cycle</b> 2 → 5 → 2, and the naive recursive query from the previous exercise never ends (the grader stops it after 4 seconds).</p><p>Return <code>id, depth</code> of category <b>2</b> (depth 0) and every category reachable by following child links, <b>visiting each category once</b>. Row order does not matter.</p>',
        vi: '<p>Một lần sửa sai của admin đặt cha của <b>Điện thoại</b> (2) thành <b>iPhone</b> (5) — mà iPhone lại là con của Điện thoại. Cây danh mục giờ có <b>vòng</b> 2 → 5 → 2, và câu đệ quy ngây thơ của bài trước chạy mãi không dừng (máy chấm dừng nó sau 4 giây).</p><p>Trả về <code>id, depth</code> của danh mục <b>2</b> (depth 0) và mọi danh mục đi tới được theo liên kết con, <b>mỗi danh mục một lần</b>. Thứ tự dòng không quan trọng.</p>',
      },
      yeuCau: {
        en: ['A <code>WITH RECURSIVE</code> query that terminates on this data.', 'Stop when the walk comes back to a category already on the path — PostgreSQL 14+ <code>CYCLE id SET is_cycle USING path</code>, or carry an <code>int[]</code> path yourself.', 'Do not return the repeated row.'],
        vi: ['Một truy vấn <code>WITH RECURSIVE</code> kết thúc được trên dữ liệu này.', 'Dừng khi đường đi quay lại danh mục đã có trên đường — PostgreSQL 14+ <code>CYCLE id SET is_cycle USING path</code>, hoặc tự mang một mảng <code>int[]</code> đường đi.', 'Không trả dòng bị lặp.'],
      },
      giai: `WITH RECURSIVE sub AS (
    SELECT id, 0 AS depth
    FROM category
    WHERE id = 2
  UNION ALL
    SELECT c.id, s.depth + 1
    FROM category c
    JOIN sub s ON c.parent_id = s.id
) CYCLE id SET is_cycle USING path      -- PostgreSQL 14+: marks the row that closes a loop
SELECT id, depth
FROM sub
WHERE NOT is_cycle;`,
      tuy: { timeoutMs: 4000 },
      kiem: [
        kq('Điện thoại, Android and iPhone — each once, the loop cut'),
        kqAn('A new child under Android is still found (depth 2)', "INSERT INTO category (name, parent_id) VALUES ('Android Go', 4)"),
        kqAn('Also correct when the loop is longer (2 → 4 → 9 → 2)', "INSERT INTO category (name, parent_id) VALUES ('Android Go', 4); UPDATE category SET parent_id = 9 WHERE id = 2"),
      ],
      saiMau: [
        'WITH RECURSIVE sub AS (SELECT id, 0 AS depth FROM category WHERE id = 2 UNION ALL SELECT c.id, s.depth + 1 FROM category c JOIN sub s ON c.parent_id = s.id) CYCLE id SET is_cycle USING path SELECT id, depth FROM sub',
        'WITH RECURSIVE sub AS (SELECT id, 1 AS depth FROM category WHERE id = 2 UNION ALL SELECT c.id, s.depth + 1 FROM category c JOIN sub s ON c.parent_id = s.id AND s.depth < 3) SELECT id, depth FROM sub',
      ],
      goiY: ['Without protection the recursion revisits 2, then 5, then 2… forever. UNION (instead of UNION ALL) does not help here: depth makes every row different.', 'Add after the CTE body: CYCLE id SET is_cycle USING path — then filter WHERE NOT is_cycle. Or carry ARRAY[id] AS path and only follow c.id <> ALL(s.path).'],
      loiHayGap: [
        { en: 'Capping the depth (s.depth < 10) — stops the loop but returns the cycle rows several times, and silently cuts real trees deeper than the cap.', vi: 'Chặn độ sâu (s.depth < 10) — dừng được vòng nhưng trả các dòng vòng nhiều lần, và cắt âm thầm cây thật sâu hơn mức chặn.' },
        { en: 'Using CYCLE but forgetting WHERE NOT is_cycle — the row that closes the loop (id 2 again, depth 2) stays in the result.', vi: 'Dùng CYCLE mà quên WHERE NOT is_cycle — dòng khép vòng (id 2 lần nữa, depth 2) vẫn nằm trong kết quả.' },
        { en: 'Running an unprotected recursive query on production data — it holds a backend at 100% CPU until statement_timeout (if any) kills it. Set statement_timeout for ad-hoc sessions.', vi: 'Chạy câu đệ quy không phòng vòng trên dữ liệu production — nó giữ một tiến trình ở 100% CPU tới khi statement_timeout (nếu có) giết nó. Hãy đặt statement_timeout cho phiên chạy tay.' },
      ],
      giaiThich: { en: '<p><code>CYCLE id SET is_cycle USING path</code> makes PostgreSQL keep, for every row, the array of ids visited so far; when a new row\'s id is already in that array the row is flagged <code>is_cycle = true</code> and not expanded further. Filtering it out leaves each reachable category exactly once. Before PostgreSQL 14 you write the same thing by hand: <code>ARRAY[id] AS path</code> in the anchor, <code>s.path || c.id</code> and <code>WHERE c.id &lt;&gt; ALL(s.path)</code> in the recursive member.</p>', vi: '<p><code>CYCLE id SET is_cycle USING path</code> bảo PostgreSQL giữ, cho mỗi dòng, mảng các id đã đi qua; khi id của dòng mới đã có trong mảng thì dòng đó bị đánh dấu <code>is_cycle = true</code> và không đi tiếp. Lọc bỏ nó thì mỗi danh mục đi tới được xuất hiện đúng một lần. Trước PostgreSQL 14 bạn tự viết điều đó: <code>ARRAY[id] AS path</code> ở phần neo, <code>s.path || c.id</code> và <code>WHERE c.id &lt;&gt; ALL(s.path)</code> ở phần đệ quy.</p>' },
      thuatNgu: [TN.recursive, TN.cycle],
    }),
  ],
});
