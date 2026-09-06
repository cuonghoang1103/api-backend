/**
 * build-sdn302-pe15.mjs — sinh content/exams/SDN302-PE15.mjs.
 *
 * Nguồn thật: "SDN302 - SU26 - B1 - PE - Paper 2" — Student Attendance
 * Management platform (students/classes/subjects/attendances). Không
 * có solution — chỉ có 4 file JSON seed (đã đọc kỹ xác nhận: enrollment
 * là mảng NHÚNG trong class.enrollments[{studentId,status}], KHÔNG
 * phải bảng riêng; attendance có classId+studentId+date+status, không
 * có subjectId trực tiếp — phải qua class.subjectId mới ra subject).
 * Đề này là đề CHUẨN NHẤT đã gặp trong môn: mọi response mẫu (400/404/
 * 200/201) đều cho SẴN nguyên văn, không cần đoán field.
 *
 * ⚠️ Đề dùng "enrolled" cho 2 khái niệm khác nhau cần phân biệt rõ:
 * Câu 1 lọc theo query ?status=enrolled|dropped do CALLER chọn; Câu 2
 * (attendance-summary) và Câu 4 (bulk upsert) không có query lọc như
 * vậy — quyết định (ghi rõ trong explanation, đề không nói thẳng):
 * cả hai chỉ tính/yêu cầu học sinh có status "enrolled" hiện tại
 * trong enrollments (không tính học sinh đã "dropped"), vì "for all
 * students in a given class"/"all students enrolled in the class" đọc
 * tự nhiên nhất là học sinh ĐANG học, và việc bắt buộc điểm danh cho
 * học sinh đã rớt môn là vô lý về nghiệp vụ.
 *
 * ⚠️ Câu 4: CẢ HAI ví dụ mẫu của đề (nộp mới VÀ nộp đè/overwrite) đều
 * ghi rõ "201 (Created)" — kể cả lượt nộp đè lên record đã tồn tại.
 * Giữ nguyên 201 cho MỌI lượt submit thành công (không đổi thành 200
 * khi ghi đè), đúng theo 2 ví dụ đề cho, dù trái trực giác REST thường
 * dùng 200 cho update.
 *
 * Điểm gốc: Q1=1.5, Q2=2.5, Q3=2.5, Q4=3.5 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE15.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE15.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given data shape (collections: students, classes, subjects, attendances — database "su26db"):</b>` +
  `<pre><code class="language-javascript">// student
{ studentCode: String, fullName: String, email: String }

// class
{ className: String, subjectId: ObjectId /* ref subjects */, lecturerName: String, status: String,
  enrollments: [{ studentId: ObjectId /* ref students */, status: String /* "enrolled"|"dropped" */ }] }

// subject
{ code: String, name: String, credits: Number, status: String }

// attendance
{ studentId: ObjectId /* ref students */, classId: ObjectId /* ref classes */,
  date: Date, status: String /* "PRESENT"|"ABSENT" */ }</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu đề cho (bảng: students, classes, subjects, attendances — database "su26db"):</b>` +
  `<pre><code class="language-javascript">// student
{ studentCode: String, fullName: String, email: String }

// class
{ className: String, subjectId: ObjectId /* ref subjects */, lecturerName: String, status: String,
  enrollments: [{ studentId: ObjectId /* ref students */, status: String /* "enrolled"|"dropped" */ }] }

// subject
{ code: String, name: String, credits: Number, status: String }

