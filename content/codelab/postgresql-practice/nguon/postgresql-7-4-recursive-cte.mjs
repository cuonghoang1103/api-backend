/**
 * PostgreSQL · 7.4 — CTE đệ quy: đi xuống cây danh mục, dựng breadcrumb, chống vòng lặp (CYCLE), gộp theo cây.
 * Viết lại 01/11/2026 trên CT Shop mini + một nhánh "Điện tử" 3 tầng (CT Shop mở thêm ngành hàng) — giữ tiêu đề 3 đề cũ.
 * Đề vòng lặp: câu đệ quy ngây thơ chạy mãi ⇒ máy chấm trình duyệt dừng worker sau timeoutMs (4 s). Không đưa câu vô hạn
 * vào saiMau (bộ xuất Node không có giới hạn giờ).
 */
import { mod, pg, kq, kqAn, ma, CT_SHOP, LUOC_DO_CT_SHOP, pre, TN } from './_chung.mjs';

const CAY = `${CT_SHOP}

-- CT Shop opens an electronics department: a three-level branch under a new root
INSERT INTO category (id, name, parent_id) OVERRIDING SYSTEM VALUE VALUES
  (13, 'Điện tử', NULL), (14, 'Tai nghe', 13), (15, 'Bàn phím & chuột', 13),
  (16, 'Bàn phím cơ', 15), (17, 'Chuột không dây', 15);
SELECT setval(pg_get_serial_sequence('category', 'id'), 17);`;
const VONG = `${CAY}

-- data bug: someone moved "Bàn phím & chuột" (15) under "Bàn phím cơ" (16), which is its own child ⇒ a cycle 15 → 16 → 15
UPDATE category SET parent_id = 16 WHERE id = 15;`;
const LD_CAY = {
  en: LUOC_DO_CT_SHOP.en + `<p>This module adds an electronics branch to the category tree:</p>${pre('13 Điện tử (root)\n├── 14 Tai nghe\n└── 15 Bàn phím & chuột\n    ├── 16 Bàn phím cơ\n    └── 17 Chuột không dây')}`,
  vi: LUOC_DO_CT_SHOP.vi + `<p>Module này thêm một nhánh điện tử vào cây danh mục:</p>${pre('13 Điện tử (gốc)\n├── 14 Tai nghe\n└── 15 Bàn phím & chuột\n    ├── 16 Bàn phím cơ\n    └── 17 Chuột không dây')}`,
};
const O = { csdl: CAY, tenCsdl: 'ctshop-tree', ld: LD_CAY };
const T = { thuTu: true };

