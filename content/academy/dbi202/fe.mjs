/**
 * DBI202 · Thi cuối kỳ — đề FE 20 câu.
 * Quiz viết lại (20 câu, giữ slug dbi202-final-exam-fe).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/DBI202/gen/gen.mjs từ gen/src/** và gen/sql/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node DBI202/gen/gen.mjs`.
 */

/* ───────── Quiz (dbi202-final-exam-fe) — 20 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 3600,
  questions: [
    { id: 'q1',
      question: "A clinic keeps its patient records in SQL Server, and the staff use a booking app on top of it. In the textbook's terms, what is \"the DBMS software together with the data itself (sometimes with the applications)\"?|||Một phòng khám lưu hồ sơ bệnh nhân trong SQL Server, nhân viên dùng một app đặt lịch chạy trên đó. Theo định nghĩa của giáo trình, \"phần mềm DBMS cùng với chính dữ liệu (đôi khi kèm cả ứng dụng)\" gọi là gì?",
      options: ['A database — a collection of related data|||Một cơ sở dữ liệu (database) — tập hợp các dữ liệu có liên quan', 'A DBMS — the software that creates and maintains it|||Một DBMS — phần mềm tạo ra và duy trì dữ liệu', 'A database system — the DBMS plus the data|||Một hệ cơ sở dữ liệu (database system) — DBMS cộng dữ liệu', 'A data model — the structure, operations and constraints|||Một mô hình dữ liệu (data model) — cấu trúc, phép toán và ràng buộc'],
      correctIndex: 2,
      points: 1,
      explanation: 'Slide 5 of Chapter 1 separates three words: a database is the data (a collection of related data kept for a long time), a DBMS is the software package that creates and maintains it, and a database system is the two together — sometimes with the applications. B is the most tempting because people say "SQL Server" for everything, but SQL Server alone is only the DBMS; without the patient data it is not a database system.|||Slide 5 Chương 1 tách ba chữ: cơ sở dữ liệu (database) là phần dữ liệu (tập dữ liệu có liên quan, lưu lâu dài), DBMS (hệ quản trị CSDL) là gói phần mềm tạo và duy trì nó, còn hệ cơ sở dữ liệu (database system) là cả hai cộng lại — đôi khi kèm cả ứng dụng. B hấp dẫn nhất vì người ta hay gọi mọi thứ là "SQL Server", nhưng riêng SQL Server chỉ là DBMS; chưa có dữ liệu bệnh nhân thì chưa phải hệ cơ sở dữ liệu.' },
    { id: 'q2',
      question: "Two receptionists try to book the last free slot at the same second. Which DBMS component (slide 16 of Chapter 1) uses the lock table so that they do not overwrite each other's work?|||Hai lễ tân cùng đặt khung giờ trống cuối cùng trong cùng một giây. Thành phần nào của DBMS (slide 16 Chương 1) dùng bảng khoá (lock table) để hai người không ghi đè lên việc của nhau?",
      options: ['Concurrency control|||Bộ điều khiển đồng thời (concurrency control)', 'Logging and recovery|||Bộ ghi nhật ký và phục hồi (logging and recovery)', 'Query compiler|||Bộ biên dịch truy vấn (query compiler)', 'Buffer manager|||Bộ quản lý bộ đệm (buffer manager)'],
      correctIndex: 0,
      points: 1,
      explanation: "Under the transaction manager sit two helpers: concurrency control, which keeps the lock table so that simultaneous users cannot corrupt each other's work, and logging and recovery, which writes the log so that committed work survives a crash. B is the tempting one because it also belongs to the transaction manager, but it protects against crashes (durability), not against two users acting at once. The query compiler only turns a query into a plan; the buffer manager only moves pages between disk and memory.|||Dưới bộ quản lý giao dịch (transaction manager) có hai trợ thủ: điều khiển đồng thời (concurrency control) giữ bảng khoá để người dùng cùng lúc không làm hỏng việc của nhau, và ghi nhật ký/phục hồi (logging and recovery) ghi log để việc đã commit sống sót qua sự cố. B hấp dẫn vì nó cũng thuộc bộ quản lý giao dịch, nhưng nó chống sự cố sập máy (tính bền — durability), không chống hai người thao tác cùng lúc. Bộ biên dịch truy vấn chỉ biến câu truy vấn thành kế hoạch (query plan); bộ quản lý bộ đệm chỉ chuyển trang giữa đĩa và bộ nhớ." },
    { id: 'q3',
      question: 'R(A, B) = {(1,a), (2,b), (3,a), (4,c)} and S(B, C) = {(a,10), (a,20), (b,5), (d,7)}. In set-based relational algebra, how many tuples does π A (σ C>6 (R ⋈ S)) have? (Checked on SQL Server with the SQL equivalent, SELECT DISTINCT.)|||R(A, B) = {(1,a), (2,b), (3,a), (4,c)} và S(B, C) = {(a,10), (a,20), (b,5), (d,7)}. Trong đại số quan hệ dạng tập hợp, π A (σ C>6 (R ⋈ S)) có bao nhiêu bộ? (Đã kiểm trên SQL Server bằng câu SQL tương đương, SELECT DISTINCT.)',
      options: ['4 rows: 1, 1, 3, 3|||4 dòng: 1, 1, 3, 3', '2 rows: 1 and 3|||2 dòng: 1 và 3', '3 rows: 1, 2 and 3|||3 dòng: 1, 2 và 3', '5 rows — one per joined tuple|||5 dòng — mỗi bộ đã nối một dòng'],
      correctIndex: 1,
      points: 1,
      explanation: 'Work from the inside out. R ⋈ S joins on B: a gives (1,a,10), (1,a,20), (3,a,10), (3,a,20); b gives (2,b,5); c and d match nothing — 5 tuples. σ C>6 drops (2,b,5), leaving 4. π A gives 1, 1, 3, 3, but a relation is a SET, so duplicates collapse to {1, 3}: 2 tuples. A is the bag answer — what SQL returns without DISTINCT; D forgets the selection.|||Làm từ trong ra ngoài. R ⋈ S nối theo B: a cho (1,a,10), (1,a,20), (3,a,10), (3,a,20); b cho (2,b,5); c và d không khớp gì — 5 bộ. σ C>6 bỏ (2,b,5), còn 4. π A cho 1, 1, 3, 3, nhưng quan hệ là một TẬP HỢP nên các bản trùng gộp lại thành {1, 3}: 2 bộ. A là đáp án kiểu túi (bag) — thứ SQL trả về khi không có DISTINCT; D quên mất phép chọn.' },
    { id: 'q4',
      question: 'Student(sid, email, name, phone): every student has a different sid and a different email; names and phones may repeat. Which set of attributes is a superkey but NOT a (candidate) key?|||Student(sid, email, name, phone): mỗi sinh viên có sid khác nhau và email khác nhau; tên và số điện thoại có thể trùng. Tập thuộc tính nào là siêu khoá (superkey) nhưng KHÔNG phải khoá (candidate key)?',
      options: ['{sid}|||{sid}', '{email}|||{email}', '{name, phone}|||{name, phone}', '{email, name}|||{email, name}'],
      correctIndex: 3,
      points: 1,
      explanation: 'A superkey is any set that identifies a row; a key is a MINIMAL superkey — remove any attribute and it stops identifying. {email, name} identifies every student (because email alone does), but name can be removed, so it is a superkey and not a key. A and B are keys: they are superkeys AND minimal, so they are not "superkey but not key". C is the trap for people who think "two columns together must be unique": two students can share both a name and a phone, so it is not even a superkey.|||Siêu khoá là bất kỳ tập nào xác định được một dòng; khoá là siêu khoá TỐI TIỂU — bỏ bất kỳ thuộc tính nào là hết xác định được. {email, name} xác định mọi sinh viên (vì riêng email đã đủ), nhưng bỏ được name, nên nó là siêu khoá mà không phải khoá. A và B là khoá: vừa là siêu khoá VỪA tối tiểu, nên không phải "siêu khoá nhưng không là khoá". C là bẫy cho ai nghĩ "hai cột ghép lại thì phải duy nhất": hai sinh viên có thể trùng cả tên lẫn số điện thoại, nên nó còn không phải siêu khoá.' },
    { id: 'q5',
      question: 'R(A, B, C). Which relational-algebra expression returns the same result as  SELECT DISTINCT A FROM R WHERE B = 1 ?|||R(A, B, C). Biểu thức đại số quan hệ nào cho cùng kết quả với  SELECT DISTINCT A FROM R WHERE B = 1 ?',
      options: ['π A (σ B=1 (R))|||π A (σ B=1 (R))', 'σ B=1 (π A (R))|||σ B=1 (π A (R))', 'π A,B (σ B=1 (R))|||π A,B (σ B=1 (R))', 'σ B=1 (R)|||σ B=1 (R)'],
      correctIndex: 0,
      points: 1,
      explanation: 'WHERE is the selection σ and the SELECT list is the projection π, applied in that order: first keep the rows with B = 1, then keep column A (DISTINCT matches the set semantics of π). B looks like the same two operators, but the order matters: after π A the column B no longer exists, so σ B=1 cannot be evaluated — the expression is not even valid. C returns two columns and D returns all three.|||WHERE là phép chọn σ và danh sách SELECT là phép chiếu π, làm theo đúng thứ tự đó: trước tiên giữ các dòng có B = 1, rồi giữ cột A (DISTINCT khớp với ngữ nghĩa tập hợp của π). B trông cũng là hai phép đó, nhưng thứ tự quan trọng: sau π A thì cột B không còn nữa, nên σ B=1 không tính được — biểu thức còn không hợp lệ. C trả về hai cột, D trả về cả ba cột.' },
    { id: 'q6',
      question: 'R(A, B, C, D, E) with F = {A → BC, CD → E, E → A}. Which list contains exactly all candidate keys of R?|||R(A, B, C, D, E) với F = {A → BC, CD → E, E → A}. Danh sách nào chứa đúng và đủ mọi khoá của R?',
      options: ['{AD}|||{AD}', '{AD, DE}|||{AD, DE}', '{AD, CD, DE}|||{AD, CD, DE}', '{D}|||{D}'],
      correctIndex: 2,
      points: 1,
      explanation: 'D is on no right-hand side, so every key must contain D — but D⁺ = D, so D alone is not a key (D is wrong). Try D plus one attribute: AD⁺: A → BC gives ABCD, CD → E gives ABCDE ✓. CD⁺: CD → E, E → A, A → BC gives ABCDE ✓. DE⁺: E → A, A → BC, gives ABCDE ✓. BD⁺ = BD ✗. So the keys are AD, CD and DE. B is the tempting answer of someone who stops after the keys that contain A or E and never tests CD — the FD CD → E makes it a key too.|||D không nằm ở vế phải FD nào, nên mọi khoá đều phải chứa D — nhưng D⁺ = D, nên riêng D không phải khoá (D sai). Thử D thêm một thuộc tính: AD⁺: A → BC cho ABCD, CD → E cho ABCDE ✓. CD⁺: CD → E, E → A, A → BC cho ABCDE ✓. DE⁺: E → A, A → BC cho ABCDE ✓. BD⁺ = BD ✗. Vậy các khoá là AD, CD và DE. B là đáp án hấp dẫn cho người dừng ở các khoá có A hoặc E mà không thử CD — chính FD CD → E khiến CD cũng là khoá.' },
    { id: 'q7',
      question: 'Orders(orderID, customerID, customerCity, total) with orderID → customerID, total and customerID → customerCity. What is the highest normal form of Orders?|||Orders(orderID, customerID, customerCity, total) với orderID → customerID, total và customerID → customerCity. Dạng chuẩn cao nhất của Orders là gì?',
      options: ['1NF|||1NF', '2NF|||2NF', '3NF|||3NF', 'BCNF|||BCNF'],
      correctIndex: 1,
      points: 1,
      explanation: 'The only key is orderID (its closure is everything). The key has ONE attribute, so no partial dependency is possible: 2NF holds. But customerID → customerCity has a left side that is not a superkey and a right side that is not prime: orderID → customerID → customerCity is a transitive dependency, so 3NF fails. A is the tempting answer for people who see "a non-key determines a non-key" and call it a partial dependency — partial means depending on PART of a composite key, which a one-attribute key cannot have. Fix: Customers(customerID, customerCity) + Orders(orderID, customerID, total).|||Khoá duy nhất là orderID (bao đóng của nó là toàn bộ). Khoá chỉ có MỘT thuộc tính, nên không thể có phụ thuộc bộ phận: đạt 2NF. Nhưng customerID → customerCity có vế trái không phải siêu khoá và vế phải không phải thuộc tính khoá: orderID → customerID → customerCity là phụ thuộc bắc cầu (transitive), nên trượt 3NF. A hấp dẫn với người thấy "cột không khoá xác định cột không khoá" rồi gọi là phụ thuộc bộ phận — phụ thuộc bộ phận là phụ thuộc vào MỘT PHẦN của khoá ghép, điều mà khoá một thuộc tính không thể có. Cách sửa: Customers(customerID, customerCity) + Orders(orderID, customerID, total).' },
    { id: 'q8',
      question: 'R(Student, Course, Teacher) with F = {Student Course → Teacher, Teacher → Course}. R is decomposed into R1(Teacher, Course) and R2(Student, Teacher). Which statement is true?|||R(Student, Course, Teacher) với F = {Student Course → Teacher, Teacher → Course}. R được phân rã thành R1(Teacher, Course) và R2(Student, Teacher). Phát biểu nào đúng?',
      options: ['Lossless, but Student Course → Teacher is not preserved|||Không mất mát, nhưng Student Course → Teacher không được bảo toàn', 'Lossy, because R1 and R2 share only Teacher|||Mất mát, vì R1 và R2 chỉ chung nhau Teacher', 'Lossless and every FD of F is preserved|||Không mất mát và mọi FD của F đều được bảo toàn', 'Not valid, because R1 and R2 are not in BCNF|||Không hợp lệ, vì R1 và R2 chưa đạt BCNF'],
      correctIndex: 0,
      points: 1,
      explanation: "The common attribute Teacher is a key of R1 (Teacher → Course), so the join R1 ⋈ R2 gives back exactly R: lossless (the chase also ends with an all-a row). But Student Course → Teacher mentions all three attributes, which now live in no single table, and the FDs left in R1 and R2 (only Teacher → Course) cannot derive it: that dependency is lost. This is slide 27's \"dependency loss\" and the textbook case where BCNF costs a dependency; R itself was 3NF (Course is prime). B is tempting, but one shared attribute is enough when it is a key of one side. D is false: both two-attribute tables are BCNF.|||Thuộc tính chung Teacher là khoá của R1 (Teacher → Course), nên phép nối R1 ⋈ R2 trả lại đúng R: không mất mát (bảng chase cũng kết thúc với một dòng toàn a). Nhưng Student Course → Teacher dùng cả ba thuộc tính, mà giờ chúng không còn nằm chung một bảng nào, và các FD còn lại trong R1, R2 (chỉ Teacher → Course) không suy ra được nó: phụ thuộc đó bị mất. Đây là \"mất phụ thuộc\" (dependency loss) của slide 27 và là ví dụ kinh điển BCNF phải trả giá bằng một phụ thuộc; bản thân R đạt 3NF (Course là thuộc tính khoá). B hấp dẫn, nhưng chỉ cần một thuộc tính chung là đủ khi nó là khoá của một bên. D sai: cả hai bảng hai thuộc tính đều đạt BCNF." },
    { id: 'q9',
      question: 'F = {A → B, BC → D, D → E}. Which functional dependency does NOT follow from F?|||F = {A → B, BC → D, D → E}. Phụ thuộc hàm nào KHÔNG suy ra được từ F?',
      options: ['AC → E|||AC → E', 'AC → BD|||AC → BD', 'ACD → B|||ACD → B', 'A → D|||A → D'],
      correctIndex: 3,
      points: 1,
      explanation: 'X → Y follows from F exactly when Y ⊆ X⁺. A⁺ = AB (A → B, and nothing else fires because BC → D needs C), and D is not in it, so A → D does not follow. AC⁺ = ABCDE (A → B, then BC → D, then D → E), so AC → E and AC → BD follow; ACD⁺ = ABCDE contains B, so ACD → B follows. A is the tempting "no" because E sits two steps away, but the closure chains through B and D to reach it. The trap in D is reading A → B and BC → D as "A → D", forgetting that BC → D needs C as well.|||X → Y suy ra được từ F đúng khi Y ⊆ X⁺. A⁺ = AB (A → B, rồi không FD nào kích hoạt nữa vì BC → D cần có C), D không nằm trong đó, nên A → D không suy ra được. AC⁺ = ABCDE (A → B, rồi BC → D, rồi D → E), nên AC → E và AC → BD suy ra được; ACD⁺ = ABCDE chứa B, nên ACD → B suy ra được. A là phương án "không" hấp dẫn vì E cách hai bước, nhưng bao đóng đi qua B và D để tới được nó. Bẫy ở D là đọc A → B và BC → D thành "A → D", quên rằng BC → D còn cần C.' },
    { id: 'q10',
      question: 'An ERD has the entities Employee and Department and the weak entity Dependent. Relationships: WorksFor (each employee works in one department; a department has many employees), Manages (1-1 with the attribute startDate; every department has exactly one manager), Supervises (recursive: one employee supervises many), and DependentOf (the identifying relationship of Dependent). With the standard rules, how many tables do you get?|||Một ERD có thực thể Employee, Department và thực thể yếu Dependent. Liên kết: WorksFor (mỗi nhân viên làm ở một phòng; một phòng có nhiều nhân viên), Manages (1-1 có thuộc tính startDate; mỗi phòng có đúng một trưởng phòng), Supervises (đệ quy: một nhân viên giám sát nhiều người), và DependentOf (liên kết xác định của Dependent). Theo các quy tắc chuẩn, bạn được bao nhiêu bảng?',
      options: ['7 — one per entity and per relationship|||7 — mỗi thực thể và mỗi liên kết một bảng', '3 — every relationship becomes a foreign key|||3 — mọi liên kết đều thành khoá ngoại', '4 — only Supervises needs its own table|||4 — chỉ riêng Supervises cần bảng riêng', '5 — Manages and Supervises need tables|||5 — Manages và Supervises cần bảng riêng'],
      correctIndex: 1,
      points: 1,
      explanation: "No relationship here is many-to-many, so none needs a table of its own. WorksFor (N-1) → depNum in Employee; Supervises (1-N, recursive) → supervisorSSN in Employee pointing back to Employee; Manages (1-1, Department total) → mgrSSN and startDate in Department; DependentOf is absorbed by the weak entity: Dependent(empSSN, depName, …) with key (empSSN, depName). Three tables — exactly FUHCompany's tblEmployee, tblDepartment, tblDependent. C is tempting because a recursive relationship \"looks different\", but it is still 1-N and becomes a self-referencing foreign key.|||Ở đây không liên kết nào là nhiều-nhiều, nên không cái nào cần bảng riêng. WorksFor (N-1) → cột depNum trong Employee; Supervises (1-N, đệ quy) → cột supervisorSSN trong Employee trỏ ngược về chính Employee; Manages (1-1, phía Department tham gia toàn phần) → mgrSSN và startDate trong Department; DependentOf được thực thể yếu hấp thụ: Dependent(empSSN, depName, …) với khoá (empSSN, depName). Ba bảng — đúng tblEmployee, tblDepartment, tblDependent của FUHCompany. C hấp dẫn vì liên kết đệ quy \"trông khác\", nhưng nó vẫn là 1-N và thành một khoá ngoại tự tham chiếu." },
    { id: 'q11',
      question: 'Person(pid, name) has two subclasses: Student with the attribute gpa and Lecturer with the attribute salary; one person may be both. With the E/R-style strategy, what does the relation for Student look like?|||Person(pid, name) có hai lớp con: Student có thuộc tính gpa và Lecturer có thuộc tính salary; một người có thể thuộc cả hai. Theo chiến lược kiểu E/R (E/R style), quan hệ của Student trông thế nào?',
      options: ['Student(pid, name, gpa)|||Student(pid, name, gpa)', 'Student(gpa)|||Student(gpa)', 'Student(pid, gpa)|||Student(pid, gpa)', 'Person(pid, name, gpa, salary)|||Person(pid, name, gpa, salary)'],
      correctIndex: 2,
      points: 1,
      explanation: 'In the E/R style every subclass relation holds the key of the root plus its OWN attributes only; the inherited attributes (name) stay in Person and are fetched by a join on pid. A is the object-oriented strategy, which copies every inherited attribute into each subclass combination. D is the "use NULL values" strategy: one relation for the whole hierarchy. B has no key, so a gpa could not be linked to any person.|||Theo kiểu E/R, quan hệ của mỗi lớp con chứa khoá của lớp gốc cộng CHỈ các thuộc tính RIÊNG của nó; thuộc tính kế thừa (name) nằm lại trong Person và lấy ra bằng phép nối theo pid. A là chiến lược hướng đối tượng (object-oriented), chép mọi thuộc tính kế thừa vào từng tổ hợp lớp con. D là chiến lược "dùng giá trị NULL": một quan hệ cho cả cây phân cấp. B không có khoá, nên một gpa không gắn được với người nào.' },
    { id: 'q12',
      question: '"Every department is managed by exactly one employee; an employee manages at most one department." How should this 1-1 relationship be stored?|||"Mỗi phòng do đúng một nhân viên quản lý; một nhân viên quản lý nhiều nhất một phòng." Liên kết 1-1 này nên lưu thế nào?',
      options: ['A separate table Manages(depNum, empSSN)|||Một bảng riêng Manages(depNum, empSSN)', 'A column depManaged in Employee, NULL for most|||Cột depManaged trong Employee, đa số là NULL', 'Merge Department and Employee into one table|||Gộp Department và Employee thành một bảng', 'A column mgrSSN NOT NULL UNIQUE in Department|||Cột mgrSSN NOT NULL UNIQUE trong Department'],
      correctIndex: 3,
      points: 1,
      explanation: "Slide 20 of the ERD chapter: when one side participates totally (every department HAS a manager), put the other side's key into the total side's table. NOT NULL enforces \"exactly one manager\", UNIQUE enforces \"at most one department per employee\" — that UNIQUE is what turns many-one into one-one. B also works technically, but almost every employee would carry a NULL and \"every department has a manager\" could not be enforced. A separate table (A) is the rule for 1-1 when neither side is total.|||Slide 20 chương ERD: khi một phía tham gia toàn phần (mỗi phòng ĐỀU CÓ trưởng phòng), đặt khoá của phía kia vào bảng của phía toàn phần. NOT NULL ép \"đúng một trưởng phòng\", UNIQUE ép \"mỗi nhân viên nhiều nhất một phòng\" — chính UNIQUE biến nhiều-một thành một-một. B về kỹ thuật cũng chạy, nhưng gần như mọi nhân viên sẽ mang NULL và không ép được \"phòng nào cũng có trưởng phòng\". Bảng riêng (A) là quy tắc cho 1-1 khi không phía nào tham gia toàn phần." },
    { id: 'q13',
      question: 'FUHCompany: projects in Hà Nội (locNum 1) are ProjectA (department 1) and ProjectC (department 2); departments 1–5 exist. How many rows does this query return?|||FUHCompany: dự án ở Hà Nội (locNum 1) là ProjectA (phòng 1) và ProjectC (phòng 2); có các phòng 1–5. Câu truy vấn này trả về bao nhiêu dòng?',
      code: `SELECT d.depNum, d.depName
FROM tblDepartment d
LEFT JOIN tblProject p
       ON p.depNum = d.depNum AND p.locNum = 1
WHERE p.proNum IS NULL;`,
      codeLang: 'sql',
      options: ['3 rows: departments 3, 4 and 5|||3 dòng: phòng 3, 4 và 5', '1 row: department 5, which has no project|||1 dòng: phòng 5, phòng không có dự án nào', '0 rows — the WHERE undoes the LEFT JOIN|||0 dòng — WHERE làm mất tác dụng của LEFT JOIN', '5 rows — a LEFT JOIN keeps every department|||5 dòng — LEFT JOIN giữ mọi phòng'],
      correctIndex: 0,
      points: 1,
      explanation: 'The condition p.locNum = 1 sits in ON, so it only decides which projects may be attached; every department survives, padded with NULL when no Hà Nội project matches. Departments 1 and 2 get ProjectA and ProjectC; 3, 4 and 5 get NULL, and WHERE p.proNum IS NULL keeps exactly those: "departments with no project in Hà Nội". B is what you get if you read it as "departments with no project at all" — department 3 and 4 do have projects, just not in Hà Nội. Moving p.locNum = 1 into WHERE would indeed change the result, which is the classic ON-vs-WHERE trap.|||Điều kiện p.locNum = 1 nằm trong ON, nên nó chỉ quyết định dự án nào được gắn vào; mọi phòng đều được giữ, đệm NULL khi không có dự án Hà Nội nào khớp. Phòng 1 và 2 được gắn ProjectA và ProjectC; phòng 3, 4, 5 nhận NULL, và WHERE p.proNum IS NULL giữ đúng các phòng đó: "phòng không có dự án nào ở Hà Nội". B là kết quả nếu bạn đọc thành "phòng không có dự án nào cả" — phòng 3 và 4 có dự án, chỉ là không ở Hà Nội. Chuyển p.locNum = 1 xuống WHERE thì kết quả mới đổi — đó là bẫy kinh điển ON hay WHERE.' },
    { id: 'q14',
      question: 'FUHCompany salaries — dept 1: 150000, 90000, 60000, 45000 · dept 2: 55000, 95000, 72000, 105000 · dept 3: 88000, 40000, 52000 · dept 4: 70000 · dept 5: 65000, 38000. How many rows does this query return?|||Lương ở FUHCompany — phòng 1: 150000, 90000, 60000, 45000 · phòng 2: 55000, 95000, 72000, 105000 · phòng 3: 88000, 40000, 52000 · phòng 4: 70000 · phòng 5: 65000, 38000. Câu truy vấn này trả về bao nhiêu dòng?',
      code: `SELECT depNum, COUNT(*) AS n
FROM tblEmployee
WHERE empSalary > 60000
GROUP BY depNum
HAVING COUNT(*) >= 2;`,
      codeLang: 'sql',
      options: ['5 rows — every department has an employee above 60000|||5 dòng — phòng nào cũng có người lương trên 60000', '3 rows: departments 1, 2 and 3|||3 dòng: phòng 1, 2 và 3', '2 rows: departments 1 and 2|||2 dòng: phòng 1 và 2', '1 row: department 2|||1 dòng: phòng 2'],
      correctIndex: 2,
      points: 1,
      explanation: 'WHERE runs first and keeps only salaries strictly above 60000: dept 1 keeps 150000 and 90000 (60000 is not > 60000), dept 2 keeps 95000, 72000, 105000, dept 3 keeps 88000, dept 4 keeps 70000, dept 5 keeps 65000. GROUP BY then counts 2, 3, 1, 1, 1, and HAVING COUNT(*) >= 2 keeps departments 1 and 2. B counts dept 3 using its original 3 employees — but HAVING counts what is left AFTER WHERE. D forgets that the boundary is >= 2, not > 2, or wrongly counts 60000 as above 60000.|||WHERE chạy trước và chỉ giữ lương lớn hơn hẳn 60000: phòng 1 giữ 150000 và 90000 (60000 không > 60000), phòng 2 giữ 95000, 72000, 105000, phòng 3 giữ 88000, phòng 4 giữ 70000, phòng 5 giữ 65000. Sau đó GROUP BY đếm được 2, 3, 1, 1, 1, và HAVING COUNT(*) >= 2 giữ phòng 1 và 2. B đếm phòng 3 theo 3 nhân viên ban đầu — nhưng HAVING đếm những gì còn lại SAU WHERE. D quên rằng ngưỡng là >= 2 chứ không phải > 2, hoặc tính nhầm 60000 là trên 60000.' },
    { id: 'q15',
      question: 'In FUHCompany, supervisorSSN points to another employee (the director 001 has none). What does this query return?|||Trong FUHCompany, supervisorSSN trỏ tới một nhân viên khác (giám đốc 001 không có ai giám sát). Câu truy vấn này trả về gì?',
      code: `SELECT e.empName
FROM tblEmployee e
JOIN tblEmployee s ON e.supervisorSSN = s.empSSN
WHERE e.empSalary > s.empSalary;`,
      codeLang: 'sql',
      options: ['Trần Minh Quang, the director with the top salary|||Trần Minh Quang, giám đốc có lương cao nhất', 'Only Đặng Tuấn Anh (105000, supervisor earns 95000)|||Chỉ Đặng Tuấn Anh (105000, người giám sát 95000)', 'No row — nobody earns more than their supervisor|||Không dòng nào — không ai lương cao hơn người giám sát', 'An error — one table cannot be joined to itself|||Báo lỗi — một bảng không thể nối với chính nó'],
      correctIndex: 1,
      points: 1,
      explanation: "The two aliases e (employee) and s (supervisor) make one table play two roles: each row of e is paired with the row of s whose empSSN equals e.supervisorSSN. Comparing each pair, only Đặng Tuấn Anh (105000) earns more than his supervisor Phạm Quốc Bảo (95000). A is tempting because Trần Minh Quang has the highest salary, but his supervisorSSN is NULL, so the inner join gives him no pair and he cannot appear. D is false: a self-join with aliases is standard SQL (slide 39's Example 9).|||Hai bí danh e (nhân viên) và s (người giám sát) cho một bảng đóng hai vai: mỗi dòng của e được ghép với dòng của s có empSSN bằng e.supervisorSSN. So từng cặp, chỉ Đặng Tuấn Anh (105000) lương cao hơn người giám sát Phạm Quốc Bảo (95000). A hấp dẫn vì Trần Minh Quang lương cao nhất, nhưng supervisorSSN của ông là NULL nên phép nối trong không ghép được cặp nào cho ông và ông không thể xuất hiện. D sai: tự nối (self-join) có bí danh là SQL chuẩn (Example 9 ở slide 39)." },
    { id: 'q16',
      question: 'In FUHCompany the projects in TP Hồ Chí Minh (locNum 2) belong to departments 1, 2 and 4, which have 4, 4 and 1 employees. How many rows does this UPDATE change?|||Trong FUHCompany, các dự án ở TP Hồ Chí Minh (locNum 2) thuộc phòng 1, 2 và 4, ba phòng có 4, 4 và 1 nhân viên. Câu UPDATE này sửa bao nhiêu dòng?',
      code: `UPDATE tblEmployee
SET empSalary = empSalary * 1.1
WHERE depNum IN (SELECT depNum FROM tblProject WHERE locNum = 2);`,
      codeLang: 'sql',
      options: ['3 — one per project in TP Hồ Chí Minh|||3 — mỗi dự án ở TP Hồ Chí Minh một dòng', '14 — the subquery returns several values|||14 — truy vấn con trả về nhiều giá trị', '0 — IN cannot compare with a subquery|||0 — IN không so được với truy vấn con', '9 — every employee of departments 1, 2 and 4|||9 — mọi nhân viên của phòng 1, 2 và 4'],
      correctIndex: 3,
      points: 1,
      explanation: 'The subquery returns the department numbers 1, 2, 4 (one per HCM project); IN turns them into the condition depNum = 1 OR depNum = 2 OR depNum = 4, and UPDATE touches every employee row that satisfies it: 4 + 4 + 1 = 9. A counts projects instead of the employees being updated. B is the reason = would fail here (a subquery used with = must return one value), but IN is made exactly for a list, and it never widens the update to the whole table.|||Truy vấn con trả về các số phòng 1, 2, 4 (mỗi dự án ở HCM một số); IN biến chúng thành điều kiện depNum = 1 OR depNum = 2 OR depNum = 4, và UPDATE sửa mọi dòng nhân viên thoả điều kiện đó: 4 + 4 + 1 = 9. A đếm dự án thay vì đếm nhân viên được sửa. B là lý do dấu = sẽ lỗi ở đây (truy vấn con dùng với = phải trả về một giá trị), nhưng IN sinh ra chính là để nhận một danh sách, và nó không bao giờ mở rộng việc sửa ra cả bảng.' },
    { id: 'q17',
      question: 'tblEmployee holds 14 employees. The trigger below is created, then ONE INSERT statement adds two employees (salaries 50000 and 120000). What does the final SELECT return?|||tblEmployee có 14 nhân viên. Trigger dưới đây được tạo, rồi MỘT câu INSERT thêm hai nhân viên (lương 50000 và 120000). Câu SELECT cuối trả về gì?',
      code: `CREATE TRIGGER trg_employee_salary ON tblEmployee
AFTER INSERT
AS
BEGIN
    IF EXISTS (SELECT * FROM inserted WHERE empSalary > 100000)
    BEGIN
        RAISERROR('Salary above 100000 is not allowed', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
GO
INSERT INTO tblEmployee (empSSN, empName, empSalary, depNum)
VALUES (30121050101, N'Ngô Văn Tư', 50000, 1),
       (30121050102, N'Đỗ Thị Năm', 120000, 1);
GO
SELECT COUNT(*) AS total FROM tblEmployee;`,
      codeLang: 'sql',
      options: ['14 — the ROLLBACK undoes the whole INSERT, both rows|||14 — ROLLBACK huỷ cả câu INSERT, cả hai dòng', '15 — only the row with 120000 is removed|||15 — chỉ dòng lương 120000 bị bỏ', '16 — an AFTER trigger fires too late to stop|||16 — trigger AFTER chạy quá muộn để chặn', '16 — RAISERROR alone only prints a message|||16 — riêng RAISERROR chỉ in ra một thông báo'],
      correctIndex: 0,
      points: 1,
      explanation: "An AFTER trigger fires ONCE per statement, and inserted holds both new rows. EXISTS finds the 120000 row, RAISERROR reports the error and ROLLBACK TRANSACTION undoes the whole statement — both rows, because they were inserted by the same INSERT inside the same transaction (the batch is then aborted with Msg 3609). B is the tempting row-by-row thinking: a T-SQL trigger does not work per row, so it cannot keep the good row and drop the bad one. C is wrong because an AFTER trigger still runs inside the statement's transaction, so it can roll it back.|||Trigger AFTER chạy MỘT lần cho mỗi câu lệnh, và bảng inserted chứa cả hai dòng mới. EXISTS thấy dòng 120000, RAISERROR báo lỗi và ROLLBACK TRANSACTION huỷ cả câu lệnh — cả hai dòng, vì chúng được chèn bởi cùng một câu INSERT trong cùng một giao dịch (sau đó lô lệnh bị huỷ với Msg 3609). B là lối nghĩ từng dòng rất hấp dẫn: trigger T-SQL không chạy theo từng dòng, nên không thể giữ dòng tốt và bỏ dòng xấu. C sai vì trigger AFTER vẫn chạy bên trong giao dịch của câu lệnh, nên vẫn huỷ được nó." },
    { id: 'q18',
      question: 'In FUHCompany two employees (037 and 038) work on no project. What does this code return?|||Trong FUHCompany có hai nhân viên (037 và 038) không làm dự án nào. Đoạn code này trả về gì?',
      code: `CREATE FUNCTION dbo.fnTotalHours (@ssn DECIMAL(18,0))
RETURNS DECIMAL(6,1)
AS
BEGIN
    RETURN (SELECT SUM(workHours) FROM tblWorksOn WHERE empSSN = @ssn);
END
GO
SELECT COUNT(*) AS n
FROM tblEmployee
WHERE dbo.fnTotalHours(empSSN) = 0;`,
      codeLang: 'sql',
      options: ['2 — employees 037 and 038 have 0 hours|||2 — nhân viên 037 và 038 có 0 giờ', 'An error — a function cannot be used in WHERE|||Báo lỗi — không dùng hàm trong WHERE được', '0 — for them the function returns NULL, not 0|||0 — với họ hàm trả về NULL, không phải 0', '14 — the function is called once per employee|||14 — hàm được gọi một lần cho mỗi nhân viên'],
      correctIndex: 2,
      points: 1,
      explanation: 'SUM over zero rows is NULL, not 0, so dbo.fnTotalHours returns NULL for 037 and 038; NULL = 0 is UNKNOWN, and WHERE keeps only TRUE, so no employee qualifies and COUNT(*) is 0. A is the intended meaning, and it is exactly the trap: to get it, return ISNULL(SUM(workHours), 0) (COALESCE on PostgreSQL) or test IS NULL. B is false: a scalar function can be used anywhere an expression can, including WHERE.|||SUM trên không dòng nào cho NULL, không phải 0, nên dbo.fnTotalHours trả về NULL cho 037 và 038; NULL = 0 là UNKNOWN, mà WHERE chỉ giữ TRUE, nên không nhân viên nào thoả và COUNT(*) là 0. A là ý định của người viết, và đó chính là cái bẫy: muốn có nó thì trả về ISNULL(SUM(workHours), 0) (trên PostgreSQL là COALESCE) hoặc kiểm IS NULL. B sai: hàm vô hướng (scalar function) dùng được ở mọi chỗ dùng được biểu thức, kể cả WHERE.' },
    { id: 'q19',
      question: 'On SQL Server with the default settings (XACT_ABORT OFF), what does the last SELECT return?|||Trên SQL Server với thiết lập mặc định (XACT_ABORT OFF), câu SELECT cuối trả về gì?',
      code: `CREATE TABLE Acc (id INT CONSTRAINT pk_acc PRIMARY KEY, bal INT);
INSERT INTO Acc VALUES (1, 100);
GO
BEGIN TRANSACTION;
    INSERT INTO Acc VALUES (2, 200);
    INSERT INTO Acc VALUES (1, 999);   -- duplicate key
COMMIT TRANSACTION;
GO
SELECT COUNT(*) AS n FROM Acc;`,
      codeLang: 'sql',
      options: ['1 — the error rolls the whole transaction back|||1 — lỗi làm cả giao dịch bị huỷ', '2 — only the failed INSERT is undone; COMMIT keeps row 2|||2 — chỉ INSERT lỗi bị huỷ; COMMIT giữ dòng 2', '3 — the duplicate key 1 is stored a second time|||3 — khoá trùng 1 được lưu thêm lần nữa', '0 — COMMIT fails, so every row is lost|||0 — COMMIT thất bại, nên mất hết mọi dòng'],
      correctIndex: 1,
      points: 1,
      explanation: 'A primary-key violation (Msg 2627) only terminates the failing STATEMENT; the transaction stays open, the batch goes on, and COMMIT saves what succeeded — row 2. So the table holds ids 1 and 2. A is what most people expect from "a transaction is all or nothing", but atomicity must be built: check the error with TRY...CATCH and ROLLBACK, or SET XACT_ABORT ON so that any error rolls the whole transaction back. C is impossible because the primary key refuses the duplicate.|||Lỗi vi phạm khoá chính (Msg 2627) chỉ chấm dứt CÂU LỆNH bị lỗi; giao dịch vẫn mở, lô lệnh chạy tiếp, và COMMIT lưu những gì đã thành công — dòng 2. Vậy bảng có id 1 và 2. A là điều đa số mong đợi từ câu "giao dịch là tất cả hoặc không gì cả", nhưng tính nguyên tử (atomicity) phải tự dựng: bắt lỗi bằng TRY...CATCH rồi ROLLBACK, hoặc SET XACT_ABORT ON để mọi lỗi đều huỷ cả giao dịch. C không thể xảy ra vì khoá chính từ chối bản trùng.' },
    { id: 'q20',
      question: 'The script below runs on SQL Server, each part as its own batch. How many indexes does table T have at the end?|||Đoạn script dưới đây chạy trên SQL Server, mỗi phần là một lô lệnh riêng. Cuối cùng bảng T có bao nhiêu chỉ mục (index)?',
      code: `CREATE TABLE T (
    id    INT         CONSTRAINT pk_t PRIMARY KEY,
    email VARCHAR(50) CONSTRAINT uq_t_email UNIQUE,
    name  VARCHAR(50)
);
GO
CREATE CLUSTERED INDEX ix_t_name ON T(name);
GO
CREATE NONCLUSTERED INDEX ix_t_name2 ON T(name);
GO`,
      codeLang: 'sql',
      options: ['1 — only CREATE INDEX statements make indexes|||1 — chỉ câu CREATE INDEX mới tạo chỉ mục', '2 — PRIMARY KEY and UNIQUE are not indexes|||2 — PRIMARY KEY và UNIQUE không phải chỉ mục', '4 — every statement creates one index|||4 — mỗi câu lệnh tạo một chỉ mục', '3 — the second clustered index is refused|||3 — chỉ mục gom cụm thứ hai bị từ chối'],
      correctIndex: 3,
      points: 1,
      explanation: "PRIMARY KEY creates a clustered index by default (pk_t) and UNIQUE creates a nonclustered one (uq_t_email). A table's rows can be physically sorted only one way, so CREATE CLUSTERED INDEX ix_t_name fails with Msg 1902 (\"Cannot create more than one clustered index\"). The nonclustered ix_t_name2 succeeds: pk_t, uq_t_email, ix_t_name2 = 3. C forgets the one-clustered-index rule; A and B forget that SQL Server enforces PRIMARY KEY and UNIQUE by building an index behind them.|||PRIMARY KEY mặc định tạo một chỉ mục gom cụm (clustered — pk_t) và UNIQUE tạo một chỉ mục không gom cụm (nonclustered — uq_t_email). Các dòng của một bảng chỉ sắp xếp vật lý được theo một cách, nên CREATE CLUSTERED INDEX ix_t_name thất bại với Msg 1902 (\"không thể tạo nhiều hơn một clustered index\"). Chỉ mục không gom cụm ix_t_name2 thành công: pk_t, uq_t_email, ix_t_name2 = 3. C quên luật một chỉ mục gom cụm; A và B quên rằng SQL Server bảo đảm PRIMARY KEY và UNIQUE bằng cách dựng một chỉ mục phía sau chúng." },
  ],
};

export default {
  quiz: QUIZ,
  quizDescription: 'Đề FE 20 câu phủ cả môn DBI202 theo 7 CLO của syllabus — khái niệm DBMS, đại số quan hệ, khoá và chuẩn hoá, ERD sang bảng, truy vấn SQL trên FUHCompany, trigger và hàm T-SQL, giao dịch và chỉ mục; mọi câu "kết quả là gì" đã chạy thật trên SQL Server, mọi câu khoá/FD đã kiểm bằng script.',
};
