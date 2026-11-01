/**
 * DBI202 · Chương 3 — LAB 3 (bản in): đề PE mini "phòng khám" của bài 3.5 — từ đoạn nghiệp vụ tới CSDL chạy được.
 * 5 câu × 2 điểm (Q1–Q4 dựng bảng theo ERD, Q5 một truy vấn trên CSDL chuẩn). Câu sau chấm trên lược đồ CHUẨN của các
 * câu trước (máy chấm tự dựng). Kiểm theo hành vi + cấu trúc cột.
 */
import { doiDau, KHOA, deLonSql, sau, chan, duoc, kq, kqAn, cot, TN } from './_chung.mjs';

const Q1 = `CREATE TABLE Specialty (
    specID   CHAR(3)     NOT NULL PRIMARY KEY,
    specName VARCHAR(40) NOT NULL UNIQUE
);
CREATE TABLE Doctor (
    doctorID CHAR(5)     NOT NULL PRIMARY KEY,
    fullName VARCHAR(50) NOT NULL,
    specID   CHAR(3)     NOT NULL REFERENCES Specialty (specID)      -- belongs to: N-1
);`;
const Q2 = `CREATE TABLE Patient (
    patientID INT         NOT NULL PRIMARY KEY,
    fullName  VARCHAR(50) NOT NULL,
    gender    CHAR(1)     NULL CHECK (gender IN ('M', 'F')),
    birthDate DATE        NULL
);`;
const Q3 = `CREATE TABLE Visit (                                               -- strong entity: its own id
    visitID   INT          NOT NULL PRIMARY KEY,
    visitDate DATE         NOT NULL,
    diagnosis VARCHAR(200) NULL,
    patientID INT          NOT NULL REFERENCES Patient (patientID),
    doctorID  CHAR(5)      NOT NULL REFERENCES Doctor (doctorID)
);`;
const Q4 = `CREATE TABLE Medicine (
    medID   INT         NOT NULL PRIMARY KEY,
    medName VARCHAR(60) NOT NULL,
    unit    VARCHAR(10) NOT NULL
);
CREATE TABLE Prescribes (                                          -- M-N Visit–Medicine with attributes
    visitID  INT          NOT NULL REFERENCES Visit (visitID) ON DELETE CASCADE,
    medID    INT          NOT NULL REFERENCES Medicine (medID),
    quantity INT          NOT NULL CHECK (quantity > 0),
    dosage   VARCHAR(100) NULL,
    PRIMARY KEY (visitID, medID)
);`;
const DATA = `INSERT INTO Specialty VALUES ('NOI', 'Internal medicine'), ('NHI', 'Paediatrics'), ('MAT', 'Ophthalmology');
INSERT INTO Doctor VALUES ('D0001', 'Tran Hoa', 'NOI'), ('D0002', 'Le Mai', 'NHI'), ('D0003', 'Pham Son', 'MAT');
INSERT INTO Patient VALUES (1, 'Nguyen An', 'M', '1990-05-01'), (2, 'Do Bich', 'F', '2019-03-12'), (3, 'Vo Cuong', 'M', NULL);
INSERT INTO Visit VALUES (1001, '2026-10-01', 'flu', 1, 'D0001'), (1002, '2026-10-02', 'fever', 2, 'D0002'), (1003, '2026-10-05', 'check-up', 3, 'D0003'), (1004, '2026-10-06', 'cough', 1, 'D0001');
INSERT INTO Medicine VALUES (1, 'Paracetamol', 'tablet'), (2, 'Vitamin C', 'tablet'), (3, 'Cough syrup', 'bottle');
INSERT INTO Prescribes VALUES (1001, 1, 10, '2/day'), (1001, 2, 20, '1/day'), (1002, 1, 6, '3/day'), (1004, 3, 1, '10 ml x 3');`;
const CO_SO = `${Q1}\n${Q2}\n${Q3}\n${Q4}\n${DATA}`;
const Q12 = `${Q1}\n${Q2}`;
const Q123 = `${Q1}\n${Q2}\n${Q3}`;
const NEN3 = `INSERT INTO Specialty VALUES ('NOI', 'Internal'); INSERT INTO Doctor VALUES ('D0001', 'Ha', 'NOI'); INSERT INTO Patient VALUES (1, 'An', 'M', NULL);`;
const NEN4 = `${NEN3} INSERT INTO Visit VALUES (1001, '2026-10-01', 'flu', 1, 'D0001'); INSERT INTO Medicine VALUES (1, 'Paracetamol', 'tablet');`;

