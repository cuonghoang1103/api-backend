/**
 * PostgreSQL · LAB 6 (sau Ch12) — CT Shop: đặt hàng an toàn — giao dịch, hàm, trigger, view. 5 câu × 2 điểm theo T1a/T1c/T2a/T2b/T4
 * của lab6-solution.sql trên CT Shop mini. Câu sau dùng bản CHUẨN của câu trước (cart_lines, order_total nạp sẵn).
 * "Không để lại gì khi hỏng" được kiểm bằng DO … EXCEPTION rồi đếm lại (máy chấm chạy mọi thứ trong một giao dịch).
 */
import { doiDau, KHOA, deLonPg, CT_SHOP, sau, chan, duoc, ma, tn, TN } from './_chung.mjs';

const VIEW = `CREATE VIEW stock_check AS
SELECT p.id AS product_id, p.sku, p.stock,
       coalesce(l.balance, 0) AS ledger,
       p.stock - coalesce(l.balance, 0) AS gap
FROM product p
LEFT JOIN (SELECT product_id, sum(change) AS balance FROM stock_movement GROUP BY product_id) l
       ON l.product_id = p.id;`;
const TRIGGER = `CREATE FUNCTION log_stock_change() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO stock_movement (product_id, change, reason, order_id)
  VALUES (NEW.id,
          NEW.stock - OLD.stock,
          coalesce(nullif(current_setting('ctshop.reason', true), ''), 'adjust'),
          nullif(current_setting('ctshop.order_id', true), '')::bigint);
  RETURN NULL;   -- AFTER trigger: the return value is ignored
END $$;

CREATE TRIGGER product_stock_log
  AFTER UPDATE OF stock ON product
  FOR EACH ROW
  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)   -- an ORM that rewrites stock = stock must not log a 0 change
  EXECUTE FUNCTION log_stock_change();`;
const CART = `CREATE FUNCTION cart_lines(p_items jsonb)
RETURNS TABLE (product_id bigint, qty int)
LANGUAGE sql IMMUTABLE
AS $$
  SELECT x.product_id, sum(x.qty)::int
  FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)
  GROUP BY x.product_id
$$;`;
const PLACE = `CREATE FUNCTION place_order(p_customer bigint, p_items jsonb)
RETURNS bigint
LANGUAGE plpgsql AS $$
DECLARE
  v_order bigint;
  v_line  record;
BEGIN
  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' OR p_items = '[]'::jsonb THEN
    RAISE EXCEPTION 'the cart is empty';
  END IF;
  -- lock the products ALWAYS in id order: two carts can never wait for each other in a circle
  PERFORM 1 FROM product WHERE id IN (SELECT c.product_id FROM cart_lines(p_items) c) ORDER BY id FOR UPDATE;
  FOR v_line IN
    SELECT c.product_id, c.qty, p.id AS found, p.name, p.stock, p.is_active
    FROM cart_lines(p_items) c LEFT JOIN product p ON p.id = c.product_id
    ORDER BY c.product_id
  LOOP
    IF v_line.found IS NULL THEN
      RAISE EXCEPTION 'product % does not exist', v_line.product_id;
    ELSIF NOT v_line.is_active THEN
      RAISE EXCEPTION 'product % (%) is not for sale', v_line.product_id, v_line.name;
    ELSIF v_line.stock < v_line.qty THEN
      RAISE EXCEPTION 'out of stock: % — % left, % wanted', v_line.name, v_line.stock, v_line.qty;
    END IF;
  END LOOP;
  INSERT INTO orders (customer_id) VALUES (p_customer) RETURNING id INTO v_order;
  INSERT INTO order_item (order_id, product_id, qty, unit_price)
  SELECT v_order, c.product_id, c.qty, p.price FROM cart_lines(p_items) c JOIN product p ON p.id = c.product_id;
  UPDATE product p SET stock = p.stock - c.qty FROM cart_lines(p_items) c WHERE p.id = c.product_id;
  RETURN v_order;
END $$;`;
const TOTAL = `CREATE FUNCTION order_total(p_order bigint) RETURNS numeric
LANGUAGE sql STABLE
AS $$ SELECT coalesce(sum(qty * unit_price), 0) FROM order_item WHERE order_id = p_order $$;`;
const GUARD = `CREATE FUNCTION check_payment_amount() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
  v_total numeric := order_total(NEW.order_id);
BEGIN
  IF NEW.amount <> v_total THEN
    RAISE EXCEPTION 'payment for order % is % but the order total is %', NEW.order_id, NEW.amount, v_total;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER payment_amount_guard
  BEFORE INSERT OR UPDATE OF amount, order_id ON payment
  FOR EACH ROW EXECUTE FUNCTION check_payment_amount();`;