// attendance
{ studentId: ObjectId /* ref students */, classId: ObjectId /* ref classes */,
  date: Date, status: String /* "PRESENT"|"ABSENT" */ }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Summer 2026, Block 1, Paper 2) — Student Attendance Management platform</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) covering <code>students</code>, <code>classes</code>, <code>subjects</code>, <code>attendances</code>. All endpoints must validate input data, apply business rules, return appropriate HTTP status codes, and return properly structured JSON responses. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Summer 2026, Block 1, Paper 2) — Nền tảng quản lý điểm danh sinh viên</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho <code>students</code>, <code>classes</code>, <code>subjects</code>, <code>attendances</code>. Mọi endpoint phải validate dữ liệu vào, áp quy tắc nghiệp vụ, trả đúng HTTP status code, trả JSON đúng cấu trúc. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (1.5 points): Retrieve Students by Class.</strong> Return the list of students enrolled in a given class. Endpoint: <code>GET /api/classes/:classId/students?status=enrolled</code>.</p>` +
    `<p><b>Business Rules:</b> validate classId as a valid ObjectId (400 if invalid); 404 if class is not found; only accept valid <code>status</code> query values: "enrolled" or "dropped" (400 if missing or invalid); output fields: <code>id</code> (renamed from <code>_id</code>), <code>studentCode</code>, <code>fullName</code>, <code>email</code>.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request): Invalid ObjectId
{ "error": "Invalid classId: 65bb0000000000000000000" }
// 404 (Not Found)
{ "error": "Class with id = 65bb000000000000000000099 not found" }
// 400 (Bad Request): Invalid status
{ "error": "Invalid status: active" }
// 200 (OK): test with classId = "65bb000000000000000000001"
[ { "id": "65dd00000000000000000001", "studentCode": "SE001", "fullName": "Nguyen Van A", "email": "anvn@fpt.edu.vn" }, "......" ]</code></pre>`,
    `<p><strong>Câu 1 (1.5 điểm): Lấy danh sách sinh viên theo lớp.</strong> Trả danh sách sinh viên đang trong 1 lớp. Endpoint: <code>GET /api/classes/:classId/students?status=enrolled</code>.</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> kiểm classId là ObjectId hợp lệ (400 nếu sai); 404 nếu không tìm thấy lớp; chỉ nhận giá trị query <code>status</code> hợp lệ: "enrolled" hoặc "dropped" (400 nếu thiếu hoặc sai); field trả về: <code>id</code> (đổi tên từ <code>_id</code>), <code>studentCode</code>, <code>fullName</code>, <code>email</code>.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request): ObjectId sai
{ "error": "Invalid classId: 65bb0000000000000000000" }
// 404 (Not Found)
{ "error": "Class with id = 65bb000000000000000000099 not found" }
// 400 (Bad Request): status sai
{ "error": "Invalid status: active" }
// 200 (OK): test với classId = "65bb000000000000000000001"
[ { "id": "65dd00000000000000000001", "studentCode": "SE001", "fullName": "Nguyen Van A", "email": "anvn@fpt.edu.vn" }, "......" ]</code></pre>`,
  ),
  starterCode:
`// ===== controllers/class.controller.js (Question 1) =====
const mongoose = require("mongoose");
const db = require("../models/index");
const Class = db.class;
const Student = db.student;

const getStudentsByClass = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getStudentsByClass };`,
  sampleSolution:
`// ===== controllers/class.controller.js (Question 1) =====
const mongoose = require("mongoose");
const db = require("../models/index");
const Class = db.class;
const Student = db.student;