export default doiDau({
  slug: 'dbi202-3-lab-phong-kham',
  ten: 'Lab 3 — Clinic: from a business paragraph to a working database',
  khoa: KHOA,
  baiHoc: 'dbi202-on-ch3',
  de: [
    deLonSql({
      dangBai: 'lab',
      tieuDe: 'Lab 3 — Clinic database: ERD → CREATE TABLE (PE question 1 style)',
      doKho: 'HARD', phut: 60, diem: 100,
      khaiNiem: ['ERD to tables', 'N-1 as foreign key', 'M-N with attributes', 'CHECK / UNIQUE', 'ON DELETE CASCADE'],
      tienQuyet: ['3.4 and 3.5 of this track'],
      the: ['dbi202', 'lab', 'erd', 'ddl', 'pe-q1'],
      csdl: CO_SO, tenCsdl: 'Clinic',
      thuMuc: 'RollNo_Name_DBI202_Lab3',
      phu: { en: 'DBI202 · Chapter 3 — ER modelling · Suggested time: 60 minutes · Total: 10 marks (5 × 2)', vi: 'DBI202 · Chương 3 — Mô hình ER · Thời gian gợi ý: 60 phút · Tổng: 10 điểm (5 × 2)' },
      moTa: {
        en: '<p>A clinic manages doctors (ID, full name), each belonging to exactly one specialty (code, unique name). Patients have an ID, a full name, a gender (M/F) and a birth date. Each visit has an ID, a date, a diagnosis, and is for one patient with one doctor. During a visit the doctor prescribes several medicines (ID, name, unit), each with a positive quantity and a dosage.</p><pre>[Specialty] specID*, specName ── 1 ──&lt;belongs to&gt;── N ── [Doctor] doctorID*, fullName\n[Doctor] ── 1 ──&lt;examines&gt;── N ── [Visit] visitID*, visitDate, diagnosis ── N ──&lt;has&gt;── 1 ── [Patient]\n[Visit] ── M ──&lt;prescribes (quantity, dosage)&gt;── N ── [Medicine] medID*, medName, unit</pre><p>Build the database question by question. Each question is graded on the <b>reference</b> schema of the previous ones (tab <code>Clinic.sql</code>).</p>',
        vi: '<p>Một phòng khám quản lý bác sĩ (mã, họ tên), mỗi bác sĩ thuộc đúng một chuyên khoa (mã, tên duy nhất). Bệnh nhân có mã, họ tên, giới tính (M/F) và ngày sinh. Mỗi lượt khám có mã, ngày, chẩn đoán, dành cho một bệnh nhân với một bác sĩ. Trong lượt khám bác sĩ kê nhiều thuốc (mã, tên, đơn vị), mỗi thuốc có số lượng dương và liều dùng.</p><p>Dựng CSDL từng câu một (ERD ở bản tiếng Anh). Mỗi câu được chấm trên lược đồ <b>chuẩn</b> của các câu trước (tab <code>Clinic.sql</code>).</p>',
      },
      yeuCauChung: [
        { en: 'Portable types only: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE (on the real PE, NVARCHAR for Vietnamese text and DATETIME for a time stamp). Names exactly as in the data model.', vi: 'Chỉ kiểu chạy mọi hệ: INT, CHAR(n), VARCHAR(n), DECIMAL(p,s), DATE (PE thật dùng NVARCHAR cho chữ Việt và DATETIME cho mốc giờ). Tên đúng như mô hình dữ liệu.' },
        { en: 'Graded by behaviour: valid rows accepted, invalid rows rejected; plus the list of columns.', vi: 'Chấm theo hành vi: dòng hợp lệ vào được, dòng sai bị chặn; cộng danh sách cột.' },
      ],
      moHinh: [
        { ten: 'Specialty', truong: [['specID', 'CHAR(3)', 'PK'], ['specName', 'VARCHAR(40)', 'required, UNIQUE']] },
        { ten: 'Doctor', truong: [['doctorID', 'CHAR(5)', 'PK'], ['fullName', 'VARCHAR(50)', 'required'], ['specID', 'CHAR(3)', 'required, FK → Specialty']] },
        { ten: 'Patient', truong: [['patientID', 'INT', 'PK'], ['fullName', 'VARCHAR(50)', 'required'], ['gender', 'CHAR(1)', "'M' / 'F'"], ['birthDate', 'DATE', 'optional']] },
        { ten: 'Visit', truong: [['visitID', 'INT', 'PK'], ['visitDate', 'DATE', 'required'], ['diagnosis', 'VARCHAR(200)', 'optional'], ['patientID', 'INT', 'required, FK → Patient'], ['doctorID', 'CHAR(5)', 'required, FK → Doctor']] },
        { ten: 'Medicine', truong: [['medID', 'INT', 'PK'], ['medName', 'VARCHAR(60)', 'required'], ['unit', 'VARCHAR(10)', 'required']] },
        { ten: 'Prescribes', truong: [['visitID', 'INT', 'PK, FK → Visit (cascade)'], ['medID', 'INT', 'PK, FK → Medicine'], ['quantity', 'INT', 'required, > 0'], ['dosage', 'VARCHAR(100)', 'optional']] },
      ],
      cau: [
        {
          ten: { en: 'Specialty and Doctor', vi: 'Specialty và Doctor' }, diem: 2,
          moTa: { en: 'Create Specialty and Doctor. Every doctor belongs to exactly one specialty; specialty names are unique.', vi: 'Tạo Specialty và Doctor. Mỗi bác sĩ thuộc đúng một chuyên khoa; tên chuyên khoa không trùng.' },
          yeuCau: [{ en: 'belongs to (N-1) ⇒ Doctor.specID NOT NULL REFERENCES Specialty.', vi: 'belongs to (N-1) ⇒ Doctor.specID NOT NULL REFERENCES Specialty.' }],
          giai: Q1,
          kiem: [
            { ...sau('Q1 · tables and columns', cot(['Specialty', 'Doctor'])), csdl: '' },
            { ...duoc('Q1 · two doctors in one specialty', "INSERT INTO Specialty VALUES ('NOI', 'Internal'); INSERT INTO Doctor VALUES ('D0001', 'Ha', 'NOI'), ('D0002', 'Mai', 'NOI')"), csdl: '' },
            { ...chan('Q1 · duplicate specialty name', "INSERT INTO Specialty VALUES ('NOI', 'Internal'), ('NO2', 'Internal')", '23505'), csdl: '' },
            { ...chan('Q1 · doctor without specialty', "INSERT INTO Doctor (doctorID, fullName) VALUES ('D0001', 'Ha')", '23502'), csdl: '', an: true },
            { ...chan('Q1 · doctor of an unknown specialty', "INSERT INTO Doctor VALUES ('D0001', 'Ha', 'XYZ')", '23503'), csdl: '', an: true },
          ],
          saiMau: ["CREATE TABLE Specialty (specID CHAR(3) NOT NULL PRIMARY KEY, specName VARCHAR(40) NOT NULL); CREATE TABLE Doctor (doctorID CHAR(5) NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, specID CHAR(3) NOT NULL REFERENCES Specialty(specID));"],
        },
        {
          ten: { en: 'Patient with a gender rule', vi: 'Patient với luật giới tính' }, diem: 2,
          moTa: { en: 'Create Patient. Gender is M or F (optional); the birth date is optional.', vi: 'Tạo Patient. Giới tính là M hoặc F (không bắt buộc); ngày sinh không bắt buộc.' },
          yeuCau: [{ en: "CHECK (gender IN ('M', 'F')).", vi: "CHECK (gender IN ('M', 'F'))." }],
          giai: Q2,
          kiem: [
            { ...sau('Q2 · columns', cot(['Patient'])), csdl: Q1 },
            { ...duoc('Q2 · patients with and without gender/birth date', "INSERT INTO Patient VALUES (1, 'An', 'M', '1990-05-01'), (2, 'Bich', NULL, NULL)"), csdl: Q1 },
            { ...chan('Q2 · gender X is rejected', "INSERT INTO Patient VALUES (3, 'Cuong', 'X', NULL)", '23514'), csdl: Q1 },
            { ...chan('Q2 · a patient without a name is rejected', "INSERT INTO Patient (patientID) VALUES (4)", '23502'), csdl: Q1, an: true },
          ],
          saiMau: ["CREATE TABLE Patient (patientID INT NOT NULL PRIMARY KEY, fullName VARCHAR(50) NOT NULL, gender CHAR(1), birthDate DATE);"],
        },
        {
          ten: { en: 'Visit — a strong entity with two foreign keys', vi: 'Visit — thực thể mạnh có hai khoá ngoại' }, diem: 2,
          moTa: { en: 'Create Visit. A visit is for exactly one patient with exactly one doctor; its date is required.', vi: 'Tạo Visit. Mỗi lượt khám dành cho đúng một bệnh nhân với đúng một bác sĩ; ngày khám bắt buộc.' },
          yeuCau: [{ en: 'Visit has its own key visitID (it is NOT weak); patientID and doctorID are NOT NULL foreign keys.', vi: 'Visit có khoá riêng visitID (KHÔNG phải thực thể yếu); patientID và doctorID là khoá ngoại NOT NULL.' }],
          giai: Q3,
          kiem: [
            { ...sau('Q3 · columns', cot(['Visit'])), csdl: Q12 },
            { ...duoc('Q3 · two visits of the same patient with the same doctor', `${NEN3} INSERT INTO Visit VALUES (1001, '2026-10-01', 'flu', 1, 'D0001'), (1002, '2026-10-08', 'flu', 1, 'D0001')`), csdl: Q12 },
            { ...chan('Q3 · visit of an unknown patient', `${NEN3} INSERT INTO Visit VALUES (1001, '2026-10-01', 'flu', 9, 'D0001')`, '23503'), csdl: Q12 },
            { ...chan('Q3 · visit without a doctor', `${NEN3} INSERT INTO Visit (visitID, visitDate, patientID) VALUES (1001, '2026-10-01', 1)`, '23502'), csdl: Q12, an: true },
            { ...chan('Q3 · visit without a date', `${NEN3} INSERT INTO Visit (visitID, patientID, doctorID) VALUES (1001, 1, 'D0001')`, '23502'), csdl: Q12, an: true },
          ],
          saiMau: ["CREATE TABLE Visit (visitID INT NOT NULL PRIMARY KEY, visitDate DATE NOT NULL, diagnosis VARCHAR(200), patientID INT NOT NULL REFERENCES Patient(patientID), doctorID CHAR(5) NULL REFERENCES Doctor(doctorID));"],
        },
        {
          ten: { en: 'Medicine and the M-N Prescribes', vi: 'Medicine và M-N Prescribes' }, diem: 2,
          moTa: { en: 'Create Medicine and Prescribes. A visit prescribes a medicine at most once, with a positive quantity; deleting a visit deletes its prescriptions.', vi: 'Tạo Medicine và Prescribes. Một lượt khám kê một thuốc tối đa một lần, số lượng dương; xoá lượt khám thì xoá đơn thuốc của nó.' },
          yeuCau: [{ en: 'PRIMARY KEY (visitID, medID); visitID → Visit ON DELETE CASCADE; CHECK (quantity &gt; 0).', vi: 'PRIMARY KEY (visitID, medID); visitID → Visit ON DELETE CASCADE; CHECK (quantity &gt; 0).' }],
          giai: Q4,
          kiem: [
            { ...sau('Q4 · columns', cot(['Medicine', 'Prescribes'])), csdl: Q123 },
            { ...duoc('Q4 · two medicines in one visit', `${NEN4} INSERT INTO Medicine VALUES (2, 'Vitamin C', 'tablet'); INSERT INTO Prescribes VALUES (1001, 1, 10, '2/day'), (1001, 2, 20, NULL)`), csdl: Q123 },
            { ...chan('Q4 · the same medicine twice in one visit', `${NEN4} INSERT INTO Prescribes VALUES (1001, 1, 10, NULL), (1001, 1, 5, NULL)`, '23505'), csdl: Q123 },
            { ...chan('Q4 · quantity 0', `${NEN4} INSERT INTO Prescribes VALUES (1001, 1, 0, NULL)`, '23514'), csdl: Q123 },
            { ...sau('Q4 · deleting a visit deletes its prescriptions', `${NEN4} INSERT INTO Prescribes VALUES (1001, 1, 10, NULL); DELETE FROM Visit WHERE visitID = 1001; SELECT COUNT(*) AS left_over FROM Prescribes`), csdl: Q123, an: true },
            { ...chan('Q4 · unknown medicine', `${NEN4} INSERT INTO Prescribes VALUES (1001, 42, 1, NULL)`, '23503'), csdl: Q123, an: true },
          ],
          saiMau: [Q4.replace('REFERENCES Visit (visitID) ON DELETE CASCADE', 'REFERENCES Visit (visitID)'), Q4.replace('    PRIMARY KEY (visitID, medID)\n', '    PRIMARY KEY (visitID, medID, quantity)\n')],
        },
        {
          ten: { en: 'Visits with their number of medicines', vi: 'Lượt khám kèm số loại thuốc' }, diem: 2,
          moTa: { en: 'On the reference database: for every visit give visitID, the patient\'s name, the doctor\'s name, the specialty name and the number of medicines prescribed — 0 for a visit without prescriptions.', vi: 'Trên CSDL chuẩn: với mọi lượt khám cho visitID, tên bệnh nhân, tên bác sĩ, tên chuyên khoa và số loại thuốc được kê — 0 với lượt khám không kê thuốc.' },
          yeuCau: [{ en: 'Columns: visitID, patient, doctor, specName, medicines. Row order does not matter.', vi: 'Cột: visitID, patient, doctor, specName, medicines. Thứ tự dòng không quan trọng.' }],
          giai: `SELECT v.visitID, p.fullName AS patient, d.fullName AS doctor, s.specName,
       COUNT(pr.medID) AS medicines                       -- NULL padding of the outer join is not counted
FROM Visit v
JOIN Patient p   ON p.patientID = v.patientID
JOIN Doctor d    ON d.doctorID = v.doctorID
JOIN Specialty s ON s.specID = d.specID
LEFT JOIN Prescribes pr ON pr.visitID = v.visitID
GROUP BY v.visitID, p.fullName, d.fullName, s.specName;`,
          kiem: [
            kq('Q5 · one row per visit'),
            kqAn('Q5 · more visits and prescriptions', "INSERT INTO Visit VALUES (1005, '2026-10-07', 'eye check', 2, 'D0003'); INSERT INTO Prescribes VALUES (1003, 2, 30, NULL), (1003, 3, 1, NULL)"),
          ],
          saiMau: [
            'SELECT v.visitID, p.fullName AS patient, d.fullName AS doctor, s.specName, COUNT(*) AS medicines FROM Visit v JOIN Patient p ON p.patientID = v.patientID JOIN Doctor d ON d.doctorID = v.doctorID JOIN Specialty s ON s.specID = d.specID LEFT JOIN Prescribes pr ON pr.visitID = v.visitID GROUP BY v.visitID, p.fullName, d.fullName, s.specName',
            'SELECT v.visitID, p.fullName AS patient, d.fullName AS doctor, s.specName, COUNT(pr.medID) AS medicines FROM Visit v JOIN Patient p ON p.patientID = v.patientID JOIN Doctor d ON d.doctorID = v.doctorID JOIN Specialty s ON s.specID = d.specID JOIN Prescribes pr ON pr.visitID = v.visitID GROUP BY v.visitID, p.fullName, d.fullName, s.specName',
          ],
        },
      ],
      truDiem: [
        { en: 'A separate table for a 1-N relationship (BelongsTo, Examines, Has) — they are foreign keys.', vi: 'Bảng riêng cho liên kết 1-N (BelongsTo, Examines, Has) — chúng là khoá ngoại.' },
        { en: 'Making Visit weak (key patientID + something) — it has its own ID.', vi: 'Biến Visit thành thực thể yếu (khoá patientID + gì đó) — nó có mã riêng.' },
        { en: 'Q5: COUNT(*) on the outer join gives 1 to a visit without medicines.', vi: 'Q5: COUNT(*) trên phép nối ngoài cho 1 với lượt khám không có thuốc.' },
      ],
      nopBai: {
        en: 'Tabs Q1.sql … Q5.sql. <b>Run</b> = sample checks; <b>Submit</b> = all checks and the 10-mark score table. The Clinic.sql tab holds the reference schema + data.',
        vi: 'Các tab Q1.sql … Q5.sql. <b>Chạy thử</b> = kiểm mẫu; <b>Nộp</b> = mọi kiểm và bảng điểm thang 10. Tab Clinic.sql chứa lược đồ chuẩn + dữ liệu.',
      },
      thuatNgu: [TN.pk, TN.fk, TN.check, TN.leftJoin],
      goiY: [
        { en: 'Nouns → tables (Specialty, Doctor, Patient, Visit, Medicine); the only M-N (prescribes) → the sixth table.', vi: 'Danh từ → bảng (Specialty, Doctor, Patient, Visit, Medicine); M-N duy nhất (prescribes) → bảng thứ sáu.' },
        { en: '"exactly one" ⇒ NOT NULL foreign key; "unique" ⇒ UNIQUE; "positive" ⇒ CHECK (&gt; 0).', vi: '"đúng một" ⇒ khoá ngoại NOT NULL; "duy nhất" ⇒ UNIQUE; "dương" ⇒ CHECK (&gt; 0).' },
      ],
      loiHayGap: [
        { en: 'Q1: forgetting UNIQUE on specName.', vi: 'Q1: quên UNIQUE ở specName.' },
        { en: 'Q4: no ON DELETE CASCADE — a visit with prescriptions cannot be deleted.', vi: 'Q4: không ON DELETE CASCADE — không xoá được lượt khám có đơn thuốc.' },
        { en: 'Q5: INNER JOIN Prescribes — visits without medicines disappear.', vi: 'Q5: INNER JOIN Prescribes — lượt khám không thuốc biến mất.' },
      ],
      giaiThich: { en: '<p>6 tables, created parents first (Specialty, Doctor, Patient, Visit, Medicine, Prescribes). The reference DDL + data are in the Clinic.sql tab.</p>', vi: '<p>6 bảng, tạo cha trước (Specialty, Doctor, Patient, Visit, Medicine, Prescribes). DDL chuẩn + dữ liệu nằm ở tab Clinic.sql.</p>' },
    }),
  ],
});
