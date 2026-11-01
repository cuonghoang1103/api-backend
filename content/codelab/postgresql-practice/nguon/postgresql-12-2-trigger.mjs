/** PostgreSQL · 12.2 — Trigger: updated_at, nhật ký chỉ ghi thay đổi thật, trừ kho khi bán (CT Shop), bẫy BEFORE trả NULL. */
import { mod, pg, cs, q, sau, chan, duoc, ma, tn } from './_chung.mjs';
import { O_NOTES12, NOTES12 } from './_du-lieu.mjs';

const AUDIT = `${NOTES12}
CREATE TABLE notes_audit (
  id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  note_id   bigint NOT NULL,
  old_views int,
  new_views int,
  changed_at timestamptz NOT NULL DEFAULT now()
);`;

export default mod('postgresql-12-2-trigger', '12.2 Triggers: automation the application cannot forget', [
  pg({
    ...O_NOTES12, t: 'The trigger everybody needs: updated_at', k: 'MEDIUM', p: 8, kn: ['BEFORE UPDATE … FOR EACH ROW', 'NEW', 'RETURN NEW'], tag: ['trigger'],
    en: '<p>Every UPDATE of <code>notes</code> must set <code>updated_at = now()</code> — whatever the application remembers. Create the trigger function <code>set_updated_at()</code> and the trigger <code>notes_updated_at</code>.</p>',
    vi: '<p>Mọi lệnh UPDATE trên <code>notes</code> phải đặt <code>updated_at = now()</code> — bất kể ứng dụng có nhớ hay không. Tạo hàm trigger <code>set_updated_at()</code> và trigger <code>notes_updated_at</code>.</p>',
    yc: [['A BEFORE UPDATE, FOR EACH ROW trigger whose function sets <code>NEW.updated_at := now()</code> and returns NEW.', 'Trigger BEFORE UPDATE, FOR EACH ROW có hàm đặt <code>NEW.updated_at := now()</code> và trả NEW.'], ['created_at must not change.', 'created_at không được đổi.']],
    giai: `CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();     -- modify the row BEFORE it is written
  RETURN NEW;                  -- a BEFORE trigger must return the row to store
END $$;

CREATE TRIGGER notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();`,
    kiem: [
      sau(['After an UPDATE updated_at is newer than created_at', 'Sau UPDATE, updated_at mới hơn created_at'], "UPDATE notes SET title = 'Edited' WHERE id = 1; SELECT id, title, updated_at > created_at AS touched, created_at = '2020-01-01 08:00+07' AS created_kept FROM notes WHERE id IN (1, 2) ORDER BY id", { thuTu: true }),
      sau(['Even when the app sends an old updated_at', 'Kể cả khi app gửi updated_at cũ'], "UPDATE notes SET views = 1, updated_at = '2000-01-01' WHERE id = 3; SELECT updated_at > created_at AS touched FROM notes WHERE id = 3"),
      sau(['The update itself is kept (RETURN NEW)', 'Bản thân lệnh cập nhật được giữ (RETURN NEW)'], "UPDATE notes SET views = 999 WHERE id = 4; SELECT views FROM notes WHERE id = 4"),
    ],
    sai: ['CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at := now(); RETURN NULL; END $$; CREATE TRIGGER notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();', 'CREATE FUNCTION set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at := now(); RETURN NEW; END $$; CREATE TRIGGER notes_updated_at AFTER UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION set_updated_at();'],
    gy: [['Only a BEFORE row trigger can change the row being written (through NEW).', 'Chỉ trigger dòng BEFORE mới đổi được dòng đang ghi (qua NEW).'], ['RETURN NEW = "store this row"; RETURN NULL = "skip this row".', 'RETURN NEW = "lưu dòng này"; RETURN NULL = "bỏ qua dòng này".']],
    lhg: [['RETURN NULL in a BEFORE trigger — every UPDATE silently does nothing (the trap of lesson 12.2).', 'RETURN NULL trong trigger BEFORE — mọi UPDATE lặng lẽ không làm gì (bẫy của bài 12.2).'], ['An AFTER trigger: changing NEW there has no effect, the row is already written.', 'Trigger AFTER: đổi NEW ở đó không có tác dụng, dòng đã được ghi.']],
    gt: ['<p>A trigger runs for every write from every client — the ORM, a psql session, a migration. Putting updated_at in the database means no code path can forget it.</p>', '<p>Trigger chạy cho mọi lần ghi từ mọi client — ORM, phiên psql, migration. Đặt updated_at trong CSDL nghĩa là không đường mã nào quên được nó.</p>'],
    tn: [tn('trigger', 'bẫy sự kiện'), tn('NEW / OLD', 'dòng mới / dòng cũ')],
  }),

  pg({
    csdl: AUDIT, tenCsdl: 'notes12-audit', ld: { en: O_NOTES12.ld.en + '<p>Plus <code>notes_audit (id, note_id, old_views, new_views, changed_at)</code>, empty.</p>', vi: O_NOTES12.ld.vi + '<p>Cộng <code>notes_audit (id, note_id, old_views, new_views, changed_at)</code>, rỗng.</p>' },
    t: 'An audit log that records only real changes', k: 'MEDIUM', p: 10, kn: ['AFTER UPDATE', 'OLD vs NEW', 'IS DISTINCT FROM', 'WHEN condition'], tag: ['trigger', 'audit'],
    en: '<p>Log every change of <code>notes.views</code> into <code>notes_audit (note_id, old_views, new_views)</code> — but only when the value really changes (an UPDATE that writes the same number, or changes only the title, logs nothing). Name the trigger <code>notes_views_audit</code>.</p>',
    vi: '<p>Ghi mọi thay đổi của <code>notes.views</code> vào <code>notes_audit (note_id, old_views, new_views)</code> — nhưng chỉ khi giá trị thật sự đổi (UPDATE ghi lại cùng số, hay chỉ đổi tiêu đề, thì không ghi gì). Đặt tên trigger là <code>notes_views_audit</code>.</p>',
    yc: [['AFTER UPDATE … FOR EACH ROW, with <code>WHEN (OLD.views IS DISTINCT FROM NEW.views)</code> (or the test inside the function).', 'AFTER UPDATE … FOR EACH ROW, với <code>WHEN (OLD.views IS DISTINCT FROM NEW.views)</code> (hoặc phép thử bên trong hàm).'], ['The function inserts one audit row and returns NULL (ignored for AFTER).', 'Hàm chèn một dòng nhật ký và trả NULL (bị bỏ qua với AFTER).']],
    giai: `CREATE FUNCTION audit_views() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO notes_audit (note_id, old_views, new_views) VALUES (NEW.id, OLD.views, NEW.views);
  RETURN NULL;                                  -- AFTER trigger: return value ignored
END $$;

CREATE TRIGGER notes_views_audit
  AFTER UPDATE ON notes
  FOR EACH ROW
  WHEN (OLD.views IS DISTINCT FROM NEW.views)   -- checked before the function is even called
  EXECUTE FUNCTION audit_views();`,
    kiem: [
      sau(['A real change is logged', 'Thay đổi thật được ghi'], 'UPDATE notes SET views = views + 5 WHERE id IN (1, 2); SELECT note_id, old_views, new_views FROM notes_audit ORDER BY note_id', { thuTu: true }),
      sau(['Same value or another column: nothing logged', 'Cùng giá trị hay cột khác: không ghi gì'], "UPDATE notes SET views = views WHERE id = 3; UPDATE notes SET title = 'x' WHERE id = 4; SELECT count(*) AS logged FROM notes_audit"),
      sau(['A bulk update logs one row per changed note', 'Cập nhật hàng loạt ghi mỗi ghi chú đổi một dòng'], 'UPDATE notes SET views = 0 WHERE user_id = 2; SELECT count(*) AS logged FROM notes_audit', { an: true }),
    ],
    sai: ['CREATE FUNCTION audit_views() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN INSERT INTO notes_audit (note_id, old_views, new_views) VALUES (NEW.id, OLD.views, NEW.views); RETURN NULL; END $$; CREATE TRIGGER notes_views_audit AFTER UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION audit_views();', 'CREATE FUNCTION audit_views() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN INSERT INTO notes_audit (note_id, old_views, new_views) VALUES (NEW.id, OLD.views, NEW.views); RETURN NULL; END $$; CREATE TRIGGER notes_views_audit AFTER UPDATE ON notes FOR EACH STATEMENT EXECUTE FUNCTION audit_views();'],
    gy: [['OLD is the row before the UPDATE, NEW the row after.', 'OLD là dòng trước UPDATE, NEW là dòng sau.'], ['IS DISTINCT FROM also handles NULLs correctly.', 'IS DISTINCT FROM xử lý cả NULL đúng.']],
    lhg: [['No change test — every ORM save (which rewrites all columns) floods the audit table.', 'Không thử thay đổi — mỗi lần ORM lưu (ghi lại mọi cột) làm ngập bảng nhật ký.'], ['FOR EACH STATEMENT — there is no OLD/NEW row at statement level.', 'FOR EACH STATEMENT — ở mức câu lệnh không có dòng OLD/NEW.']],
    gt: ['<p>A WHEN clause filters before the function call, so unchanged rows cost almost nothing. Writing the audit in an AFTER trigger guarantees it only happens if the update itself succeeded, in the same transaction.</p>', '<p>Mệnh đề WHEN lọc trước khi gọi hàm, nên dòng không đổi gần như không tốn gì. Ghi nhật ký trong trigger AFTER bảo đảm nó chỉ xảy ra khi chính lệnh cập nhật thành công, trong cùng giao dịch.</p>'],
    tn: [tn('audit log', 'nhật ký kiểm toán'), tn('WHEN (…)', 'điều kiện kích hoạt trigger')],
  }),

  pg({
    t: 'Selling decrements the stock — in a trigger', k: 'HARD', p: 14, kn: ['AFTER INSERT ON order_item', 'UPDATE another table in a trigger', 'CHECK fires inside the trigger'], tag: ['trigger', 'ctshop'],
    en: '<p>Whenever a line is inserted into <code>order_item</code>, CT Shop must (1) decrease <code>product.stock</code> by its qty and (2) write a <code>stock_movement</code> row (<code>change = -qty, reason = \'sale\', order_id</code>). If the stock is insufficient, the CHECK (stock ≥ 0) must make the whole INSERT fail. Name the trigger <code>order_item_sale</code>.</p>',
    vi: '<p>Mỗi khi chèn một dòng vào <code>order_item</code>, CT Shop phải (1) giảm <code>product.stock</code> theo qty và (2) ghi một dòng <code>stock_movement</code> (<code>change = -qty, reason = \'sale\', order_id</code>). Nếu tồn kho không đủ, CHECK (stock ≥ 0) phải làm cả lệnh INSERT hỏng. Đặt tên trigger là <code>order_item_sale</code>.</p>',
    yc: [['AFTER INSERT … FOR EACH ROW; the function runs one UPDATE and one INSERT.', 'AFTER INSERT … FOR EACH ROW; hàm chạy một UPDATE và một INSERT.'], ['Do not check the stock in the function — the CHECK constraint does it atomically.', 'Không tự kiểm tồn kho trong hàm — ràng buộc CHECK làm việc đó một cách nguyên tử.']],
    giai: `CREATE FUNCTION apply_sale() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE product SET stock = stock - NEW.qty WHERE id = NEW.product_id;   -- CHECK (stock >= 0) guards it
  INSERT INTO stock_movement (product_id, change, reason, order_id)
  VALUES (NEW.product_id, -NEW.qty, 'sale', NEW.order_id);
  RETURN NULL;
END $$;

CREATE TRIGGER order_item_sale
  AFTER INSERT ON order_item
  FOR EACH ROW EXECUTE FUNCTION apply_sale();`,
    kiem: [
      sau(['A line of 3 Casio calculators: stock 12 → 9, one ledger row', 'Một dòng 3 máy tính Casio: tồn 12 → 9, một dòng sổ kho'], "INSERT INTO order_item VALUES (11, 31, 3, 705000); SELECT (SELECT stock FROM product WHERE id = 31) AS stock, (SELECT change FROM stock_movement WHERE order_id = 11 AND product_id = 31) AS change, (SELECT reason FROM stock_movement WHERE order_id = 11 AND product_id = 31) AS reason"),
      chan(['Selling more than the stock fails', 'Bán quá tồn kho thì hỏng'], 'INSERT INTO order_item VALUES (11, 30, 7, 590000)', '23514'),
      sau(['A failed sale leaves no trace (no line, no ledger row, stock unchanged)', 'Lần bán hỏng không để lại dấu vết (không dòng, không sổ kho, tồn giữ nguyên)'], "DO $$ BEGIN INSERT INTO order_item VALUES (11, 30, 7, 590000); EXCEPTION WHEN check_violation THEN NULL; END $$; SELECT (SELECT stock FROM product WHERE id = 30) AS stock, (SELECT count(*) FROM order_item WHERE order_id = 11) AS lines, (SELECT count(*) FROM stock_movement) AS ledger"),
      sau(['Several lines in one INSERT', 'Nhiều dòng trong một lệnh INSERT'], "INSERT INTO order_item VALUES (7, 1, 4, 5000), (7, 19, 6, 6000); SELECT id, stock FROM product WHERE id IN (1, 19) ORDER BY id", { an: true, thuTu: true }),
    ],
    sai: ["CREATE FUNCTION apply_sale() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN UPDATE product SET stock = stock - NEW.qty WHERE id = NEW.product_id; RETURN NULL; END $$; CREATE TRIGGER order_item_sale AFTER INSERT ON order_item FOR EACH ROW EXECUTE FUNCTION apply_sale();", "CREATE FUNCTION apply_sale() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN UPDATE product SET stock = greatest(stock - NEW.qty, 0) WHERE id = NEW.product_id; INSERT INTO stock_movement (product_id, change, reason, order_id) VALUES (NEW.product_id, -NEW.qty, 'sale', NEW.order_id); RETURN NULL; END $$; CREATE TRIGGER order_item_sale AFTER INSERT ON order_item FOR EACH ROW EXECUTE FUNCTION apply_sale();"],
    gy: [['The trigger runs inside the INSERT\'s statement: its error aborts the INSERT.', 'Trigger chạy bên trong câu lệnh INSERT: lỗi của nó làm hỏng INSERT.'], ['NEW holds the inserted order_item row.', 'NEW giữ dòng order_item vừa chèn.']],
    lhg: [['Clamping with greatest(…, 0): the shop sells goods it does not have and the ledger disagrees with the shelf.', 'Kẹp bằng greatest(…, 0): cửa hàng bán hàng mình không có và sổ kho lệch với kệ.'], ['Forgetting the ledger row — stock and stock_movement drift apart (Lab 6 T1).', 'Quên dòng sổ kho — tồn kho và stock_movement lệch nhau dần (Lab 6 T1).']],
    gt: ['<p>Because the trigger, the INSERT and the CHECK are one statement, an insufficient stock rolls back the line, the stock change and the ledger row together. The third check proves "no trace" by catching the error and counting.</p>', '<p>Vì trigger, lệnh INSERT và CHECK là một câu lệnh, tồn kho không đủ sẽ rollback cùng lúc dòng đơn, thay đổi tồn kho và dòng sổ kho. Kiểm thứ ba chứng minh "không dấu vết" bằng cách bắt lỗi rồi đếm.</p>'],
    tn: [tn('AFTER trigger', 'trigger chạy sau khi ghi')],
  }),

  cs({
    t: 'Trigger timing and its traps', k: 'MEDIUM', p: 5, kn: ['BEFORE vs AFTER', 'ROW vs STATEMENT', 'RETURN NULL'], tag: ['trigger'],
    en: '<p>Pick the right trigger design.</p>', vi: '<p>Chọn thiết kế trigger đúng.</p>',
    cau: [
      q('q1', ['Normalize every inserted email to lower case.', 'Chuẩn hoá mọi email được chèn thành chữ thường.'], ['BEFORE INSERT … FOR EACH ROW, set NEW.email := lower(NEW.email)', 'AFTER INSERT … FOR EACH ROW, UPDATE the row again', 'AFTER INSERT … FOR EACH STATEMENT', 'a CHECK constraint that lowers the value'], ['Only a BEFORE row trigger can change the row before it is stored. (A CHECK only accepts or rejects.)', 'Chỉ trigger dòng BEFORE mới đổi được dòng trước khi lưu. (CHECK chỉ chấp nhận hoặc từ chối.)']),
      q('q2', ['A BEFORE INSERT trigger function ends with RETURN NULL. What happens to the INSERT?', 'Hàm trigger BEFORE INSERT kết thúc bằng RETURN NULL. Lệnh INSERT ra sao?'], ['the row is silently skipped: INSERT 0 0, no error', 'an error is raised', 'the row is inserted with NULLs', 'the trigger is ignored'], ['RETURN NULL from a BEFORE row trigger means "skip this row". Lesson 12.2 shows a table that stays empty without any error.', 'RETURN NULL từ trigger dòng BEFORE nghĩa là "bỏ qua dòng này". Bài 12.2 cho thấy một bảng cứ rỗng mà không lỗi gì.']),
      q('q3', ['Refresh a summary once after a bulk UPDATE of 10 000 rows.', 'Làm mới một bảng tóm tắt một lần sau lệnh UPDATE hàng loạt 10 000 dòng.'], ['AFTER UPDATE … FOR EACH STATEMENT', 'AFTER UPDATE … FOR EACH ROW', 'BEFORE UPDATE … FOR EACH ROW', 'BEFORE TRUNCATE'], ['A statement-level trigger fires once per statement regardless of the row count; a row trigger would fire 10 000 times.', 'Trigger mức câu lệnh chạy một lần mỗi câu bất kể số dòng; trigger dòng sẽ chạy 10 000 lần.']),
    ],
    gy: [['Change the row ⇒ BEFORE ROW. React to the change ⇒ AFTER.', 'Đổi dòng ⇒ BEFORE ROW. Phản ứng với thay đổi ⇒ AFTER.'], ['Once per statement ⇒ FOR EACH STATEMENT.', 'Một lần mỗi câu lệnh ⇒ FOR EACH STATEMENT.']],
    lhg: [['Updating the same table from its own AFTER ROW trigger — recursion and double work.', 'Cập nhật chính bảng đó từ trigger AFTER ROW của nó — đệ quy và làm thừa.'], ['Business logic hidden in triggers nobody documents.', 'Logic nghiệp vụ giấu trong trigger không ai ghi tài liệu.']],
    tn: [tn('FOR EACH ROW / STATEMENT', 'mỗi dòng / mỗi câu lệnh')],
  }),
]);
