/**
 * DBI202 · ⭐ CS.1.1 — lịch sử các hệ CSDL (slide 1–13): xử lý file, mô hình phân cấp/mạng, bài báo Codd 1970, System R,
 * Oracle, dòng họ SQL Server và PostgreSQL. Phần tự thêm, không thi — đề tĩnh (bảng, thứ tự, trắc nghiệm).
 */
import { mod, cs, q, ord, bang1, tn } from './_chung.mjs';

export default mod('dbi202-slide-cs1-1', '⭐ CS.1.1 History of database systems (1960s–1996)', [
  cs({
    t: 'Before and after Codd: what each generation could not do', k: 'EASY', p: 6, loai: 'table',
    kn: ['file processing', 'hierarchical model', 'network model', 'relational model'], tag: ['advanced', 'history'],
    en: '<p>For each generation of data management (slides 2–7), choose the weakness that pushed the industry to the next one.</p>',
    vi: '<p>Với mỗi thế hệ quản lý dữ liệu (slide 2–7), chọn điểm yếu đã đẩy ngành sang thế hệ kế tiếp.</p>',
    bang: [bang1('b1', ['Generation → weakness', 'Thế hệ → điểm yếu'],
      [{ ma: 'th', ten: 'Generation / Thế hệ' }, { ma: 'dy', ten: 'Weakness / Điểm yếu', luaChon: ['every program owns its own file: duplicates, no shared control', 'a record has exactly one parent: many-to-many is awkward', 'programs follow pointers by hand: a new question needs new code', 'none of these: queries say what, the DBMS decides how'] }],
      [{ o: { th: 'File processing (before 1970)' }, a: { dy: 'every program owns its own file: duplicates, no shared control' } },
        { o: { th: 'Hierarchical model (IBM IMS, 1968)' }, a: { dy: 'a record has exactly one parent: many-to-many is awkward' } },
        { o: { th: 'Network model (CODASYL DBTG, 1969)' }, a: { dy: 'programs follow pointers by hand: a new question needs new code' } },
        { o: { th: 'Relational model (Codd, 1970)' }, a: { dy: 'none of these: queries say what, the DBMS decides how' } }],
      ['The network model fixed the one-parent limit of the tree but kept navigational access; Codd removed navigation altogether.', 'Mô hình mạng sửa giới hạn một cha của cây nhưng vẫn truy cập kiểu dò đường; Codd bỏ hẳn việc dò đường.'])],
    gy: [['Tree = one parent; graph = several parents, still pointers.', 'Cây = một cha; đồ thị = nhiều cha, vẫn con trỏ.'], ['The relational answer is declarative access.', 'Câu trả lời của mô hình quan hệ là truy cập khai báo.']],
    lhg: [['Thinking the network model was declarative — programmers still walked the pointers.', 'Tưởng mô hình mạng là khai báo — lập trình viên vẫn tự đi theo con trỏ.'], ['Mixing up the hierarchical and network limits.', 'Nhầm giới hạn của mô hình phân cấp và mạng.']],
    tn: [tn('hierarchical model', 'mô hình phân cấp'), tn('network model', 'mô hình mạng'), tn('navigational access', 'truy cập kiểu dò đường')],
  }),
  cs({
    t: 'Codd, System R, Oracle, Ingres: who did what first', k: 'MEDIUM', p: 7,
    kn: ['Codd 1970', 'System R', 'SQL origin', 'Ingres → Postgres'], tag: ['advanced', 'history'],
    en: '<p>Five questions on the people and projects of slides 6–13.</p>',
    vi: '<p>Năm câu về con người và dự án ở slide 6–13.</p>',
    cau: [
      q('c1', ['Codd\'s 1970 paper "A Relational Model of Data for Large Shared Data Banks" proposed…', 'Bài báo 1970 của Codd "A Relational Model of Data for Large Shared Data Banks" đề xuất…'], ['data as relations, queried without saying how to find rows', 'a faster pointer format for the network model', 'the first version of the SQL language', 'storing every table in its own file on disk'], ['Codd gave the model; SQL came later from IBM\'s System R team.', 'Codd đưa ra mô hình; SQL ra đời sau ở nhóm System R của IBM.']),
      q('c2', ['SQL (first called SEQUEL) was born in…', 'SQL (ban đầu tên SEQUEL) ra đời ở…'], ['IBM\'s System R research project', 'Oracle\'s first commercial release', 'the CODASYL committee', 'UC Berkeley\'s Ingres project'], ['System R (from 1974) produced SEQUEL; Ingres used its own language, QUEL.', 'System R (từ 1974) sinh ra SEQUEL; Ingres dùng ngôn ngữ riêng QUEL.']),
      q('c3', ['The first commercially sold SQL RDBMS was…', 'RDBMS SQL đầu tiên được bán thương mại là…'], ['Oracle v2 (1979), ahead of IBM itself', 'IBM DB2, the direct heir of System R', 'SQL Server 1.0 (1989)', 'Postgres, the successor of Ingres'], ['IBM published System R\'s design; Relational Software (later Oracle) shipped first.', 'IBM công bố thiết kế System R; Relational Software (sau là Oracle) bán trước.']),
      q('c4', ['PostgreSQL\'s family tree is…', 'Cây gia phả của PostgreSQL là…'], ['Ingres → Postgres (1986) → Postgres95 → PostgreSQL (1996)', 'System R → DB2 → PostgreSQL (1996)', 'Sybase → SQL Server → PostgreSQL', 'MySQL → MariaDB → PostgreSQL (1996)'], ['Michael Stonebraker led Ingres and then Postgres at Berkeley; Postgres95 added SQL, and the 1996 rename reflects that.', 'Michael Stonebraker dẫn Ingres rồi Postgres ở Berkeley; Postgres95 thêm SQL, đổi tên 1996 phản ánh điều đó.']),
      q('c5', ['SQL Server\'s code base descends from…', 'Mã nguồn SQL Server bắt nguồn từ…'], ['Sybase SQL Server, via a 1989 partnership', 'IBM System R, licensed by Microsoft', 'Oracle v2, bought in 1985', 'Ingres, through the Berkeley licence'], ['Microsoft, Sybase and Ashton-Tate shipped SQL Server 1.0 for OS/2 in 1989; the code bases split fully around version 7.0 (1998).', 'Microsoft, Sybase và Ashton-Tate phát hành SQL Server 1.0 cho OS/2 năm 1989; hai mã nguồn tách hẳn quanh bản 7.0 (1998).']),
    ],
    gy: [['Model (Codd) ≠ language (System R) ≠ first product (Oracle).', 'Mô hình (Codd) ≠ ngôn ngữ (System R) ≠ sản phẩm đầu tiên (Oracle).'], ['Berkeley line: Ingres → Postgres → PostgreSQL.', 'Dòng Berkeley: Ingres → Postgres → PostgreSQL.']],
    lhg: [['Crediting Codd with SQL.', 'Gán SQL cho Codd.'], ['Thinking IBM sold the first SQL product.', 'Tưởng IBM bán sản phẩm SQL đầu tiên.']],
    tn: [tn('relational model', 'mô hình quan hệ'), tn('research prototype', 'nguyên mẫu nghiên cứu')],
  }),
  cs({
    t: 'From paper files to PostgreSQL, in order', k: 'EASY', p: 5, loai: 'order',
    kn: ['timeline 1960s–1996'], tag: ['advanced', 'history'],
    en: '<p>Order the milestones of slides 1–13 from the oldest to the newest.</p>',
    vi: '<p>Sắp các mốc của slide 1–13 từ cũ nhất tới mới nhất.</p>',
    cau: [
      ord('o1', ['Oldest → newest', 'Cũ nhất → mới nhất'], ['IBM IMS runs the Apollo parts list (hierarchical)', 'Codd publishes the relational model', 'Ingres starts at UC Berkeley', 'Oracle v2 ships', 'Postgres project starts at Berkeley', 'SQL Server 1.0 for OS/2', 'Postgres95 adds an SQL interpreter', 'PostgreSQL gets its final name'],
        ['1968 · 1970 · 1973–74 · 1979 · 1986 · 1989 · 1995 · 1996.', '1968 · 1970 · 1973–74 · 1979 · 1986 · 1989 · 1995 · 1996.']),
    ],
    gy: [['Two decades: the 1970s are research (Codd, Ingres, System R), the 1980s products.', 'Hai thập kỷ: những năm 1970 là nghiên cứu (Codd, Ingres, System R), những năm 1980 là sản phẩm.'], ['Postgres95 comes one year before the rename.', 'Postgres95 đến trước việc đổi tên một năm.']],
    lhg: [['Putting SQL Server before Postgres — Postgres started in 1986.', 'Đặt SQL Server trước Postgres — Postgres bắt đầu năm 1986.'], ['Putting Oracle before Codd.', 'Đặt Oracle trước Codd.']],
  }),
]);