const getStudentsByClass = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { classId } = req.params;
        const { status } = req.query;

        if (!mongoose.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ error: \`Invalid classId: \${classId}\` });
        }

        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ error: \`Class with id = \${classId} not found\` });
        }

        if (status !== "enrolled" && status !== "dropped") {
            return res.status(400).json({ error: \`Invalid status: \${status}\` });
        }

        const studentIds = classDoc.enrollments
            .filter((e) => e.status === status)
            .map((e) => e.studentId);

        const students = await Student.find({ _id: { \$in: studentIds } });

        const result = students.map((s) => ({
            id: s._id,
            studentCode: s.studentCode,
            fullName: s.fullName,
            email: s.email,
        }));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getStudentsByClass };`,
  explanation: B(
    `<p>Enrollments live as an embedded array on the class document itself (<code>class.enrollments[{studentId,status}]</code>), not a separate collection — so "students enrolled in a class" is resolved by filtering that embedded array by <code>status</code> first, THEN looking the resulting <code>studentId</code>s up in the <code>students</code> collection, rather than a single populate/join. The 400 checks run in a specific order matching the paper's own error precedence: ObjectId format first, then existence, then the status query value — checking status before confirming the class exists would return the wrong error for a request that has both problems.</p>`,
    `<p>Enrollment là mảng NHÚNG ngay trong document class (<code>class.enrollments[{studentId,status}]</code>), không phải bảng riêng — nên "sinh viên đang trong lớp" được lấy bằng cách lọc mảng nhúng đó theo <code>status</code> TRƯỚC, rồi mới tra <code>studentId</code> kết quả trong bảng <code>students</code>, chứ không phải 1 populate/join đơn. Thứ tự kiểm 400 khớp đúng thứ tự ưu tiên lỗi của đề: định dạng ObjectId trước, rồi tồn tại lớp, rồi tới giá trị query status — kiểm status trước khi xác nhận lớp tồn tại sẽ trả sai lỗi cho request mắc cả 2 vấn đề.</p>`,
  ),
  rubric: [
    { id: 'objectid_and_existence_validation', criterion: B('Returns 400 for an invalid classId ObjectId and 404 when the class does not exist, in that precedence order.', 'Trả 400 khi classId sai ObjectId và 404 khi lớp không tồn tại, đúng thứ tự ưu tiên đó.'), weight: 1, maxScore: 0.4 },
    { id: 'status_query_validation', criterion: B('Returns 400 when the status query parameter is missing or not one of "enrolled"/"dropped".', 'Trả 400 khi query status thiếu hoặc không phải "enrolled"/"dropped".'), weight: 1, maxScore: 0.4 },
    { id: 'enrollment_filter_correct', criterion: B('Correctly filters the class\'s embedded enrollments array by the requested status before looking up students.', 'Lọc đúng mảng enrollments nhúng của lớp theo status yêu cầu trước khi tra sinh viên.'), weight: 1, maxScore: 0.4 },
    { id: 'output_fields_renamed', criterion: B('Response items use "id" (not "_id") plus studentCode, fullName, email.', 'Item response dùng "id" (không phải "_id") cùng studentCode, fullName, email.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (2.5 points): Retrieve Attendance Statistics by Class.</strong> Return the attendance summary for all students in a given class. Endpoint: <code>GET /api/classes/:classId/attendance-summary</code>.</p>` +
    `<p><b>Business Rules:</b> validate classId as ObjectId (400); 404 if class not found; for each student <b>currently enrolled</b> in the class, calculate: <code>totalSessions</code> (total attendance records for that student in this class); <code>present</code> (PRESENT count); <code>absent</code> (ABSENT count); <code>attendanceRate</code> (%) = (present / totalSessions) × 100, rounded to 1 decimal; <code>warning</code>: true if attendanceRate &lt; 80%.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid classId: 65bb00000000000000000000" }
// 404 (Not Found)
{ "error": "Class with id = 65bb000000000000000000099 not found" }
// 200 (OK): test with classId = "65bb000000000000000000001"
[
  { "studentCode": "SE001", "fullName": "Nguyen Van A", "totalSessions": 10, "present": 9, "absent": 1, "attendanceRate": 90.0, "warning": false },
  { "studentCode": "SE002", "fullName": "Tran Thi B", "totalSessions": 10, "present": 7, "absent": 3, "attendanceRate": 70.0, "warning": true },
  "......"
]</code></pre>`,
    `<p><strong>Câu 2 (2.5 điểm): Thống kê điểm danh theo lớp.</strong> Trả tổng hợp điểm danh cho mọi sinh viên trong 1 lớp. Endpoint: <code>GET /api/classes/:classId/attendance-summary</code>.</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> kiểm classId ObjectId (400); 404 nếu không tìm thấy lớp; với mỗi sinh viên <b>đang enrolled</b> trong lớp, tính: <code>totalSessions</code> (tổng bản ghi điểm danh của sinh viên đó trong lớp này); <code>present</code> (số PRESENT); <code>absent</code> (số ABSENT); <code>attendanceRate</code> (%) = (present / totalSessions) × 100, làm tròn 1 chữ số thập phân; <code>warning</code>: true nếu attendanceRate &lt; 80%.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid classId: 65bb00000000000000000000" }
// 404 (Not Found)
{ "error": "Class with id = 65bb000000000000000000099 not found" }
// 200 (OK): test với classId = "65bb000000000000000000001"
[
  { "studentCode": "SE001", "fullName": "Nguyen Van A", "totalSessions": 10, "present": 9, "absent": 1, "attendanceRate": 90.0, "warning": false },
  { "studentCode": "SE002", "fullName": "Tran Thi B", "totalSessions": 10, "present": 7, "absent": 3, "attendanceRate": 70.0, "warning": true },
  "......"
]</code></pre>`,
  ),
  starterCode:
`// ===== controllers/class.controller.js (Question 2) =====
const mongoose2 = require("mongoose");
const db2 = require("../models/index");
const Class2 = db2.class;
const Student2 = db2.student;
const Attendance2 = db2.attendance;

const getAttendanceSummary = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getAttendanceSummary };`,
  sampleSolution:
`// ===== controllers/class.controller.js (Question 2) =====
const mongoose2 = require("mongoose");
const db2 = require("../models/index");
const Class2 = db2.class;
const Student2 = db2.student;
const Attendance2 = db2.attendance;

const getAttendanceSummary = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { classId } = req.params;

        if (!mongoose2.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ error: \`Invalid classId: \${classId}\` });
        }

        const classDoc = await Class2.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ error: \`Class with id = \${classId} not found\` });
        }

        const enrolledIds = classDoc.enrollments
            .filter((e) => e.status === "enrolled")
            .map((e) => e.studentId);

        const students = await Student2.find({ _id: { \$in: enrolledIds } });

        const result = await Promise.all(
            students.map(async (s) => {
                const records = await Attendance2.find({ classId, studentId: s._id });
                const totalSessions = records.length;
                const present = records.filter((r) => r.status === "PRESENT").length;
                const absent = records.filter((r) => r.status === "ABSENT").length;
                const attendanceRate = totalSessions > 0
                    ? Math.round((present / totalSessions) * 1000) / 10
                    : 0;

                return {
                    studentCode: s.studentCode,
                    fullName: s.fullName,
                    totalSessions,
                    present,
                    absent,
                    attendanceRate,
                    warning: attendanceRate < 80,
                };
            }),
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getAttendanceSummary };`,
  explanation: B(
    `<p><b>Only currently-"enrolled" students are summarized</b> — the paper's own wording ("all students in a given class"/"enrolled in the class") never mentions "dropped", and unlike Question 1 there is no status query parameter here to let the caller ask for dropped students either; requiring an attendance rate for a student who has left the class would not make business sense. <code>totalSessions</code> is scoped to <code>{classId, studentId}</code> together — a student enrolled in multiple classes must not have another class's attendance bleed into this summary. Rounding uses <code>Math.round(x*1000)/10</code> (not <code>toFixed(1)</code>) so the value stays a numeric type matching the paper's example <code>90.0</code>/<code>70.0</code>, not a string.</p>`,
    `<p><b>Chỉ tổng hợp sinh viên đang "enrolled"</b> — câu chữ đề ("all students in a given class"/"enrolled in the class") không hề nhắc "dropped", và khác Câu 1, ở đây không có query status để caller xin sinh viên đã rớt; bắt buộc tính tỷ lệ điểm danh cho sinh viên đã rời lớp là vô lý nghiệp vụ. <code>totalSessions</code> giới hạn theo CẢ <code>{classId, studentId}</code> cùng lúc — sinh viên học nhiều lớp không được để điểm danh lớp khác lẫn vào tổng hợp này. Làm tròn dùng <code>Math.round(x*1000)/10</code> (không phải <code>toFixed(1)</code>) để giữ kiểu số khớp ví dụ đề <code>90.0</code>/<code>70.0</code>, không phải chuỗi.</p>`,
  ),
  rubric: [
    { id: 'validation_400_404', criterion: B('Returns 400 for invalid classId and 404 when the class is not found.', 'Trả 400 khi classId sai và 404 khi không tìm thấy lớp.'), weight: 1, maxScore: 0.4 },
    { id: 'scoped_to_enrolled_students', criterion: B('Only students with an "enrolled" status in the class are included in the summary.', 'Chỉ sinh viên status "enrolled" trong lớp được đưa vào tổng hợp.'), weight: 1, maxScore: 0.5 },
    { id: 'session_counts_scoped_correctly', criterion: B('totalSessions/present/absent are correctly scoped to attendance records for that specific student in that specific class.', 'totalSessions/present/absent giới hạn đúng bản ghi điểm danh của đúng sinh viên đó trong đúng lớp đó.'), weight: 1, maxScore: 0.7 },
    { id: 'rate_and_warning_correct', criterion: B('attendanceRate is correctly computed and rounded to 1 decimal, and warning is true only when the rate is below 80%.', 'attendanceRate tính đúng và làm tròn 1 chữ số thập phân, warning chỉ true khi tỷ lệ dưới 80%.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (2.5 points): Retrieve Attendance History of a Student.</strong> Return the full attendance history of a specific student across all classes. Endpoint: <code>GET /api/students/:studentId/attendances</code>.</p>` +
    `<p><b>Business Rules:</b> validate studentId as ObjectId (400); 404 if student not found; for each attendance record, populate <code>className</code> (from the classes collection) and <code>subjectName</code> (from the subjects collection, via the class); sort results by date descending (most recent first).</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid studentId: 65dd00000000000000000000" }
// 404 (Not Found)
{ "error": "Student with id = 65dd000000000000000000099 not found" }
// 200 (OK): test with studentId = "65dd000000000000000000001"
[
  { "id": "65cc00000000000000000005", "className": "SE1701", "subjectName": "Project Management", "date": "2026-03-15T00:00:00.000Z", "status": "PRESENT" },
  { "id": "65cc00000000000000000003", "className": "SE1701", "subjectName": "Project Management", "date": "2026-03-08T00:00:00.000Z", "status": "ABSENT" },
  "......"
]</code></pre>`,
    `<p><strong>Câu 3 (2.5 điểm): Lịch sử điểm danh của 1 sinh viên.</strong> Trả toàn bộ lịch sử điểm danh của 1 sinh viên qua mọi lớp. Endpoint: <code>GET /api/students/:studentId/attendances</code>.</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> kiểm studentId ObjectId (400); 404 nếu không tìm thấy sinh viên; mỗi bản ghi điểm danh populate <code>className</code> (từ bảng classes) và <code>subjectName</code> (từ bảng subjects, qua lớp); sắp xếp theo date giảm dần (mới nhất trước).</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid studentId: 65dd00000000000000000000" }
// 404 (Not Found)
{ "error": "Student with id = 65dd000000000000000000099 not found" }
// 200 (OK): test với studentId = "65dd000000000000000000001"
[
  { "id": "65cc00000000000000000005", "className": "SE1701", "subjectName": "Project Management", "date": "2026-03-15T00:00:00.000Z", "status": "PRESENT" },
  { "id": "65cc00000000000000000003", "className": "SE1701", "subjectName": "Project Management", "date": "2026-03-08T00:00:00.000Z", "status": "ABSENT" },
  "......"
]</code></pre>`,
  ),
  starterCode:
`// ===== controllers/student.controller.js (Question 3) =====
const mongoose3 = require("mongoose");
const db3 = require("../models/index");
const Student3 = db3.student;
const Attendance3 = db3.attendance;

const getStudentAttendances = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getStudentAttendances };`,
  sampleSolution:
`// ===== controllers/student.controller.js (Question 3) =====
const mongoose3 = require("mongoose");
const db3 = require("../models/index");
const Student3 = db3.student;
const Attendance3 = db3.attendance;

const getStudentAttendances = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { studentId } = req.params;

        if (!mongoose3.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: \`Invalid studentId: \${studentId}\` });
        }

        const student = await Student3.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: \`Student with id = \${studentId} not found\` });
        }

        const records = await Attendance3.find({ studentId })
            .populate({ path: "classId", populate: { path: "subjectId", select: "name" } })
            .sort({ date: -1 });

        const result = records.map((r) => ({
            id: r._id,
            className: r.classId ? r.classId.className : null,
            subjectName: r.classId && r.classId.subjectId ? r.classId.subjectId.name : null,
            date: r.date,
            status: r.status,
        }));

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getStudentAttendances };`,
  explanation: B(
    `<p><code>subjectName</code> is two hops from <code>attendance</code> (attendance→class→subject), so the populate must nest: populate <code>classId</code> on the attendance record, then <code>subjectId</code> on the resulting class document. Sorting by <code>{date:-1}</code> is done at the query level (not after fetching into an array) so it composes correctly with Mongoose's own cursor rather than depending on manual JS sort logic.</p>`,
    `<p><code>subjectName</code> cách <code>attendance</code> 2 bước (attendance→class→subject), nên populate phải lồng: populate <code>classId</code> trên bản ghi attendance, rồi populate <code>subjectId</code> trên document class kết quả. Sắp xếp <code>{date:-1}</code> làm ở tầng query (không phải sau khi lấy về mảng) để hợp đúng với cursor Mongoose thay vì phụ thuộc logic sort JS thủ công.</p>`,
  ),
  rubric: [
    { id: 'validation_400_404', criterion: B('Returns 400 for invalid studentId and 404 when the student is not found.', 'Trả 400 khi studentId sai và 404 khi không tìm thấy sinh viên.'), weight: 1, maxScore: 0.4 },
    { id: 'crosses_all_classes', criterion: B('Retrieves attendance records for the student across all classes, not just one.', 'Lấy bản ghi điểm danh của sinh viên qua MỌI lớp, không chỉ 1 lớp.'), weight: 1, maxScore: 0.5 },
    { id: 'nested_populate_classname_subjectname', criterion: B('Correctly populates className directly and subjectName through the nested class-to-subject relation.', 'Populate đúng className trực tiếp và subjectName qua quan hệ lồng lớp-tới-môn.'), weight: 1, maxScore: 0.9 },
    { id: 'sorted_by_date_descending', criterion: B('Results are sorted by date descending (most recent first).', 'Kết quả sắp xếp theo date giảm dần (mới nhất trước).'), weight: 1, maxScore: 0.7 },
  ],
};

const q4 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (3.5 points): Bulk Attendance Entry with Upsert.</strong> Create or overwrite attendance records for all students in a class on a specific session date. Endpoint: <code>POST /api/classes/:classId/attendances</code>.</p>` +
    `<p><b>Request body:</b> <code>{ date: "2026-03-15", records: [{ studentId, status: "PRESENT"|"ABSENT" }, ...] }</code>.</p>` +
    `<p><b>Business Rules:</b> validate classId (400); 404 if class not found; 400 if date is missing or is a future date; 400 if records is missing or empty; the records array must include ALL currently-enrolled students in the class — no partial submissions (400, naming the missing student, if any enrolled student is missing from the records); each studentId must currently belong to the class (400, naming the studentId, if not a class member); only accept status values PRESENT or ABSENT (400 if invalid); if attendance records already exist for the given date, overwrite them (upsert behavior — do not return an error); return <code>totalRecords</code>, <code>present</code>, <code>absent</code>, and <code>updatedCount</code> (number of records that were overwritten).</p>` +
    `<pre><code class="language-json">// 400 (Bad Request): Future date
{ "error": "Date cannot be in the future" }
// 400 (Bad Request): Missing student in records
{ "error": "Missing attendance for student SE003 (Nguyen Van C)" }
// 400 (Bad Request): Student not in class
{ "error": "Student 65dd00000000000000000099 does not belong to class" }
// 201 (Created): fresh submission (no records exist yet for that date)
{ "message": "Attendance recorded successfully", "totalRecords": 3, "present": 2, "absent": 1, "updatedCount": 0 }
// 201 (Created): re-submission (existing records are overwritten) — STILL 201, not 200
{ "message": "Attendance recorded successfully", "totalRecords": 3, "present": 2, "absent": 1, "updatedCount": 3 }</code></pre>`,
    `<p><strong>Câu 4 (3.5 điểm): Điểm danh hàng loạt kèm ghi-đè (upsert).</strong> Tạo hoặc ghi đè bản ghi điểm danh cho mọi sinh viên trong 1 lớp vào 1 ngày buổi học cụ thể. Endpoint: <code>POST /api/classes/:classId/attendances</code>.</p>` +
    `<p><b>Body request:</b> <code>{ date: "2026-03-15", records: [{ studentId, status: "PRESENT"|"ABSENT" }, ...] }</code>.</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> kiểm classId (400); 404 nếu không tìm thấy lớp; 400 nếu date thiếu hoặc là ngày tương lai; 400 nếu records thiếu hoặc rỗng; mảng records phải gồm ĐỦ mọi sinh viên đang enrolled trong lớp — không cho nộp thiếu (400, nêu tên sinh viên thiếu, nếu thiếu ai đó); mỗi studentId phải đang thuộc lớp (400, nêu studentId, nếu không phải thành viên); chỉ nhận status PRESENT hoặc ABSENT (400 nếu sai); nếu đã có bản ghi cho ngày đó thì GHI ĐÈ (hành vi upsert — không trả lỗi); trả <code>totalRecords</code>, <code>present</code>, <code>absent</code>, và <code>updatedCount</code> (số bản ghi bị ghi đè).</p>` +
    `<pre><code class="language-json">// 400 (Bad Request): Ngày tương lai
{ "error": "Date cannot be in the future" }
// 400 (Bad Request): Thiếu sinh viên trong records
{ "error": "Missing attendance for student SE003 (Nguyen Van C)" }
// 400 (Bad Request): Sinh viên không thuộc lớp
{ "error": "Student 65dd00000000000000000099 does not belong to class" }
// 201 (Created): nộp mới (chưa có bản ghi nào cho ngày đó)
{ "message": "Attendance recorded successfully", "totalRecords": 3, "present": 2, "absent": 1, "updatedCount": 0 }
// 201 (Created): nộp đè (bản ghi có sẵn bị ghi đè) — VẪN 201, không phải 200
{ "message": "Attendance recorded successfully", "totalRecords": 3, "present": 2, "absent": 1, "updatedCount": 3 }</code></pre>`,
  ),
  starterCode:
`// ===== controllers/class.controller.js (Question 4) =====
const mongoose4 = require("mongoose");
const db4 = require("../models/index");
const Class4 = db4.class;
const Student4 = db4.student;
const Attendance4 = db4.attendance;

const bulkRecordAttendance = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { bulkRecordAttendance };`,
  sampleSolution:
`// ===== controllers/class.controller.js (Question 4) =====
const mongoose4 = require("mongoose");
const db4 = require("../models/index");
const Class4 = db4.class;
const Student4 = db4.student;
const Attendance4 = db4.attendance;

const bulkRecordAttendance = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { classId } = req.params;
        const { date, records } = req.body;

        if (!mongoose4.Types.ObjectId.isValid(classId)) {
            return res.status(400).json({ error: \`Invalid classId: \${classId}\` });
        }

        const classDoc = await Class4.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ error: \`Class with id = \${classId} not found\` });
        }

        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }
        const sessionDate = new Date(date);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (sessionDate > today) {
            return res.status(400).json({ error: "Date cannot be in the future" });
        }

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({ error: "Records is required" });
        }

        const enrolledIds = classDoc.enrollments
            .filter((e) => e.status === "enrolled")
            .map((e) => e.studentId.toString());

        const submittedIds = records.map((r) => String(r.studentId));

        for (const enrolledId of enrolledIds) {
            if (!submittedIds.includes(enrolledId)) {
                const student = await Student4.findById(enrolledId);
                return res.status(400).json({
                    error: \`Missing attendance for student \${student ? student.studentCode : enrolledId} (\${student ? student.fullName : "unknown"})\`,
                });
            }
        }

        for (const record of records) {
            if (!enrolledIds.includes(String(record.studentId))) {
                return res.status(400).json({
                    error: \`Student \${record.studentId} does not belong to class\`,
                });
            }
            if (record.status !== "PRESENT" && record.status !== "ABSENT") {
                return res.status(400).json({
                    error: \`Invalid status: \${record.status}\`,
                });
            }
        }

        const existingCount = await Attendance4.countDocuments({
            classId,
            date: sessionDate,
            studentId: { \$in: records.map((r) => r.studentId) },
        });

        const bulkOps = records.map((r) => ({
            updateOne: {
                filter: { classId, studentId: r.studentId, date: sessionDate },
                update: { \$set: { status: r.status } },
                upsert: true,
            },
        }));
        await Attendance4.bulkWrite(bulkOps);

        const present = records.filter((r) => r.status === "PRESENT").length;
        const absent = records.filter((r) => r.status === "ABSENT").length;

        res.status(201).json({
            message: "Attendance recorded successfully",
            totalRecords: records.length,
            present,
            absent,
            updatedCount: existingCount,
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { bulkRecordAttendance };`,
  explanation: B(
    `<p><b>Membership and completeness are checked against ONLY "enrolled" entries</b>, not "dropped" ones — mirroring the same enrolled-only scoping decision as Question 2, since the paper's own wording says "all students <b>enrolled</b> in the class". <code>updatedCount</code> must be counted BEFORE the <code>bulkWrite</code> runs (via <code>countDocuments</code> on the same <code>{classId, date, studentId}</code> filter the upsert will match) — counting it after would always read back the just-written count for everything, making the fresh-vs-resubmit distinction the paper's two examples require impossible to produce. Every successful submission responds <b>201</b>, including an overwrite — copying the paper's own two examples literally rather than "correcting" the second one to 200.</p>`,
    `<p><b>Kiểm thành viên và đủ số lượng chỉ tính entry "enrolled"</b>, không tính "dropped" — theo đúng quyết định enrolled-only như Câu 2, vì câu chữ đề ghi "all students <b>enrolled</b> in the class". <code>updatedCount</code> phải đếm TRƯỚC khi chạy <code>bulkWrite</code> (bằng <code>countDocuments</code> trên đúng filter <code>{classId, date, studentId}</code> mà upsert sẽ khớp) — đếm SAU sẽ luôn đọc lại đúng số vừa ghi cho mọi trường hợp, làm mất khả năng phân biệt nộp mới với nộp đè mà 2 ví dụ của đề đòi hỏi. Mọi lượt nộp thành công trả <b>201</b>, kể cả ghi đè — theo đúng nguyên văn 2 ví dụ đề cho thay vì "sửa" ví dụ thứ hai thành 200.</p>`,
  ),
  rubric: [
    { id: 'classid_and_date_validation', criterion: B('Returns 400/404 for invalid/missing classId, and 400 for a missing or future date.', 'Trả 400/404 khi classId sai/thiếu, và 400 khi date thiếu hoặc là ngày tương lai.'), weight: 1, maxScore: 0.5 },
    { id: 'records_completeness_check', criterion: B('Returns 400 naming the specific missing student when the records array does not cover every currently-enrolled student.', 'Trả 400 nêu đúng tên sinh viên thiếu khi mảng records không phủ đủ mọi sinh viên đang enrolled.'), weight: 1, maxScore: 0.8 },
    { id: 'membership_and_status_validation', criterion: B('Returns 400 when a submitted studentId is not an enrolled class member, and 400 when a status is neither PRESENT nor ABSENT.', 'Trả 400 khi studentId nộp không phải thành viên enrolled của lớp, và 400 khi status không phải PRESENT/ABSENT.'), weight: 1, maxScore: 0.6 },
    { id: 'upsert_overwrite_behavior', criterion: B('Existing attendance records for the same classId+studentId+date are correctly overwritten rather than causing an error or a duplicate record.', 'Bản ghi điểm danh có sẵn cùng classId+studentId+date được ghi đè đúng, không báo lỗi và không tạo bản ghi trùng.'), weight: 1, maxScore: 0.7 },
    { id: 'response_counts_and_status_code', criterion: B('Response includes correct totalRecords/present/absent/updatedCount, with updatedCount reflecting how many records pre-existed, and always responds 201.', 'Response có đúng totalRecords/present/absent/updatedCount, updatedCount phản ánh đúng số bản ghi đã tồn tại trước đó, và luôn trả 201.'), weight: 1, maxScore: 0.9 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE15',
    title: 'SDN302 – Practical Exam (Summer 2026, Block 1, Paper 2), Student Attendance Management|||SDN302 – Thi thực hành (Summer 2026, Block 1, Đề 2), Quản lý điểm danh sinh viên',
    description: 'SDN302 PE (CODE): REST API for a student attendance platform (students/classes/subjects/attendances, embedded per-class enrollments, per-class attendance statistics, cross-class attendance history, bulk upsert attendance entry), AI-graded.|||PE SDN302 (viết mã): REST API cho nền tảng điểm danh sinh viên (students/classes/subjects/attendances, enrollment nhúng theo lớp, thống kê điểm danh theo lớp, lịch sử điểm danh xuyên lớp, nộp điểm danh hàng loạt kèm ghi đè), chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
