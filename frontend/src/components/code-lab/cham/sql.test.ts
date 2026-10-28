/**
 * Máy chấm SQL (loại 'sql', 29/10/2026) — test phần thuần + bộ chạy PGlite thật (nếu nạp được).
 *   npx tsx --test frontend/src/components/code-lab/cham/sql.test.ts
 * Phần PGlite: dùng scripts/codelab-sql-node.mjs (tự cài PGlite ghim bản vào ~/.cache lần đầu — cần mạng;
 * không nạp được thì các test đó tự BỎ QUA, phần thuần vẫn chạy).
 */
import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { bangChu, chuanHoaBang, chuanHoaGiaTri, soSanhBang, type BangSql } from './sqlSoSanh';
import { boNgoac, chuGocCot, coLenhGiaoDich, csdlChoPg, dongCot, groupByDungBiDanh, kiemPhuongNgu, lamSach, moTaLoiSql, tachLenhSql } from './sqlLoi';
import { kiemTruocKhiChay } from './chamSql';

const B = (cot: string[], hang: unknown[][]): BangSql => ({ cot, hang });

describe('soSanhBang — bộ so kết quả', () => {
  const mong = B(['empSSN', 'empName'], [[1, 'An'], [2, 'Bình'], [3, 'Cường']]);

  it('không thứ tự: đổi thứ tự dòng vẫn đạt; thứ tự: phải khớp, báo "SAI THỨ TỰ"', () => {
    const dao = B(['empssn', 'EMPNAME'], [[3, 'Cường'], [1, 'An'], [2, 'Bình']]);
    assert.equal(soSanhBang(mong, dao).dat, true);
    const r = soSanhBang(mong, dao, { thuTu: true });
    assert.equal(r.dat, false);
    assert.match(r.vi, /SAI THỨ TỰ/);
    assert.equal(r.dongLech, 0);
  });

  it('tên cột không phân biệt hoa thường; sai tên ⇒ nhắc bí danh; tenCot:false bỏ qua tên', () => {
    const sai = B(['empSSN', 'name'], mong.hang);
    const r = soSanhBang(mong, sai);
    assert.equal(r.dat, false);
    assert.match(r.vi, /AS empName/);
    assert.equal(soSanhBang(mong, sai, { tenCot: false }).dat, true);
  });

  it('đúng tên nhưng đổi chỗ cột ⇒ báo sai thứ tự cột; boQuaThuTuCot ⇒ đạt', () => {
    const doi = B(['empName', 'empSSN'], mong.hang.map(([a, b]) => [b, a]));
    assert.match(soSanhBang(mong, doi).vi, /SAI THỨ TỰ/);
    assert.equal(soSanhBang(mong, doi, { boQuaThuTuCot: true }).dat, true);
  });

  it('số cột sai ⇒ nói rõ cột cần', () => {
    const r = soSanhBang(mong, B(['empSSN'], [[1], [2], [3]]));
    assert.equal(r.dat, false);
    assert.match(r.vi, /Số cột sai/);
  });

  it('dòng thiếu / thừa / lặp (JOIN nhân bản)', () => {
    const thieu = soSanhBang(mong, B(mong.cot, [[1, 'An'], [2, 'Bình']]));
    assert.equal(thieu.dat, false);
    assert.deepEqual(thieu.thieu, [[3, 'Cường']]);
    assert.match(thieu.vi, /LEFT JOIN/);
    const lap = soSanhBang(mong, B(mong.cot, [...mong.hang, [1, 'An']]));
    assert.equal(lap.dat, false);
    assert.deepEqual(lap.thua, [[1, 'An']]);
    assert.match(lap.vi, /DISTINCT/);
  });

  it('multiset: hai dòng giống nhau phải xuất hiện đủ hai lần', () => {
    const m = B(['h'], [[10], [10], [30]]);
    assert.equal(soSanhBang(m, B(['h'], [[10], [30], [30]])).dat, false);
    assert.equal(soSanhBang(m, B(['h'], [[30], [10], [10]])).dat, true);
  });

  it('NULL: chỉ bằng NULL (mặc định); nullBang "rong" ⇒ NULL = chuỗi rỗng', () => {
    const m = B(['x'], [[null], ['a']]);
    assert.equal(soSanhBang(m, B(['x'], [[null], ['a']])).dat, true);
    assert.equal(soSanhBang(m, B(['x'], [[''], ['a']])).dat, false);
    assert.equal(soSanhBang(m, B(['x'], [[''], ['a']]), { nullBang: 'rong' }).dat, true);
    assert.equal(soSanhBang(B(['x'], [[0]]), B(['x'], [[null]])).dat, false);
  });

  it('kiểu & sai số: DECIMAL SQL Server (6 chữ số lẻ) ≈ numeric PostgreSQL; chuỗi số so như số; saiSo tuỳ chọn', () => {
    const m = B(['avg'], [[73214.28571428571]]);
    assert.equal(soSanhBang(m, B(['avg'], [[73214.285714]])).dat, true); // AVG(decimal) của SQL Server
    assert.equal(soSanhBang(m, B(['avg'], [[73214.29]])).dat, false);
    assert.equal(soSanhBang(m, B(['avg'], [[73214.29]]), { saiSo: 0.01 }).dat, true);
    assert.equal(soSanhBang(B(['p'], [[3.5]]), B(['p'], [['3.50']])).dat, true);
    assert.equal(soSanhBang(B(['s'], [['abc']]), B(['s'], [['abc   ']])).dat, true); // SQL Server bỏ khoảng trắng cuối khi so '='
    assert.equal(soSanhBang(B(['s'], [['abc']]), B(['s'], [['ABC']])).dat, false); // giá trị KẾT QUẢ phải đúng chữ
  });

  it('chuanHoaGiaTri theo OID kiểu PostgreSQL', () => {
    assert.equal(chuanHoaGiaTri('90000', 1700), 90000);
    assert.equal(chuanHoaGiaTri('9007199254740993', 20), 9007199254740992);
    assert.equal(chuanHoaGiaTri('1985-07-20', 1082), '1985-07-20');
    assert.equal(chuanHoaGiaTri('2024-01-02 10:00:01.000', 1114), '2024-01-02 10:00:01');
    assert.equal(chuanHoaGiaTri(BigInt(5)), 5);
    assert.equal(chuanHoaGiaTri(-0), 0);
    assert.equal(chuanHoaGiaTri('007', 1043), '007');
    assert.deepEqual(chuanHoaBang(['a', 'b'], [23, 1700], [[1, '2.50']]), B(['a', 'b'], [[1, 2.5]]));
  });

  it('bangChu dựng bảng chữ có tiêu đề + "… (N rows)"', () => {
    const t = bangChu(B(['id', 'ten'], [[1, 'A'], [2, null], [3, 'C']]), 2);
    assert.match(t, /^id \| ten/);
    assert.match(t, /NULL/);
    assert.match(t, /… \(3 rows\)/);
  });
});

