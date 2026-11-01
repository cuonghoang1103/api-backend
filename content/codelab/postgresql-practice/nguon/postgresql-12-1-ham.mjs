/** PostgreSQL · 12.1 — Hàm: SQL, PL/pgSQL và volatility. Bảng users/notes của bài + CT Shop mini. */
import { mod, pg, cs, q, bang1, kq, sau, chan, ma, tn } from './_chung.mjs';
import { O_NOTES12 } from './_du-lieu.mjs';

const XEP = `CREATE FUNCTION xep_hang(v int) RETURNS text
  LANGUAGE plpgsql IMMUTABLE
AS $$
BEGIN
  IF v >= 80 THEN RETURN 'viral';
  ELSIF v >= 40 THEN RETURN 'popular';
  ELSIF v > 0 THEN RETURN 'seen';
  ELSE RETURN 'unread';
  END IF;
END;
$$;`;

export default mod('postgresql-12-1-ham', '12.1 Functions: SQL, PL/pgSQL and volatility', [
  pg({
    ...O_NOTES12, t: 'A SQL function: note_count(uid)', k: 'EASY', p: 6, kn: ['CREATE FUNCTION … LANGUAGE sql', 'STABLE'], tag: ['function'],
    en: '<p>Create <code>note_count(uid int) RETURNS bigint</code> written in plain SQL that returns how many notes a user has. It reads a table, so declare it <code>STABLE</code>.</p>',
    vi: '<p>Tạo <code>note_count(uid int) RETURNS bigint</code> viết bằng SQL thuần, trả về số ghi chú của một user. Nó đọc bảng nên khai báo <code>STABLE</code>.</p>',
    yc: [['<code>LANGUAGE sql STABLE AS $$ SELECT count(*) FROM notes WHERE user_id = uid $$</code>.', '<code>LANGUAGE sql STABLE AS $$ SELECT count(*) FROM notes WHERE user_id = uid $$</code>.'], ['Return type bigint (what count(*) returns).', 'Kiểu trả về bigint (kiểu của count(*)).']],
    giai: `CREATE FUNCTION note_count(uid int) RETURNS bigint
  LANGUAGE sql STABLE              -- reads tables: same answer within one statement, not forever
  AS $$ SELECT count(*) FROM notes WHERE user_id = uid $$;`,
    kiem: [
      sau(['note_count for users 1, 2 and an unknown user', 'note_count cho user 1, 2 và một user không tồn tại'], 'SELECT note_count(1) AS u1, note_count(2) AS u2, note_count(999) AS nobody'),
      sau(['Volatility is STABLE', 'Volatility là STABLE'], "SELECT provolatile FROM pg_proc WHERE proname = 'note_count'"),
      sau(['Follows new data', 'Theo kịp dữ liệu mới'], "INSERT INTO notes (user_id, title) VALUES (1, 'x'), (1, 'y'); SELECT note_count(1) AS u1", { an: true }),
    ],
    sai: ['CREATE FUNCTION note_count(uid int) RETURNS bigint LANGUAGE sql IMMUTABLE AS $$ SELECT count(*) FROM notes WHERE user_id = uid $$', 'CREATE FUNCTION note_count(uid int) RETURNS bigint LANGUAGE sql STABLE AS $$ SELECT count(*) FROM notes $$'],
    gy: [['A SQL function body is just a query between $$ … $$.', 'Thân hàm SQL chỉ là một truy vấn giữa $$ … $$.'], ['Parameters are used by name.', 'Tham số được dùng theo tên.']],
    lhg: [['IMMUTABLE on a function that reads a table — PostgreSQL may cache or pre-compute it and return stale counts.', 'IMMUTABLE cho hàm đọc bảng — PostgreSQL có thể đệm hoặc tính sẵn và trả số đếm cũ.'], ['Forgetting the WHERE on uid: every user gets 500.', 'Quên WHERE theo uid: user nào cũng nhận 500.']],
    gt: ['<p>A LANGUAGE sql function is a named, parameterized query; simple ones are even inlined into the calling query. Volatility is a promise to the planner: IMMUTABLE (pure), STABLE (reads, no writes), VOLATILE (default; may change anything).</p>', '<p>Hàm LANGUAGE sql là một truy vấn có tên và tham số; hàm đơn giản còn được nhập thẳng vào truy vấn gọi nó. Volatility là lời hứa với planner: IMMUTABLE (thuần), STABLE (đọc, không ghi), VOLATILE (mặc định; có thể đổi mọi thứ).</p>'],
    tn: [tn('volatility', 'mức biến động của hàm'), tn('STABLE', 'ổn định trong một câu lệnh')],
  }),

  pg({
    ...O_NOTES12, t: 'PL/pgSQL branching: a popularity label', k: 'MEDIUM', p: 8, kn: ['LANGUAGE plpgsql', 'IF … ELSIF', 'IMMUTABLE'], tag: ['function', 'plpgsql'],
    en: '<p>Create <code>xep_hang(v int) RETURNS text</code> in PL/pgSQL: ≥ 80 → <code>viral</code>, ≥ 40 → <code>popular</code>, &gt; 0 → <code>seen</code>, otherwise <code>unread</code>. It depends only on its argument — declare it IMMUTABLE. Then return how many notes fall in each label: <code>hang, notes</code>, most notes first (ties by label).</p>',
    vi: '<p>Tạo <code>xep_hang(v int) RETURNS text</code> bằng PL/pgSQL: ≥ 80 → <code>viral</code>, ≥ 40 → <code>popular</code>, &gt; 0 → <code>seen</code>, còn lại <code>unread</code>. Nó chỉ phụ thuộc đối số — khai báo IMMUTABLE. Rồi trả về số ghi chú mỗi nhãn: <code>hang, notes</code>, nhiều nhất trước (bằng nhau theo nhãn).</p>',
    yc: [['The function, then one SELECT using it with GROUP BY.', 'Hàm, rồi một câu SELECT dùng nó với GROUP BY.'], ['Boundaries: 80 is viral, 40 is popular, 0 is unread.', 'Biên: 80 là viral, 40 là popular, 0 là unread.']],
    giai: `${XEP}

SELECT xep_hang(views) AS hang, count(*) AS notes
FROM notes
GROUP BY 1
ORDER BY 2 DESC, 1;`,
    kiem: [
      kq(['Notes per label', 'Số ghi chú mỗi nhãn'], { thuTu: true }),
      sau(['Labels at the boundaries', 'Nhãn ở các biên'], 'SELECT xep_hang(80) AS v80, xep_hang(79) AS v79, xep_hang(40) AS v40, xep_hang(1) AS v1, xep_hang(0) AS v0'),
      sau(['Declared IMMUTABLE', 'Khai báo IMMUTABLE'], "SELECT provolatile FROM pg_proc WHERE proname = 'xep_hang'"),
      ma(['Written in PL/pgSQL', 'Viết bằng PL/pgSQL'], 'LANGUAGE\\s+plpgsql'),
    ],
    sai: [`CREATE FUNCTION xep_hang(v int) RETURNS text LANGUAGE plpgsql IMMUTABLE AS $$ BEGIN IF v > 80 THEN RETURN 'viral'; ELSIF v > 40 THEN RETURN 'popular'; ELSIF v > 0 THEN RETURN 'seen'; ELSE RETURN 'unread'; END IF; END; $$; SELECT xep_hang(views) AS hang, count(*) AS notes FROM notes GROUP BY 1 ORDER BY 2 DESC, 1;`],
    gy: [['IF … THEN … ELSIF … THEN … ELSE … END IF;', 'IF … THEN … ELSIF … THEN … ELSE … END IF;'], ['Check the highest threshold first.', 'Kiểm ngưỡng cao nhất trước.']],
    lhg: [['&gt; 80 instead of &gt;= 80 — a note with exactly 80 views is only "popular".', '&gt; 80 thay vì &gt;= 80 — ghi chú đúng 80 lượt chỉ là "popular".'], ['Writing ELSEIF (MySQL) — PL/pgSQL spells it ELSIF (ELSEIF is accepted too, but not ELSE IF).', 'Viết ELSE IF — PL/pgSQL viết ELSIF (ELSEIF cũng được, nhưng ELSE IF thì không).']],
    gt: ['<p>PL/pgSQL adds variables, branches and loops on top of SQL. A pure function of its arguments is IMMUTABLE, which lets PostgreSQL fold constant calls and use it in index expressions.</p>', '<p>PL/pgSQL thêm biến, rẽ nhánh và vòng lặp lên trên SQL. Hàm thuần của đối số là IMMUTABLE, cho phép PostgreSQL tính sẵn lời gọi hằng và dùng nó trong biểu thức chỉ mục.</p>'],
    tn: [tn('PL/pgSQL', 'ngôn ngữ thủ tục của PostgreSQL'), tn('IMMUTABLE', 'bất biến')],
  }),

  pg({
    ...O_NOTES12, t: 'A function that returns a table', k: 'MEDIUM', p: 8, kn: ['RETURNS TABLE', 'set-returning function', 'calling in FROM'], tag: ['function'],
    en: '<p>Create <code>top_notes(uid int, n int) RETURNS TABLE (id bigint, title text, views int)</code>: the n most viewed notes of a user (ties by id). Call it in FROM: <code>SELECT * FROM top_notes(3, 2)</code>.</p>',
    vi: '<p>Tạo <code>top_notes(uid int, n int) RETURNS TABLE (id bigint, title text, views int)</code>: n ghi chú được xem nhiều nhất của một user (bằng nhau theo id). Gọi nó trong FROM: <code>SELECT * FROM top_notes(3, 2)</code>.</p>',
    yc: [['LANGUAGE sql with ORDER BY … LIMIT n.', 'LANGUAGE sql với ORDER BY … LIMIT n.'], ['Output column names id, title, views.', 'Tên cột trả về id, title, views.']],
    giai: `CREATE FUNCTION top_notes(uid int, n int)
RETURNS TABLE (id bigint, title text, views int)
LANGUAGE sql STABLE
AS $$
  SELECT nt.id, nt.title, nt.views
  FROM notes nt
  WHERE nt.user_id = uid
  ORDER BY nt.views DESC, nt.id
  LIMIT n
$$;`,
    kiem: [
      sau(['top_notes(3, 2)', 'top_notes(3, 2)'], 'SELECT * FROM top_notes(3, 2)', { thuTu: true }),
      sau(['top_notes(20, 3)', 'top_notes(20, 3)'], 'SELECT * FROM top_notes(20, 3)', { thuTu: true }),
      sau(['Unknown user ⇒ empty, n = 0 ⇒ empty', 'User không tồn tại ⇒ rỗng, n = 0 ⇒ rỗng'], 'SELECT (SELECT count(*) FROM top_notes(999, 5)) AS unknown, (SELECT count(*) FROM top_notes(1, 0)) AS zero', { an: true }),
    ],
    sai: ['CREATE FUNCTION top_notes(uid int, n int) RETURNS TABLE (id bigint, title text, views int) LANGUAGE sql STABLE AS $$ SELECT nt.id, nt.title, nt.views FROM notes nt WHERE nt.user_id = uid ORDER BY nt.views LIMIT n $$'],
    gy: [['RETURNS TABLE (…) declares the output columns.', 'RETURNS TABLE (…) khai báo các cột trả về.'], ['Inside, qualify columns (nt.id): the output names are also variables.', 'Bên trong, ghi rõ bảng (nt.id): tên cột trả về cũng là biến.']],
    lhg: [['Ascending order — the least viewed notes come back.', 'Sắp tăng dần — trả về ghi chú ít người xem nhất.'], ['Unqualified "id" inside a plpgsql RETURNS TABLE function — "column reference id is ambiguous".', '"id" không ghi bảng trong hàm plpgsql RETURNS TABLE — "column reference id is ambiguous".']],
    gt: ['<p>A set-returning function behaves like a parameterized view: SELECT * FROM top_notes(3, 2). It is the PostgreSQL replacement for many SQL Server procedures that returned a result set.</p>', '<p>Hàm trả tập hành xử như một view có tham số: SELECT * FROM top_notes(3, 2). Nó thay cho nhiều thủ tục SQL Server vốn trả về một tập kết quả.</p>'],
    tn: [tn('set-returning function', 'hàm trả về tập dòng')],
  }),

  pg({
    t: 'order_total with an error for missing orders', k: 'HARD', p: 12, kn: ['plpgsql variables', 'RAISE EXCEPTION … USING ERRCODE', 'NOT FOUND checks'], tag: ['function', 'plpgsql', 'ctshop'],
    en: '<p>Create <code>order_total(p_order bigint) RETURNS numeric</code> (PL/pgSQL) that returns Σ qty × unit_price of the order. If the order does not exist it must <b>raise an error</b> with SQLSTATE <code>P0002</code> (no_data_found) and the message <code>order % not found</code> — returning NULL or 0 would hide bugs.</p>',
    vi: '<p>Tạo <code>order_total(p_order bigint) RETURNS numeric</code> (PL/pgSQL) trả về Σ qty × unit_price của đơn. Nếu đơn không tồn tại thì phải <b>báo lỗi</b> với SQLSTATE <code>P0002</code> (no_data_found) và thông điệp <code>order % not found</code> — trả NULL hay 0 sẽ che giấu lỗi.</p>',
    yc: [['Check existence with <code>IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order)</code>.', 'Kiểm tồn tại bằng <code>IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order)</code>.'], ['<code>RAISE EXCEPTION \'order % not found\', p_order USING ERRCODE = \'no_data_found\'</code>.', '<code>RAISE EXCEPTION \'order % not found\', p_order USING ERRCODE = \'no_data_found\'</code>.']],
    giai: `CREATE FUNCTION order_total(p_order bigint) RETURNS numeric
LANGUAGE plpgsql STABLE AS $$
DECLARE
  v_total numeric;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order) THEN
    RAISE EXCEPTION 'order % not found', p_order USING ERRCODE = 'no_data_found';   -- SQLSTATE P0002
  END IF;
  SELECT COALESCE(sum(qty * unit_price), 0) INTO v_total
  FROM order_item WHERE order_id = p_order;          -- an order with no lines is worth 0, not NULL
  RETURN v_total;
END $$;`,
    kiem: [
      sau(['Totals of orders 1, 2 and 9', 'Tổng của đơn 1, 2 và 9'], 'SELECT order_total(1) AS o1, order_total(2) AS o2, order_total(9) AS o9'),
      chan(['A missing order raises P0002', 'Đơn không tồn tại báo P0002'], 'SELECT order_total(999)', 'P0002'),
      sau(['An order with no lines is 0', 'Đơn không có dòng nào là 0'], "INSERT INTO orders (customer_id, created_at) VALUES (8, '2026-10-09 10:00+07'); SELECT order_total(15) AS empty_order", { an: true }),
      sau(['Every payment matches its order total', 'Mọi thanh toán khớp tổng đơn'], 'SELECT count(*) FILTER (WHERE amount <> order_total(order_id)) AS wrong FROM payment', { an: true }),
    ],
    sai: ['CREATE FUNCTION order_total(p_order bigint) RETURNS numeric LANGUAGE sql STABLE AS $$ SELECT sum(qty * unit_price) FROM order_item WHERE order_id = p_order $$', "CREATE FUNCTION order_total(p_order bigint) RETURNS numeric LANGUAGE plpgsql STABLE AS $$ BEGIN IF NOT EXISTS (SELECT 1 FROM orders WHERE id = p_order) THEN RAISE EXCEPTION 'order % not found', p_order; END IF; RETURN (SELECT sum(qty * unit_price) FROM order_item WHERE order_id = p_order); END $$"],
    gy: [['RAISE EXCEPTION aborts the statement (and the transaction) — that is the point.', 'RAISE EXCEPTION làm hỏng câu lệnh (và giao dịch) — đó chính là mục đích.'], ['Without USING ERRCODE the SQLSTATE is P0001 (raise_exception).', 'Không có USING ERRCODE thì SQLSTATE là P0001 (raise_exception).']],
    lhg: [['Returning NULL for a missing order: the caller computes NULL totals silently.', 'Trả NULL cho đơn không tồn tại: người gọi lặng lẽ tính ra tổng NULL.'], ['Default P0001: the API cannot tell "not found" from other business errors.', 'Mặc định P0001: API không phân biệt được "không tìm thấy" với lỗi nghiệp vụ khác.']],
    gt: ['<p>Distinguishing "no such order" (error with a precise SQLSTATE) from "order without lines" (0) keeps both bugs and edge cases visible. Clients map SQLSTATE codes to HTTP statuses (P0002 ⇒ 404).</p>', '<p>Phân biệt "không có đơn đó" (lỗi với SQLSTATE chính xác) với "đơn không có dòng" (0) giữ cả lỗi lẫn trường hợp biên đều lộ rõ. Client ánh xạ SQLSTATE sang mã HTTP (P0002 ⇒ 404).</p>'],
    tn: [tn('RAISE EXCEPTION', 'báo lỗi trong PL/pgSQL'), tn('SQLSTATE', 'mã lỗi chuẩn 5 ký tự')],
  }),

  cs({
    t: 'IMMUTABLE, STABLE or VOLATILE?', k: 'MEDIUM', p: 5, loai: 'table', kn: ['volatility categories'], tag: ['function'],
    en: '<p>Pick the most precise honest volatility for each function.</p>', vi: '<p>Chọn mức volatility trung thực và chính xác nhất cho từng hàm.</p>',
    bang: [bang1('b1', ['Function → volatility', 'Hàm → volatility'], [{ ma: 'f', ten: 'Function / Hàm' }, { ma: 'v', ten: 'Volatility', luaChon: ['IMMUTABLE', 'STABLE', 'VOLATILE'] }], [
      { o: { f: 'final_price(price numeric, pct int) = round(price * (100 - pct) / 100, 2)' }, a: { v: 'IMMUTABLE' } },
      { o: { f: 'note_count(uid) — SELECT count(*) FROM notes WHERE …' }, a: { v: 'STABLE' } },
      { o: { f: 'place_order(customer, items) — INSERTs an order' }, a: { v: 'VOLATILE' } },
      { o: { f: 'new_ticket_code() — uses random()' }, a: { v: 'VOLATILE' } },
      { o: { f: 'local_day(ts timestamptz) = (ts AT TIME ZONE current_setting(\'TimeZone\'))::date' }, a: { v: 'STABLE' } },
    ], ['IMMUTABLE: depends only on arguments, forever. STABLE: same result within one statement (reads tables or settings). VOLATILE: may change data or return a different value each call (random, nextval, clock_timestamp). Lying "IMMUTABLE" lets PostgreSQL cache wrong answers, even inside indexes.', 'IMMUTABLE: chỉ phụ thuộc đối số, mãi mãi. STABLE: cùng kết quả trong một câu lệnh (đọc bảng hay thiết lập). VOLATILE: có thể đổi dữ liệu hoặc mỗi lần gọi một giá trị (random, nextval, clock_timestamp). Khai gian "IMMUTABLE" khiến PostgreSQL đệm câu trả lời sai, kể cả trong chỉ mục.'])],
    gy: [['Does it write? Then VOLATILE.', 'Có ghi không? Có thì VOLATILE.'], ['Does it read a table or a setting? Then at most STABLE.', 'Có đọc bảng hay thiết lập không? Có thì tối đa là STABLE.']],
    lhg: [['Marking a table-reading function IMMUTABLE to "make it faster".', 'Đánh dấu hàm đọc bảng là IMMUTABLE "cho nhanh".'], ['Leaving everything VOLATILE (the default) — correct but blocks optimizations and index use.', 'Để mọi thứ VOLATILE (mặc định) — đúng nhưng chặn tối ưu và việc dùng chỉ mục.']],
    tn: [tn('volatility', 'mức biến động')],
  }),
]);