const NEN4 = `${CT_SHOP}\n${CART}`;
const NEN5 = `${CT_SHOP}\n${TOTAL}`;
const DEM = "SELECT (SELECT count(*) FROM orders) AS orders, (SELECT count(*) FROM order_item) AS lines, (SELECT stock FROM product WHERE id = 30) AS stock_30, (SELECT stock FROM product WHERE id = 4) AS stock_4";
const thu = (call) => `DO $$ BEGIN PERFORM ${call}; EXCEPTION WHEN OTHERS THEN NULL; END $$; ${DEM}`;

export default doiDau({
  slug: 'postgresql-lab-6-dat-hang-an-toan-ct-shop',
  ten: '12.5 Lab 6 — CT Shop: safe checkout — transactions, functions, triggers, views',
  khoa: KHOA,
  baiHoc: 'postgresql-lab-6-dat-hang-an-toan-ct-shop',
  de: [
    deLonPg({
      dangBai: 'lab',
      tieuDe: { en: 'Lab 6 — CT Shop: a checkout that can never half-happen', vi: 'Lab 6 — CT Shop: một lượt thanh toán không bao giờ nửa vời' },
      doKho: 'HARD', phut: 100, diem: 100,
      khaiNiem: ['view as a reusable check', 'AFTER UPDATE trigger with WHEN', 'set-returning SQL function over jsonb', 'PL/pgSQL checkout in one call', 'lock ordering', 'BEFORE trigger guard'],
      tienQuyet: ['11.1, 11.4, 12.1–12.4 of this track'],
      the: ['postgresql', 'lab', 'plpgsql', 'trigger', 'view', 'transaction', 'ctshop'],
      csdl: CT_SHOP, tenCsdl: 'ctshop',
      thuMuc: 'RollNo_Name_PG_Lab6',
      phu: { en: 'PostgreSQL course · after Chapter 12 · Suggested time: 100 minutes · 10 marks (5 × 2)', vi: 'Khoá PostgreSQL · sau Chương 12 · Thời gian gợi ý: 100 phút · 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>CT Shop moves checkout into the database: a view that audits the stock ledger, a trigger that writes the ledger whenever stock changes, a function that turns a JSON cart into lines, the checkout function itself, and a guard on payments. Same steps as T1a, T1c, T2a, T2b and T4 of the course lab, on the mini data. From Q4 on, the earlier pieces are loaded in their reference version.</p>',
        vi: '<p>CT Shop chuyển việc thanh toán vào CSDL: một view kiểm sổ kho, một trigger ghi sổ kho mỗi khi tồn kho đổi, một hàm biến giỏ hàng JSON thành các dòng, chính hàm thanh toán, và một chốt chặn cho thanh toán. Cùng các bước T1a, T1c, T2a, T2b, T4 của lab trong khoá, trên dữ liệu mini. Từ Q4, các phần trước được nạp sẵn bản chuẩn.</p>',
      },
      yeuCauChung: [
        { en: 'Exact object names (stock_check, product_stock_log, cart_lines, place_order, payment_amount_guard) — the checks call them.', vi: 'Đúng tên đối tượng (stock_check, product_stock_log, cart_lines, place_order, payment_amount_guard) — các kiểm gọi chúng.' },
        { en: 'A failure must leave nothing behind: the checks catch your error and count orders, lines and stock again.', vi: 'Hỏng thì không để lại gì: các kiểm bắt lỗi của bạn rồi đếm lại đơn, dòng và tồn kho.' },
      ],
      moHinh: [
        { ten: 'product / stock_movement', truong: [['product.stock', 'int', '≥ 0'], ['stock_movement.change', 'int', '≠ 0'], ['stock_movement.reason', 'text', 'import|sale|return|adjust'], ['stock_movement.order_id', 'bigint', 'optional']] },
        { ten: 'orders / order_item / payment', truong: [['orders.customer_id', 'bigint', ''], ['order_item (order_id, product_id)', 'PK', 'unit_price = price at purchase'], ['payment.order_id', 'bigint', 'UNIQUE'], ['payment.amount', 'numeric(12,2)', 'must equal the order total']] },
      ],
      cau: [
        {
          ten: { en: 'T1a · the stock_check view', vi: 'T1a · view stock_check' }, diem: 2,
          moTa: { en: 'Create <code>stock_check (product_id, sku, stock, ledger, gap)</code>: ledger = Σ stock_movement.change of the product (0 if none), gap = stock − ledger.', vi: 'Tạo <code>stock_check (product_id, sku, stock, ledger, gap)</code>: ledger = Σ stock_movement.change của sản phẩm (0 nếu không có), gap = stock − ledger.' },
          yeuCau: [{ en: 'Every product appears (LEFT JOIN a pre-aggregated ledger).', vi: 'Mọi sản phẩm đều xuất hiện (LEFT JOIN sổ kho đã tổng hợp trước).' }],
          giai: VIEW,
          kiem: [
            sau(['T1a · the products with a ledger', 'T1a · các sản phẩm có sổ kho'], 'SELECT * FROM stock_check WHERE ledger <> 0 ORDER BY product_id', { thuTu: true }),
            sau(['T1a · how many products mismatch', 'T1a · bao nhiêu sản phẩm lệch'], 'SELECT count(*) AS products, count(*) FILTER (WHERE gap <> 0) AS mismatched FROM stock_check'),
            sau(['T1a · it is a view (always current)', 'T1a · đó là view (luôn mới)'], "INSERT INTO stock_movement (product_id, change, reason) VALUES (7, 200, 'import'); SELECT gap FROM stock_check WHERE product_id = 7", { an: true }),
          ],
          saiMau: ['CREATE VIEW stock_check AS SELECT p.id AS product_id, p.sku, p.stock, sum(m.change) AS ledger, p.stock - sum(m.change) AS gap FROM product p JOIN stock_movement m ON m.product_id = p.id GROUP BY p.id'],
        },
        {
          ten: { en: 'T1c · the ledger trigger', vi: 'T1c · trigger sổ kho' }, diem: 2,
          moTa: { en: 'Trigger <code>product_stock_log</code>: AFTER UPDATE OF stock, one stock_movement row (change = new − old) per product whose stock really changed. The reason comes from <code>current_setting(\'ctshop.reason\', true)</code>, default <code>adjust</code>; order_id from <code>ctshop.order_id</code>.', vi: 'Trigger <code>product_stock_log</code>: AFTER UPDATE OF stock, mỗi sản phẩm có tồn kho thật sự đổi thì một dòng stock_movement (change = mới − cũ). Lý do lấy từ <code>current_setting(\'ctshop.reason\', true)</code>, mặc định <code>adjust</code>; order_id lấy từ <code>ctshop.order_id</code>.' },
          yeuCau: [{ en: '<code>WHEN (OLD.stock IS DISTINCT FROM NEW.stock)</code> — an UPDATE that rewrites stock = stock must not log (change = 0 breaks the CHECK).', vi: '<code>WHEN (OLD.stock IS DISTINCT FROM NEW.stock)</code> — UPDATE ghi lại stock = stock không được ghi sổ (change = 0 phạm CHECK).' }],
          giai: TRIGGER,
          kiem: [
            sau(['T1c · a quick fix is logged as adjust', 'T1c · sửa nhanh được ghi là adjust'], "UPDATE product SET stock = stock - 2 WHERE id = 4; SELECT product_id, change, reason, order_id FROM stock_movement WHERE id > 7 ORDER BY id", { thuTu: true }),
            sau(['T1c · a delivery says why', 'T1c · lô hàng nói rõ lý do'], "SELECT set_config('ctshop.reason', 'import', true); UPDATE product SET stock = stock + 50 WHERE id IN (1, 25); SELECT product_id, change, reason FROM stock_movement WHERE id > 7 ORDER BY id", { thuTu: true }),
            duoc(['T1c · saving the whole product with stock unchanged works and logs nothing', 'T1c · lưu cả sản phẩm với tồn kho không đổi thì chạy và không ghi sổ'], 'UPDATE product SET price = 760000, stock = stock WHERE id = 31'),
            sau(['T1c · …nothing logged', 'T1c · …không ghi sổ'], "UPDATE product SET price = 760000, stock = stock WHERE id = 31; SELECT count(*) AS new_rows FROM stock_movement WHERE id > 7", { an: true }),
          ],
          saiMau: [TRIGGER.replace('  WHEN (OLD.stock IS DISTINCT FROM NEW.stock)   -- an ORM that rewrites stock = stock must not log a 0 change\n', '')],
        },
        {
          ten: { en: 'T2a · cart_lines(jsonb)', vi: 'T2a · cart_lines(jsonb)' }, diem: 2,
          moTa: { en: 'Create <code>cart_lines(p_items jsonb) RETURNS TABLE (product_id bigint, qty int)</code>: one row per product, quantities of repeated products added up. Input: <code>[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]</code>.', vi: 'Tạo <code>cart_lines(p_items jsonb) RETURNS TABLE (product_id bigint, qty int)</code>: mỗi sản phẩm một dòng, cộng dồn số lượng của sản phẩm lặp lại. Đầu vào: <code>[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]</code>.' },
          yeuCau: [{ en: '<code>jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)</code> + GROUP BY; IMMUTABLE.', vi: '<code>jsonb_to_recordset(p_items) AS x(product_id bigint, qty int)</code> + GROUP BY; IMMUTABLE.' }],
          giai: CART,
          kiem: [
            sau(['T2a · the sample cart', 'T2a · giỏ mẫu'], `SELECT * FROM cart_lines('[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') ORDER BY product_id`, { thuTu: true }),
            sau(['T2a · declared IMMUTABLE', 'T2a · khai báo IMMUTABLE'], "SELECT provolatile FROM pg_proc WHERE proname = 'cart_lines'"),
            sau(['T2a · a bigger cart', 'T2a · giỏ lớn hơn'], `SELECT * FROM cart_lines('[{"product_id": 1, "qty": 5}, {"product_id": 19, "qty": 1}, {"product_id": 1, "qty": 5}, {"product_id": 43, "qty": 2}]') ORDER BY product_id`, { thuTu: true, an: true }),
          ],
          saiMau: ['CREATE FUNCTION cart_lines(p_items jsonb) RETURNS TABLE (product_id bigint, qty int) LANGUAGE sql IMMUTABLE AS $$ SELECT x.product_id, x.qty FROM jsonb_to_recordset(p_items) AS x(product_id bigint, qty int) $$'],
        },
        {
          ten: { en: 'T2b · place_order(customer, items)', vi: 'T2b · place_order(customer, items)' }, diem: 2,
          moTa: { en: 'Create <code>place_order(p_customer bigint, p_items jsonb) RETURNS bigint</code> (cart_lines is loaded): validate the cart, lock the products in id order, refuse unknown / inactive / out-of-stock products with RAISE EXCEPTION, then insert the order, its lines at the current price, decrease stock, and return the new order id. Any failure leaves nothing behind.', vi: 'Tạo <code>place_order(p_customer bigint, p_items jsonb) RETURNS bigint</code> (cart_lines đã nạp): kiểm giỏ, khoá sản phẩm theo thứ tự id, từ chối sản phẩm không tồn tại / ngừng bán / hết hàng bằng RAISE EXCEPTION, rồi chèn đơn, các dòng với giá hiện tại, giảm tồn kho, và trả id đơn mới. Hỏng ở đâu cũng không để lại gì.' },
          yeuCau: [{ en: 'Checks before writes; <code>SELECT … ORDER BY id FOR UPDATE</code> before checking stock.', vi: 'Kiểm trước khi ghi; <code>SELECT … ORDER BY id FOR UPDATE</code> trước khi kiểm tồn kho.' }],
          giai: PLACE,
          kiem: [
            { ...sau(['T2b · customer 8 buys 1 Moleskine + 3 gel pens', 'T2b · khách 8 mua 1 Moleskine + 3 bút gel'], `SELECT place_order(8, '[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 2}, {"product_id": 4, "qty": 1}]') AS order_id; SELECT o.id, o.customer_id, o.status, oi.product_id, oi.qty, oi.unit_price FROM orders o JOIN order_item oi ON oi.order_id = o.id WHERE o.id = 15 ORDER BY oi.product_id`, { thuTu: true }), csdl: NEN4 },
            { ...sau(['T2b · stock went down', 'T2b · tồn kho đã giảm'], `SELECT place_order(8, '[{"product_id": 30, "qty": 1}, {"product_id": 4, "qty": 3}]'); ${DEM}`), csdl: NEN4 },
            { ...chan(['T2b · out of stock is refused', 'T2b · hết hàng bị từ chối'], `SELECT place_order(8, '[{"product_id": 30, "qty": 7}]')`, 'P0001'), csdl: NEN4 },
            { ...sau(['T2b · a refused cart leaves nothing behind', 'T2b · giỏ bị từ chối không để lại gì'], thu(`place_order(8, '[{"product_id": 4, "qty": 1}, {"product_id": 30, "qty": 7}]')`)), csdl: NEN4 },
            { ...chan(['T2b · an inactive product is refused', 'T2b · sản phẩm ngừng bán bị từ chối'], `SELECT place_order(8, '[{"product_id": 36, "qty": 1}]')`, 'P0001'), csdl: NEN4, an: true },
            { ...chan(['T2b · an unknown product is refused', 'T2b · sản phẩm không tồn tại bị từ chối'], `SELECT place_order(8, '[{"product_id": 999, "qty": 1}]')`, 'P0001'), csdl: NEN4, an: true },
            { ...chan(['T2b · an empty cart is refused', 'T2b · giỏ rỗng bị từ chối'], `SELECT place_order(8, '[]')`, 'P0001'), csdl: NEN4, an: true },
            { ...ma(['T2b · locks with FOR UPDATE', 'T2b · khoá bằng FOR UPDATE'], 'FOR\\s+UPDATE') },
          ],
          saiMau: [PLACE.replace(`    ELSIF v_line.stock < v_line.qty THEN
      RAISE EXCEPTION 'out of stock: % — % left, % wanted', v_line.name, v_line.stock, v_line.qty;
`, '')],
        },
        {
          ten: { en: 'T4 · a payment must match the order total', vi: 'T4 · thanh toán phải khớp tổng đơn' }, diem: 2,
          moTa: { en: 'With <code>order_total(order_id)</code> loaded, create the BEFORE INSERT OR UPDATE trigger <code>payment_amount_guard</code> on payment that raises an exception when <code>NEW.amount</code> differs from the order total.', vi: 'Với <code>order_total(order_id)</code> đã nạp, tạo trigger BEFORE INSERT OR UPDATE <code>payment_amount_guard</code> trên payment báo lỗi khi <code>NEW.amount</code> khác tổng đơn.' },
          yeuCau: [{ en: 'Function returns NEW when the amount is right (a BEFORE trigger returning NULL would silently drop the payment).', vi: 'Hàm trả NEW khi số tiền đúng (trigger BEFORE trả NULL sẽ lặng lẽ vứt thanh toán).' }],
          giai: GUARD,
          kiem: [
            { ...chan(['T4 · a tampered amount is refused', 'T4 · số tiền bị sửa bị từ chối'], "INSERT INTO payment (order_id, amount, method) VALUES (7, 50000, 'momo')", 'P0001'), csdl: NEN5 },
            { ...sau(['T4 · the exact amount is accepted and stored', 'T4 · đúng số tiền thì được nhận và lưu'], "INSERT INTO payment (order_id, amount, method) VALUES (7, 95000, 'momo'); SELECT order_id, amount FROM payment WHERE order_id = 7"), csdl: NEN5 },
            { ...chan(['T4 · changing a stored amount is refused', 'T4 · sửa số tiền đã lưu bị từ chối'], "UPDATE payment SET amount = 1000 WHERE order_id = 1", 'P0001'), csdl: NEN5, an: true },
          ],
          saiMau: [GUARD.replace('  RETURN NEW;', '  RETURN NULL;'), GUARD.replace('BEFORE INSERT OR UPDATE OF amount, order_id ON payment', 'BEFORE INSERT ON payment')],
        },
      ],
      truDiem: [
        { en: 'Checking stock in the application or in a SELECT without FOR UPDATE (two checkouts both see "1 left").', vi: 'Kiểm tồn kho ở ứng dụng hoặc bằng SELECT không FOR UPDATE (hai lượt thanh toán đều thấy "còn 1").' },
        { en: 'Catching and swallowing errors inside place_order — a half order survives.', vi: 'Bắt rồi nuốt lỗi bên trong place_order — một đơn nửa vời sống sót.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql (T1a, T1c, T2a, T2b, T4). <b>Run</b> = sample checks; <b>Submit</b> = every check and the 10-mark table.',
        vi: 'Các tab Q1.sql … Q5.sql (T1a, T1c, T2a, T2b, T4). <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10.',
      },
      thuatNgu: [TN.txn, tn('trigger', 'bẫy sự kiện'), tn('set_config(…, true)', 'thiết lập riêng cho giao dịch'), tn('jsonb_to_recordset', 'biến mảng JSON thành dòng')],
      goiY: [
        { en: 'T1c: current_setting(name, true) returns NULL instead of an error when the setting was never set.', vi: 'T1c: current_setting(tên, true) trả NULL thay vì lỗi khi thiết lập chưa từng được đặt.' },
        { en: 'T2b: validate everything first, then write — and never catch the exception you raise.', vi: 'T2b: kiểm mọi thứ trước rồi mới ghi — và đừng bao giờ bắt ngoại lệ mà chính bạn ném ra.' },
        { en: 'T4: BEFORE INSERT OR UPDATE OF amount, order_id — the guard must also cover updates.', vi: 'T4: BEFORE INSERT OR UPDATE OF amount, order_id — chốt chặn phải phủ cả lệnh cập nhật.' },
      ],
      loiHayGap: [
        { en: 'T1a INNER JOIN on the ledger — products without movements vanish from the audit.', vi: 'T1a INNER JOIN với sổ kho — sản phẩm chưa có biến động biến mất khỏi bảng kiểm.' },
        { en: 'T1c no WHEN clause — "UPDATE … SET price = …, stock = stock" fails because change = 0 breaks the CHECK.', vi: 'T1c thiếu WHEN — "UPDATE … SET price = …, stock = stock" hỏng vì change = 0 phạm CHECK.' },
        { en: 'T2b relying on the CHECK (stock ≥ 0) alone — the order row is written before the error, and the message is useless to the customer.', vi: 'T2b chỉ dựa vào CHECK (stock ≥ 0) — dòng đơn đã được ghi trước khi lỗi, và thông báo vô dụng với khách.' },
      ],
      giaiThich: { en: '<p>Reference solutions are the T1a, T1c, T2a, T2b and T4 blocks of <code>lab6-solution.sql</code>, adapted to the mini data. Everything runs inside the caller\'s transaction, so any RAISE undoes the whole checkout.</p>', vi: '<p>Lời giải chuẩn là các khối T1a, T1c, T2a, T2b, T4 của <code>lab6-solution.sql</code>, chỉnh theo dữ liệu mini. Mọi thứ chạy trong giao dịch của người gọi, nên mọi RAISE đều huỷ cả lượt thanh toán.</p>' },
    }),
  ],
});