describe('sqlLoi — tách câu, làm sạch, phương ngữ', () => {
  it('tách theo ; nhưng không cắt trong chuỗi/chú thích', () => {
    const ds = tachLenhSql("SELECT 'a;b' AS x; -- c;d\nSELECT 2 /* ; */;\n;  ");
    assert.equal(ds.length, 2);
    assert.match(ds[0], /'a;b'/);
  });

  it('lamSach giữ độ dài + vị trí; boNgoac xoá nội dung ngoặc', () => {
    const s = "SELECT 'TOP 5' -- LIMIT 3\nFROM t";
    assert.equal(lamSach(s).length, s.length);
    assert.doesNotMatch(lamSach(s), /TOP|LIMIT/);
    assert.equal(boNgoac('a (b (c) d) e'), 'a (       ) e');
  });

  const ma = (sql: string) => kiemPhuongNgu(sql).map((v) => v.ma);

  it('bắt cú pháp chỉ T-SQL', () => {
    assert.deepEqual(ma('SELECT TOP 3 empName FROM tblEmployee'), ['tsql-top']);
    assert.ok(ma('SELECT ISNULL(a, 0), GETDATE() FROM t').includes('tsql-isnull'));
    assert.ok(ma('SELECT * FROM t WHERE YEAR(d) = 2024').includes('tsql-datefn'));
    assert.ok(ma('CREATE TABLE t (id INT IDENTITY(1,1), n NVARCHAR(50))').includes('tsql-identity'));
    assert.ok(ma('CREATE TABLE t (id INT IDENTITY(1,1), n NVARCHAR(50))').includes('tsql-ntype'));
    assert.ok(ma('SELECT [empName] FROM t').includes('tsql-bracket'));
    assert.ok(ma('SELECT CAST(x AS NVARCHAR(10)) FROM t').includes('tsql-ntype'));
    assert.ok(ma('CREATE TABLE t (ok BIT, m MONEY)').includes('tsql-bit-money'));
    assert.ok(ma('DECLARE @x INT; SELECT @x').includes('tsql-batch'));
    assert.ok(ma('CREATE PROCEDURE p AS SELECT 1').includes('tsql-prog'));
    assert.ok(ma("SELECT empName AS 'Full Name' FROM t").includes('tsql-alias-quote'));
  });

  it('bắt cú pháp chỉ PostgreSQL (chạy được ở đây nhưng SQL Server từ chối)', () => {
    assert.deepEqual(ma('SELECT * FROM t ORDER BY a LIMIT 5'), ['pg-limit']);
    assert.ok(ma("SELECT * FROM t WHERE a ILIKE '%x%'").includes('pg-ilike'));
    assert.ok(ma('SELECT a::int FROM t').includes('pg-cast'));
    assert.ok(ma("SELECT a || 'x' FROM t").includes('pg-concat'));
    assert.ok(ma('SELECT * FROM a NATURAL JOIN b').includes('pg-join'));
    assert.ok(ma('SELECT * FROM a JOIN b USING (id)').includes('pg-join'));
    assert.ok(ma('SELECT * FROM t WHERE d >= CURRENT_DATE').includes('pg-datefn'));
    assert.ok(ma('SELECT a, COUNT(*) FROM t GROUP BY 1').includes('pg-groupby-num'));
    assert.ok(ma('SELECT * FROM t ORDER BY a FETCH FIRST 3 ROWS ONLY').includes('pg-offset'));
    assert.ok(ma('SELECT * FROM (SELECT a FROM t ORDER BY a) x').includes('pg-order-sub'));
    assert.ok(ma('CREATE VIEW v AS SELECT a FROM t ORDER BY a').includes('pg-order-sub'));
    assert.ok(ma('CREATE TABLE t (n VARCHAR)').includes('pg-varchar-nolen'));
    assert.ok(ma('ALTER TABLE t ADD COLUMN c INT').includes('pg-misc'));
    assert.ok(ma('UPDATE t SET a = 1 FROM u WHERE u.id = t.id').includes('pg-update-from'));
    assert.ok(ma('SELECT ROUND(AVG(x)) FROM t').includes('pg-round1'));
    assert.ok(ma('CREATE TABLE t (id SERIAL PRIMARY KEY, ok BOOLEAN)').includes('pg-type'));
    assert.ok(ma("SELECT d + INTERVAL '1 day' FROM t").includes('pg-type'));
  });

  it('KHÔNG báo nhầm với SQL chuẩn (cả hai hệ chạy được)', () => {
    const chuan = [
      "SELECT empSSN, empName FROM tblEmployee WHERE empName LIKE N'%Anh' ORDER BY empSSN",
      'SELECT e.empName, d.depName FROM tblEmployee e LEFT JOIN tblDepartment d ON d.depNum = e.depNum',
      'SELECT depNum, COUNT(*) AS n, AVG(CAST(empSalary AS DECIMAL(12,2))) AS a FROM tblEmployee GROUP BY depNum HAVING COUNT(*) > 1',
      'SELECT * FROM t ORDER BY a OFFSET 0 ROWS FETCH NEXT 3 ROWS ONLY',
      "SELECT CONCAT(a, ' ', b), COALESCE(c, 0), ROUND(x, 2), SUBSTRING(s, 1, 3) FROM t",
      'UPDATE tblEmployee SET empSalary = empSalary * 1.1 WHERE depNum IN (SELECT depNum FROM tblDepartment WHERE depName = N\'X\')',
      'CREATE TABLE tblCourse (courseID CHAR(6) PRIMARY KEY, courseName VARCHAR(100) NOT NULL, credits INT CHECK (credits > 0))',
      'ALTER TABLE tblProject ADD budget DECIMAL(12,2)',
      "SELECT YEARLY_total FROM t WHERE note = 'TOP 3 LIMIT 5 ISNULL(x)' -- GETDATE()",
      'SELECT a + b AS tong FROM t GROUP BY a, b ORDER BY tong',
      'SELECT empSSN AS empSSN, COUNT(*) FROM t GROUP BY empSSN',
      'CREATE VIEW v AS SELECT a FROM t',
      'SELECT Image, Money, Bit, DateTime, Uuid FROM Products',
      'SELECT price AS Money FROM t',
      'CREATE VIEW vwImg AS SELECT Image, Money FROM Products',
      'SELECT * FROM t WHERE x IN (SELECT y FROM u ORDER BY y OFFSET 0 ROWS FETCH NEXT 1 ROWS ONLY)',
    ];
    for (const s of chuan) assert.deepEqual(kiemPhuongNgu(s), [], s);
  });

  it('GROUP BY theo bí danh (PostgreSQL nhận, SQL Server từ chối)', () => {
    assert.equal(groupByDungBiDanh('SELECT depNum * 10 AS nhom, COUNT(*) FROM t GROUP BY nhom'), true);
    assert.equal(groupByDungBiDanh('SELECT depNum AS depNum, COUNT(*) FROM t GROUP BY depNum'), false);
    assert.equal(groupByDungBiDanh('SELECT e.depNum AS depNum, COUNT(*) FROM t e GROUP BY depNum'), false);
  });

  it('lệnh giao dịch bị chặn; giới hạn trước khi chạy', () => {
    assert.equal(coLenhGiaoDich('BEGIN; UPDATE t SET a = 1; COMMIT;'), true);
    assert.equal(coLenhGiaoDich("SELECT 'commit' AS x"), false);
    assert.match(kiemTruocKhiChay('-- chỉ có chú thích\n')?.vi ?? '', /chưa có câu SQL/);
    assert.match(kiemTruocKhiChay('SELECT TOP 1 a FROM t')?.vi ?? '', /chỉ SQL Server/);
    assert.match(kiemTruocKhiChay('SELECT a FROM t LIMIT 1')?.vi ?? '', /chỉ PostgreSQL/);
    assert.equal(kiemTruocKhiChay('SELECT a FROM t'), null);
  });

  it('vị trí lỗi ⇒ dòng/cột; gợi ý theo SQLSTATE song ngữ', () => {
    assert.deepEqual(dongCot('SELECT a\nFROM t\nWHER x', 17), { dong: 3, cot: 1 });
    const m = moTaLoiSql('SELECT d.depName, COUNT(*) FROM d GROUP BY d.depNum', { thongDiep: 'must appear in the GROUP BY clause', ma: '42803', viTri: 8 });
    assert.match(m.vi, /dòng 1, cột 8/);
    assert.match(m.vi, /GROUP BY/);
    assert.match(m.en, /Hint/);
  });

  it('csdlChoPg: NVARCHAR ⇒ CITEXT (VARCHAR/CHAR giữ nguyên), PRIMARY KEY ⇒ UNIQUE, không chạm chuỗi; bỏ GO', () => {
    const goc = "CREATE TABLE a (id INT NOT NULL PRIMARY KEY, n NVARCHAR(50), c CHAR(1), v VARCHAR(10), d DATETIME, CONSTRAINT pk PRIMARY KEY (id, n));\nINSERT INTO a VALUES (1, N'PRIMARY KEY NVARCHAR(5)', 'F', 'x', '2024-01-01');\nGO\n";
    const pg = csdlChoPg(goc);
    assert.match(pg, /id INT NOT NULL UNIQUE NOT NULL/);
    assert.match(pg, /n CITEXT, c CHAR\(1\), v VARCHAR\(10\), d TIMESTAMP/);
    assert.match(pg, /CONSTRAINT pk UNIQUE \(id, n\)/);
    assert.match(pg, /N'PRIMARY KEY NVARCHAR\(5\)'/);
    assert.doesNotMatch(pg, /^\s*GO\s*$/m);
  });

  it('chuGocCot lấy lại chữ HOA của tên cột từ mã', () => {
    assert.deepEqual(chuGocCot('SELECT t.ID AS TrackID, empName FROM x -- trackid', ['trackid', 'empname', 'Khac', 'count']), ['TrackID', 'empName', 'Khac', 'count']);
  });
});