export default mod('postgresql-7-4-recursive-cte', '7.4 Recursive CTEs: walking a hierarchy', [
  pg({
    ...O, t: 'Everything under "Điện tử", with its depth', k: 'MEDIUM', p: 10, kn: ['WITH RECURSIVE', 'anchor + recursive member', 'UNION ALL', 'depth counter'], tag: ['cte', 'recursive', 'hierarchy', 'ctshop'],
    en: '<p>The menu "Điện tử" must show every category below it, at any depth. Return <code>id, name, depth</code> for category 13 (<b>Điện tử</b>, depth 0) and all its descendants (children depth 1, grandchildren depth 2, …). Row order does not matter.</p>',
    vi: '<p>Menu "Điện tử" phải hiện mọi danh mục bên dưới nó, ở bất kỳ độ sâu nào. Trả về <code>id, name, depth</code> cho danh mục 13 (<b>Điện tử</b>, depth 0) và mọi hậu duệ (con depth 1, cháu depth 2, …). Thứ tự dòng không quan trọng.</p>',
    yc: [['One <code>WITH RECURSIVE</code> query.', 'Một truy vấn <code>WITH RECURSIVE</code>.'], ['Anchor: category 13 with depth 0. Recursive member: children of the rows found so far, depth + 1.', 'Neo: danh mục 13 với depth 0. Phần đệ quy: con của các dòng đã tìm được, depth + 1.'], ['It must work for ANY depth — no fixed number of self-joins.', 'Phải đúng với MỌI độ sâu — không nối cứng một số lần.']],
    giai: `WITH RECURSIVE sub AS (
    SELECT id, name, 0 AS depth          -- anchor: where the walk starts
    FROM category
    WHERE id = 13
  UNION ALL
    SELECT c.id, c.name, s.depth + 1     -- recursive member: one level further down
    FROM category c
    JOIN sub s ON c.parent_id = s.id
)
SELECT id, name, depth FROM sub;`,
    kiem: [
      kq(['Điện tử and its 4 descendants with the right depth', 'Điện tử và 4 hậu duệ với đúng độ sâu']),
      kqAn(['A fourth level appears (Bàn phím cơ → Keycap)', 'Xuất hiện tầng thứ tư (Bàn phím cơ → Keycap)'], "INSERT INTO category (name, parent_id) VALUES ('Keycap', 16)"),
      ma(['Uses WITH RECURSIVE', 'Dùng WITH RECURSIVE'], '\\bWITH\\s+RECURSIVE\\b'),
    ],
    sai: ['SELECT c.id, c.name, 1 AS depth FROM category c WHERE c.parent_id = 13', 'WITH RECURSIVE sub AS (SELECT id, name, 1 AS depth FROM category WHERE id = 13 UNION ALL SELECT c.id, c.name, s.depth + 1 FROM category c JOIN sub s ON c.parent_id = s.id) SELECT id, name, depth FROM sub'],
    gy: [['WITH RECURSIVE sub AS ( anchor UNION ALL recursive ) SELECT … FROM sub.', 'WITH RECURSIVE sub AS ( neo UNION ALL đệ quy ) SELECT … FROM sub.'], ['The recursive member joins category to sub: c.parent_id = s.id ("children of what I already have").', 'Phần đệ quy nối category với sub: c.parent_id = s.id ("con của những gì đã có").']],
    lhg: [['Joining the wrong way round (c.id = s.parent_id) — the walk goes UP to the parents instead of down to the children.', 'Nối ngược chiều (c.id = s.parent_id) — đi LÊN cha thay vì đi xuống con.'], ['Two or three fixed LEFT JOINs instead of recursion — correct today, silently wrong the day the tree gets one level deeper.', 'Hai, ba LEFT JOIN cố định thay cho đệ quy — hôm nay đúng, ngày cây sâu thêm một tầng là sai âm thầm.']],
    gt: ['<p>PostgreSQL runs the anchor once, then repeats the recursive member on the rows produced by the previous round until a round returns nothing. Each round is one level deeper, so <code>depth + 1</code> counts levels.</p>', '<p>PostgreSQL chạy phần neo một lần, rồi lặp phần đệ quy trên các dòng vòng trước sinh ra cho tới khi một vòng không trả gì. Mỗi vòng sâu thêm một tầng, nên <code>depth + 1</code> đếm tầng.</p>'],
    tn: [TN.cte, TN.recursive],
  }),

  pg({
    ...O, t: 'Breadcrumbs for every category', k: 'MEDIUM', p: 10, kn: ['WITH RECURSIVE from the roots', 'string concatenation ||'], tag: ['cte', 'recursive', 'string', 'ctshop'],
    en: '<p>Every product page shows a breadcrumb such as <code>Điện tử &gt; Bàn phím &amp; chuột &gt; Bàn phím cơ</code>. Return <code>id, path</code> for <b>every</b> category, where <code>path</code> is the chain of names from its root down to it, joined by <code>" &gt; "</code>. Order by <code>id</code>.</p>',
    vi: '<p>Mỗi trang sản phẩm hiện đường dẫn kiểu <code>Điện tử &gt; Bàn phím &amp; chuột &gt; Bàn phím cơ</code>. Trả về <code>id, path</code> cho <b>mọi</b> danh mục, trong đó <code>path</code> là chuỗi tên từ gốc xuống tới nó, nối bằng <code>" &gt; "</code>. Sắp theo <code>id</code>.</p>',
    yc: [['Start from the roots (<code>parent_id IS NULL</code>) and walk down.', 'Bắt đầu từ các gốc (<code>parent_id IS NULL</code>) rồi đi xuống.'], ['Separator: space, &gt;, space.', 'Dấu nối: dấu cách, &gt;, dấu cách.'], ['Order by id.', 'Sắp theo id.']],
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
      kq(['17 categories with their full path', '17 danh mục với đường dẫn đầy đủ'], T),
      kqAn(['A new fourth-level category gets a 4-part path', 'Danh mục tầng bốn mới có đường dẫn 4 phần'], "INSERT INTO category (name, parent_id) VALUES ('Keycap', 16)", T),
      ma(['Uses WITH RECURSIVE', 'Dùng WITH RECURSIVE'], '\\bWITH\\s+RECURSIVE\\b'),
    ],
    sai: ["SELECT c.id, COALESCE(p.name || ' > ', '') || c.name AS path FROM category c LEFT JOIN category p ON p.id = c.parent_id ORDER BY c.id", "WITH RECURSIVE tree AS (SELECT id, name::text AS path FROM category WHERE parent_id IS NULL UNION ALL SELECT c.id, c.name || ' > ' || t.path FROM category c JOIN tree t ON c.parent_id = t.id) SELECT id, path FROM tree ORDER BY id"],
    gy: [['The anchor rows are the roots, their path is just their name.', 'Dòng neo là các gốc, đường dẫn của chúng chỉ là tên.'], ['Each recursive step appends: <code>t.path || \' &gt; \' || c.name</code>.', 'Mỗi bước đệ quy nối thêm: <code>t.path || \' &gt; \' || c.name</code>.']],
    lhg: [['One self-join (parent + name) — the third level loses its grandparent.', 'Một lần tự nối (cha + tên) — tầng ba mất ông.'], ['Prepending instead of appending — the breadcrumb reads backwards.', 'Nối vào đầu thay vì vào cuối — đường dẫn đọc ngược.']],
    gt: ['<p>Walking top-down lets every row inherit its parent\'s path. The cast <code>name::text</code> in the anchor fixes the column type for the whole recursion.</p>', '<p>Đi từ trên xuống cho mỗi dòng thừa hưởng đường dẫn của cha. Phép ép <code>name::text</code> ở phần neo cố định kiểu cột cho cả vòng đệ quy.</p>'],
    tn: [TN.recursive],
  }),

  pg({
    csdl: VONG, tenCsdl: 'ctshop-tree-bug', ld: { en: LD_CAY.en + '<p><b>Data bug in this task:</b> category 15 now points to 16 as its parent, and 16 points to 15 — a cycle.</p>', vi: LD_CAY.vi + '<p><b>Lỗi dữ liệu trong bài này:</b> danh mục 15 giờ trỏ cha là 16, mà 16 trỏ cha là 15 — một vòng lặp.</p>' },
    t: 'Walk a tree that contains a cycle', k: 'HARD', p: 14, kn: ['CYCLE … SET … USING', 'runaway recursion'], tag: ['cte', 'recursive', 'cycle', 'ctshop'],
    tuy: { timeoutMs: 4000 },
    en: '<p>A data bug created a cycle 15 → 16 → 15. A naive walk down from <b>Bàn phím &amp; chuột</b> (15) never stops (the grader kills it after 4 s). Return <code>id, name, depth</code> of category 15 (depth 0) and everything reachable below it, each category <b>once</b>, stopping when the walk comes back to a category it already visited. Use PostgreSQL\'s <code>CYCLE</code> clause.</p>',
    vi: '<p>Một lỗi dữ liệu tạo vòng 15 → 16 → 15. Đi xuống ngây thơ từ <b>Bàn phím &amp; chuột</b> (15) không bao giờ dừng (máy chấm diệt nó sau 4 giây). Trả về <code>id, name, depth</code> của danh mục 15 (depth 0) và mọi thứ đi tới được bên dưới, mỗi danh mục <b>một lần</b>, dừng khi đường đi quay lại danh mục đã qua. Dùng mệnh đề <code>CYCLE</code> của PostgreSQL.</p>',
    yc: [['<code>WITH RECURSIVE … ( … ) CYCLE id SET is_cycle USING path</code>.', '<code>WITH RECURSIVE … ( … ) CYCLE id SET is_cycle USING path</code>.'], ['Keep only the rows where <code>NOT is_cycle</code>.', 'Chỉ giữ các dòng có <code>NOT is_cycle</code>.']],
    giai: `WITH RECURSIVE sub AS (
    SELECT id, name, 0 AS depth
    FROM category
    WHERE id = 15
  UNION ALL
    SELECT c.id, c.name, s.depth + 1
    FROM category c
    JOIN sub s ON c.parent_id = s.id
) CYCLE id SET is_cycle USING path      -- marks a row whose id is already on its path, and stops there
SELECT id, name, depth
FROM sub
WHERE NOT is_cycle;`,
    kiem: [
      kq(['15, 16, 17 once each', '15, 16, 17 mỗi cái một lần']),
      kqAn(['A longer cycle (17 → 15) is also stopped', 'Vòng dài hơn (17 → 15) cũng bị chặn'], 'UPDATE category SET parent_id = 17 WHERE id = 15'),
      ma(['Uses CYCLE (or a visited-path array)', 'Dùng CYCLE (hoặc mảng đường đã đi)'], '\\bCYCLE\\s+\\w+\\s+SET\\b|<>\\s*ALL\\s*\\(|NOT\\s+\\w+\\s*=\\s*ANY\\s*\\('),
    ],
    sai: ['WITH RECURSIVE sub AS (SELECT id, name, 0 AS depth FROM category WHERE id = 15 UNION ALL SELECT c.id, c.name, s.depth + 1 FROM category c JOIN sub s ON c.parent_id = s.id) CYCLE id SET is_cycle USING path SELECT id, name, depth FROM sub', 'SELECT id, name, 0 AS depth FROM category WHERE id = 15'],
    gy: [['Without protection the recursive member keeps finding 15 again under 16.', 'Không có bảo vệ, phần đệ quy cứ tìm lại 15 dưới 16.'], ['CYCLE id SET is_cycle USING path adds two columns: is_cycle (true on the repeating row) and path (the ids so far).', 'CYCLE id SET is_cycle USING path thêm hai cột: is_cycle (true ở dòng lặp lại) và path (các id đã đi).']],
    lhg: [['UNION instead of UNION ALL "to remove duplicates" — rows differ by depth, so the loop goes on forever.', 'UNION thay UNION ALL "để bỏ trùng" — các dòng khác nhau ở depth nên vòng lặp vẫn chạy mãi.'], ['Using CYCLE but not filtering <code>NOT is_cycle</code> — the repeated category appears twice.', 'Dùng CYCLE mà không lọc <code>NOT is_cycle</code> — danh mục lặp lại xuất hiện hai lần.']],
    gt: ['<p>CYCLE (PostgreSQL 14+) tracks the path of each row; when a row\'s id is already on its path it is flagged and not expanded further. Real trees get corrupted by imports and admin tools — production recursive queries should always be cycle-safe.</p>', '<p>CYCLE (PostgreSQL 14+) theo dõi đường đi của từng dòng; khi id của dòng đã nằm trên đường đi, nó bị đánh dấu và không mở rộng tiếp. Cây thật bị hỏng vì nhập liệu và công cụ quản trị — truy vấn đệ quy trên production luôn phải chống vòng.</p>'],
    tn: [TN.recursive, TN.cycle],
  }),

  pg({
    ...O, t: 'Products under each root, at any depth', k: 'HARD', p: 15, kn: ['recursive CTE carrying the root', 'join + aggregate on a hierarchy'], tag: ['cte', 'recursive', 'aggregate', 'ctshop'],
    en: '<p>The category page of each <b>root</b> shows how many active products live anywhere below it. Return <code>root_id, root, products</code> for every root (0 when none), ordered by root_id.</p>',
    vi: '<p>Trang danh mục của mỗi <b>gốc</b> hiện có bao nhiêu sản phẩm đang bán nằm ở bất kỳ đâu bên dưới nó. Trả về <code>root_id, root, products</code> cho mọi gốc (0 nếu không có), sắp theo root_id.</p>',
    yc: [['The recursion carries the root id down: anchor <code>SELECT id, id AS root_id …</code>, recursive member keeps <code>t.root_id</code>.', 'Đệ quy mang id gốc xuống dưới: neo <code>SELECT id, id AS root_id …</code>, phần đệ quy giữ <code>t.root_id</code>.'], ['LEFT JOIN products so an empty root shows 0.', 'LEFT JOIN sản phẩm để gốc rỗng hiện 0.']],
    giai: `WITH RECURSIVE tree AS (
    SELECT id, id AS root_id                 -- every root is its own root
    FROM category WHERE parent_id IS NULL
  UNION ALL
    SELECT c.id, t.root_id                   -- children inherit the root of their parent
    FROM category c JOIN tree t ON c.parent_id = t.id
)
SELECT r.id AS root_id, r.name AS root,
       count(p.id) AS products
FROM category r
JOIN tree t           ON t.root_id = r.id
LEFT JOIN product p   ON p.category_id = t.id AND p.is_active
WHERE r.parent_id IS NULL
GROUP BY r.id, r.name
ORDER BY r.id;`,
    kiem: [
      kq(['Five roots, Điện tử with 0', 'Năm gốc, Điện tử có 0'], T),
      kqAn(['Products arrive on level 3 of Điện tử', 'Sản phẩm về ở tầng 3 của Điện tử'], "INSERT INTO product (sku, name, category_id, price) VALUES ('CT1601', 'Bàn phím cơ AKKO', 16, 890000), ('CT1701', 'Chuột Logitech M331', 17, 350000), ('CT1401', 'Tai nghe Sony', 14, 490000)", T),
      ma(['Uses WITH RECURSIVE', 'Dùng WITH RECURSIVE'], '\\bWITH\\s+RECURSIVE\\b'),
    ],
    sai: ['SELECT r.id AS root_id, r.name AS root, count(p.id) AS products FROM category r LEFT JOIN category c ON c.parent_id = r.id LEFT JOIN product p ON p.category_id = c.id AND p.is_active WHERE r.parent_id IS NULL GROUP BY r.id, r.name ORDER BY r.id', 'WITH RECURSIVE tree AS (SELECT id, id AS root_id FROM category WHERE parent_id IS NULL UNION ALL SELECT c.id, t.root_id FROM category c JOIN tree t ON c.parent_id = t.id) SELECT r.id AS root_id, r.name AS root, count(*) AS products FROM category r JOIN tree t ON t.root_id = r.id LEFT JOIN product p ON p.category_id = t.id AND p.is_active WHERE r.parent_id IS NULL GROUP BY r.id, r.name ORDER BY r.id'],
    gy: [['Carry the information you need (the root) along the recursion.', 'Mang theo thông tin cần (gốc) dọc đường đệ quy.'], ['count(p.id), not count(*), after the LEFT JOIN.', 'count(p.id), không phải count(*), sau LEFT JOIN.']],
    lhg: [['One self-join (root → child): products two levels down are missed.', 'Một lần tự nối (gốc → con): sản phẩm sâu hai tầng bị bỏ sót.'], ['count(*) counts every category of the subtree, product or not.', 'count(*) đếm mọi danh mục trong cây con, có sản phẩm hay không.']],
    gt: ['<p>Recursive CTEs can carry columns along the walk (here the root id), turning a hierarchy into a flat (category, root) map you can join and aggregate normally.</p>', '<p>CTE đệ quy mang được cột dọc đường đi (ở đây là id gốc), biến cây thành bảng phẳng (danh mục, gốc) để nối và tổng hợp như bình thường.</p>'],
    tn: [TN.recursive],
  }),
]);