// ─── bộ chạy PGlite thật (Node) ─────────────────────────────────────────────────────────────────
const tepNode = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../scripts/codelab-sql-node.mjs');
type SqlNode = { chayKiemSql: (tj: unknown, k: unknown, files: Record<string, string>, mong?: unknown) => Promise<{ dat: boolean; thay?: string; bang?: BangSql }> };
let node: SqlNode | null = null;
let lyDoBoQua = '';

describe('bộ chạy PGlite — chế độ SQL Server', () => {
  before(async () => {
    try {
      node = (await import(pathToFileURL(tepNode).href)) as SqlNode;
      await node.chayKiemSql({ loai: 'sql', csdl: 'CREATE TABLE t (a INT)' }, { kiem: 'ket-qua', moTa: 'x' }, { 'query.sql': 'SELECT 1 AS x' });
    } catch (e) {
      lyDoBoQua = `không nạp được PGlite: ${e instanceof Error ? e.message : String(e)}`;
      node = null;
    }
  });
  const csdl = `CREATE TABLE tblDept (depNum INT NOT NULL PRIMARY KEY, depName NVARCHAR(50) NOT NULL);
CREATE TABLE tblEmp (empSSN INT NOT NULL PRIMARY KEY, empName NVARCHAR(50), depNum INT REFERENCES tblDept(depNum), sal DECIMAL(10,0), age INT);
INSERT INTO tblDept VALUES (1, N'Sales'), (2, N'IT');
INSERT INTO tblEmp VALUES (1, N'an', 1, 100, 20), (2, N'Bình', 1, 200, 21), (3, N'cường', 2, NULL, 22), (4, N'Dũng', 2, 50, 22);`;
  const tj = { loai: 'sql', csdl, tepChinh: 'query.sql' };
  const chay = (sql: string, k: Record<string, unknown> = { kiem: 'ket-qua', moTa: 't' }) => (node as SqlNode).chayKiemSql(tj, k, { 'query.sql': sql });

  it('so chuỗi không phân biệt hoa thường (= và LIKE), như collation CI của SQL Server', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    assert.deepEqual((await chay("SELECT empSSN FROM tblEmp WHERE empName = N'AN'")).bang?.hang, [[1]]);
    assert.deepEqual((await chay("SELECT empSSN FROM tblEmp WHERE empName LIKE N'%ƯỜNG'")).bang?.hang, [[3]]);
  });

  it('AVG(cột INT) cắt phần lẻ như SQL Server; AVG(DECIMAL) giữ phần lẻ; AVG(COUNT) cũng cắt', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    assert.deepEqual((await chay('SELECT AVG(age) AS a FROM tblEmp')).bang?.hang, [[21]]);
    assert.deepEqual((await chay('SELECT AVG(CAST(age AS DECIMAL(10,2))) AS a FROM tblEmp')).bang?.hang, [[21.25]]);
    assert.deepEqual((await chay('SELECT AVG(c) AS a FROM (SELECT depNum, COUNT(*) AS c FROM tblEmp WHERE empSSN < 4 GROUP BY depNum) x')).bang?.hang, [[1]]);
  });

  it('GROUP BY chặt: chọn cột không gộp dù đã GROUP BY khoá chính ⇒ lỗi (như SQL Server Msg 8120)', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    const r = await chay('SELECT d.depNum, d.depName, COUNT(*) AS n FROM tblDept d JOIN tblEmp e ON e.depNum = d.depNum GROUP BY d.depNum');
    assert.equal(r.dat, false);
    assert.match(r.thay ?? '', /GROUP BY/);
  });

  it('NOT IN với NULL trong truy vấn con ⇒ 0 dòng (ANSI_NULLS)', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    const r = await chay('SELECT empSSN FROM tblEmp WHERE sal NOT IN (SELECT sal FROM tblEmp WHERE empSSN > 2)');
    assert.deepEqual(r.bang?.hang, []);
  });

  it('mỗi kiểm cô lập: DML của kiểm trước không rò sang kiểm sau', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    await chay("DELETE FROM tblEmp; INSERT INTO tblDept VALUES (9, N'X')");
    assert.deepEqual((await chay('SELECT COUNT(*) AS n FROM tblEmp')).bang?.hang, [[4]]);
  });

  it('sau-lenh / bi-chan / chay-duoc', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    const sau = await chay('UPDATE tblEmp SET sal = sal + 1 WHERE depNum = 1', { kiem: 'sau-lenh', moTa: 's', kiemTra: 'SELECT empSSN, sal FROM tblEmp ORDER BY empSSN' });
    assert.deepEqual(sau.bang?.hang, [[1, 101], [2, 201], [3, null], [4, 50]]);
    const chan = await chay('ALTER TABLE tblEmp ADD CONSTRAINT ck_sal CHECK (sal > 0)', { kiem: 'bi-chan', moTa: 'c', thu: 'UPDATE tblEmp SET sal = 0 WHERE empSSN = 1', maLoi: '23514' });
    assert.equal(chan.dat, true);
    const khongChan = await chay('SELECT 1 AS x', { kiem: 'bi-chan', moTa: 'c', thu: 'UPDATE tblEmp SET sal = 0 WHERE empSSN = 1' });
    assert.equal(khongChan.dat, false);
    const duoc = await chay('SELECT 1 AS x', { kiem: 'chay-duoc', moTa: 'd', thu: "INSERT INTO tblDept VALUES (3, N'HR')" });
    assert.equal(duoc.dat, true);
  });

  it('lỗi cú pháp của người học ⇒ thông báo có dòng/cột', async (t) => {
    if (!node) return t.skip(lyDoBoQua);
    const r = await chay('SELECT empName\nFROM tblEmp\nWHER empSSN = 1');
    assert.equal(r.dat, false);
    assert.match(r.thay ?? '', /dòng 3/);
  });
});
