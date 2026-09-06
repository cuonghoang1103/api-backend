/**
 * build-sdn302-pe10.mjs — sinh content/exams/SDN302-PE10.mjs.
 *
 * Nguồn thật: "SDN302 - SP26 - B5 - PE - Paper 2" — Project Management
 * System (departments/employees/locations/projects/worksons, quan hệ
 * N-N project-employee qua worksOns có workHours). Không có solution —
 * chỉ có 5 file JSON seed (đã đọc kỹ xác nhận đúng tên field thật:
 * Department.managerId ref Employee, WorksOn{empId,proId,workHours}).
 *
 * Điểm gốc: Q1=1.5, Q2=2.5, Q3=2.5, Q4=3.5 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE10.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE10.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given data shape (collections: departments, employees, locations, projects, worksons — database "Spr26_B5"):</b>` +
  `<pre><code class="language-javascript">// department
{ depName: String, managerId: ObjectId /* ref employees */, managerAssDate: Date, location: [{ locId: ObjectId /* ref locations */ }] }
// employee
{ empName: String, empSalary: Number, empSex: Boolean, empBirthdate: Date, depId: ObjectId /* ref departments */, supervisorId: ObjectId, empStartdate: Date }
// location
{ locName: String }
// project
{ proName: String, depId: ObjectId /* ref departments */, location: [{ locId: ObjectId }] }
// workson (resolves the many-to-many between project and employee)
{ empId: ObjectId /* ref employees */, proId: ObjectId /* ref projects */, workHours: Number }</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu đề cho (bảng: departments, employees, locations, projects, worksons — database "Spr26_B5"):</b>` +
  `<pre><code class="language-javascript">// department
{ depName: String, managerId: ObjectId /* ref employees */, managerAssDate: Date, location: [{ locId: ObjectId /* ref locations */ }] }
// employee
{ empName: String, empSalary: Number, empSex: Boolean, empBirthdate: Date, depId: ObjectId /* ref departments */, supervisorId: ObjectId, empStartdate: Date }
// location
{ locName: String }
// project
{ proName: String, depId: ObjectId /* ref departments */, location: [{ locId: ObjectId }] }
// workson (giải quyết N-N giữa project và employee)
{ empId: ObjectId /* ref employees */, proId: ObjectId /* ref projects */, workHours: Number }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2026, Block 5, Paper 2) — Project Management System</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for departments, employees, locations, projects, and worksons. All endpoints must validate input data, apply business rules, return appropriate HTTP status codes, and return properly structured JSON responses. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2026, Block 5, Paper 2) — Hệ thống quản lý dự án</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho departments, employees, locations, projects, worksons. Mọi endpoint phải validate dữ liệu vào, áp quy tắc nghiệp vụ, trả đúng HTTP status code, trả JSON đúng cấu trúc. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (1.5 points): Retrieve Projects by Department.</strong> Retrieve all projects belonging to a specific department, along with the department manager's information. Endpoint: <code>GET /api/projects/department/:depId</code>.</p>` +
    `<p><strong>Business Rules:</strong> validate depId as ObjectId, return 400 if invalid; return 404 if department not found; populate department manager (managerId → empName); retrieve all projects by depId; return department name, manager name, list of projects.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid ObjectId: 65a10000000000000000000X" }
// 404 (Not Found)
{ "error": "Department with _id='65a100000000000000000004' not found" }
// 200 (OK)
{
  "depName": "Information Technology",
  "manager": "Nguyen Van An",
  "projects": [ { "proId": "65a300000000000000000001", "proName": "Smart City System" } ]
}</code></pre>`,
    `<p><strong>Câu 1 (1.5 điểm): Lấy dự án theo phòng ban.</strong> Lấy mọi dự án thuộc 1 phòng ban cụ thể, kèm thông tin quản lý phòng ban. Endpoint: <code>GET /api/projects/department/:depId</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm depId là ObjectId, trả 400 nếu sai; trả 404 nếu không tìm thấy phòng ban; populate quản lý phòng ban (managerId → empName); lấy mọi dự án theo depId; trả tên phòng ban, tên quản lý, danh sách dự án.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid ObjectId: 65a10000000000000000000X" }
// 404 (Not Found)
{ "error": "Department with _id='65a100000000000000000004' not found" }
// 200 (OK)
{
  "depName": "Information Technology",
  "manager": "Nguyen Van An",
  "projects": [ { "proId": "65a300000000000000000001", "proName": "Smart City System" } ]
}</code></pre>`,
  ),
  starterCode:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Department = db.department;
const Project = db.project;

const getProjectsByDepartment = async (req, res, next) => {
    const { depId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getProjectsByDepartment };`,
  sampleSolution:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Department = db.department;
const Project = db.project;

const getProjectsByDepartment = async (req, res, next) => {
    const { depId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        if (!mongoose.Types.ObjectId.isValid(depId)) {
            return res.status(400).json({ error: \`Invalid ObjectId: \${depId}\` });
        }

        const department = await Department.findById(depId).populate("managerId", "empName");
        if (!department) {
            return res.status(404).json({ error: \`Department with _id='\${depId}' not found\` });
        }

        const projects = await Project.find({ depId });

        res.json({
            depName: department.depName,
            manager: department.managerId?.empName || null,
            projects: projects.map((p) => ({ proId: p._id, proName: p.proName })),
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getProjectsByDepartment };`,
  explanation: B(
    `<p><code>mongoose.Types.ObjectId.isValid()</code> checks the ID's FORMAT (a valid 24-hex-char ObjectId) before ever querying the database — this catches the 400 case (malformed id) distinctly from the 404 case (well-formed id, but no matching document), which a raw <code>findById</code> call alone would conflate (an invalid-format id passed to <code>findById</code> throws a CastError, not a clean 404). <code>managerId</code> populates to just <code>empName</code>, matching the response's plain "manager" string field.</p>`,
    `<p><code>mongoose.Types.ObjectId.isValid()</code> kiểm ĐỊNH DẠNG id (24 ký tự hex hợp lệ) trước khi truy vấn database — bắt đúng trường hợp 400 (id sai định dạng) tách biệt với 404 (id đúng định dạng nhưng không có bản ghi khớp), điều mà chỉ gọi <code>findById</code> thô sẽ gộp lẫn (id sai định dạng truyền vào <code>findById</code> ném CastError, không phải 404 sạch). <code>managerId</code> populate chỉ <code>empName</code>, khớp field "manager" chuỗi thường của response.</p>`,
  ),
  rubric: [
    { id: 'objectid_format_validation', criterion: B('Validates depId is a well-formed ObjectId before querying, returning the exact 400 error for a malformed id.', 'Kiểm depId đúng định dạng ObjectId trước khi truy vấn, trả đúng lỗi 400 khi sai định dạng.'), weight: 1, maxScore: 0.4 },
    { id: 'department_not_found', criterion: B('Returns the exact 404 error when a well-formed depId matches no department.', 'Trả đúng lỗi 404 khi depId đúng định dạng nhưng không khớp phòng ban nào.'), weight: 1, maxScore: 0.4 },
    { id: 'manager_populated', criterion: B('The department manager is correctly resolved to a name (via populate on managerId), not a raw ObjectId.', 'Quản lý phòng ban phân giải đúng thành tên (qua populate managerId), không phải ObjectId thô.'), weight: 1, maxScore: 0.4 },
    { id: 'projects_and_response_shape', criterion: B('Retrieves all projects for the department and returns the exact response shape (depName, manager, projects[{proId, proName}]).', 'Lấy đúng mọi dự án của phòng ban và trả đúng hình dạng response (depName, manager, projects[{proId, proName}]).'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (2.5 points): Retrieve Employees by Project.</strong> Retrieve all employees participating in a specific project together with their work hours. Endpoint: <code>GET /api/projects/:proId/employees</code>.</p>` +
    `<p><strong>Business Rules:</strong> validate proId (encouraged, not required per the current design); return 404 if project not found; retrieve data from worksOns; populate employee info (empId → empName, empSalary); return project name and employee list with work hours.</p>` +
    `<pre><code class="language-json">// 404 (Not Found)
{ "error": "Project with _id='65a300000000000000000004' not found" }
// 200 (OK): test with proId="65a300000000000000000001"
{
  "project": "Smart City System",
  "employees": [
    { "empName": "Tran Thi Binh", "empSalary": 1800, "workHours": 20 },
    { "empName": "Le Van Cuong", "empSalary": 1700, "workHours": 25 }
  ]
}</code></pre>`,
    `<p><strong>Câu 2 (2.5 điểm): Lấy nhân viên theo dự án.</strong> Lấy mọi nhân viên tham gia 1 dự án cụ thể kèm giờ làm việc. Endpoint: <code>GET /api/projects/:proId/employees</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm proId (khuyến khích, không bắt buộc theo thiết kế hiện tại); trả 404 nếu không thấy dự án; lấy dữ liệu từ worksOns; populate thông tin nhân viên (empId → empName, empSalary); trả tên dự án và danh sách nhân viên kèm giờ làm.</p>` +
    `<pre><code class="language-json">// 404 (Not Found)
{ "error": "Project with _id='65a300000000000000000004' not found" }
// 200 (OK): test với proId="65a300000000000000000001"
{
  "project": "Smart City System",
  "employees": [
    { "empName": "Tran Thi Binh", "empSalary": 1800, "workHours": 20 },
    { "empName": "Le Van Cuong", "empSalary": 1700, "workHours": 25 }
  ]
}</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Project = db.project;
const WorksOn = db.workson;

const getEmployeesByProject = async (req, res, next) => {
    const { proId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getEmployeesByProject };`,
  sampleSolution:
`const db = require("../models/index");
const Project = db.project;
const WorksOn = db.workson;

const getEmployeesByProject = async (req, res, next) => {
    const { proId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        const project = await Project.findById(proId);
        if (!project) {
            return res.status(404).json({ error: \`Project with _id='\${proId}' not found\` });
        }

        const worksOns = await WorksOn.find({ proId }).populate("empId", "empName empSalary");

        res.json({
            project: project.proName,
            employees: worksOns.map((w) => ({
                empName: w.empId?.empName,
                empSalary: w.empId?.empSalary,
                workHours: w.workHours,
            })),
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getEmployeesByProject };`,
  explanation: B(
    `<p>The paper's own business rules explicitly mark proId format validation as "encouraged, not required by the current code" — so a bare <code>findById</code> is acceptable here (unlike Question 1, where the 400/404 distinction is a hard requirement). <code>workHours</code> comes from the worksOns record itself, not from the populated employee (an employee has no work-hours field of its own — hours are per-project, per-worksOn-record).</p>`,
    `<p>Quy tắc nghiệp vụ của chính đề ghi rõ kiểm định dạng proId là "khuyến khích, không bắt buộc theo code hiện tại" — nên <code>findById</code> thuần là chấp nhận được ở đây (khác Câu 1, nơi phân biệt 400/404 là yêu cầu cứng). <code>workHours</code> lấy từ chính bản ghi worksOns, không phải từ nhân viên đã populate (nhân viên không có field giờ làm riêng — giờ làm gắn theo từng dự án, từng bản ghi worksOn).</p>`,
  ),
  rubric: [
    { id: 'project_not_found', criterion: B('Returns the exact 404 error when the proId matches no project.', 'Trả đúng lỗi 404 khi proId không khớp dự án nào.'), weight: 1, maxScore: 0.6 },
    { id: 'worksons_queried_correctly', criterion: B('Correctly queries worksOns records for the given proId (not employees or projects directly).', 'Truy vấn đúng bản ghi worksOns theo proId đã cho (không phải employees hay projects trực tiếp).'), weight: 1, maxScore: 0.7 },
    { id: 'employee_populated', criterion: B('Each entry\'s employee is populated into empName and empSalary, not a raw ObjectId.', 'Nhân viên mỗi mục populate đúng thành empName và empSalary, không phải ObjectId thô.'), weight: 1, maxScore: 0.7 },
    { id: 'response_shape_correct', criterion: B('Response matches the paper\'s shape exactly (project, employees[{empName, empSalary, workHours}]).', 'Response khớp đúng hình dạng đề (project, employees[{empName, empSalary, workHours}]).'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (2.5 points): Project Work Hours Report.</strong> Produce a report of the total working hours and the number of employees for each project. Endpoint: <code>GET /api/reports/projects/work-hours</code>.</p>` +
    `<p><strong>Business Rules:</strong> use an Aggregation Pipeline; group by proId; calculate total work hours and total employees; join with the projects collection and departments collection; return project name and department name.</p>` +
    `<pre><code class="language-json">[
  { "totalWorkHours": 48, "totalEmployees": 2, "projectName": "E-Commerce Platform", "departmentName": "Sales and Marketing" },
  { "totalWorkHours": 45, "totalEmployees": 2, "projectName": "Smart City System", "departmentName": "Information Technology" },
  { "totalWorkHours": 10, "totalEmployees": 1, "projectName": "AI Traffic Control", "departmentName": "Research and Development" }
]</code></pre>`,
    `<p><strong>Câu 3 (2.5 điểm): Báo cáo giờ làm việc dự án.</strong> Tạo báo cáo tổng giờ làm việc và số nhân viên mỗi dự án. Endpoint: <code>GET /api/reports/projects/work-hours</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> dùng Aggregation Pipeline; nhóm theo proId; tính tổng giờ làm và tổng nhân viên; join với bảng projects và departments; trả tên dự án và tên phòng ban.</p>` +
    `<pre><code class="language-json">[
  { "totalWorkHours": 48, "totalEmployees": 2, "projectName": "E-Commerce Platform", "departmentName": "Sales and Marketing" },
  { "totalWorkHours": 45, "totalEmployees": 2, "projectName": "Smart City System", "departmentName": "Information Technology" },
  { "totalWorkHours": 10, "totalEmployees": 1, "projectName": "AI Traffic Control", "departmentName": "Research and Development" }
]</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const WorksOn = db.workson;

const workHoursReport = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { workHoursReport };`,
  sampleSolution:
`const db = require("../models/index");
const WorksOn = db.workson;

const workHoursReport = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const report = await WorksOn.aggregate([
            {
                \$group: {
                    _id: "\$proId",
                    totalWorkHours: { \$sum: "\$workHours" },
                    totalEmployees: { \$sum: 1 },
                },
            },
            {
                \$lookup: {
                    from: "projects",
                    localField: "_id",
                    foreignField: "_id",
                    as: "projectInfo",
                },
            },
            { \$unwind: "\$projectInfo" },
            {
                \$lookup: {
                    from: "departments",
                    localField: "projectInfo.depId",
                    foreignField: "_id",
                    as: "departmentInfo",
                },
            },
            { \$unwind: "\$departmentInfo" },
            {
                \$project: {
                    _id: 0,
                    totalWorkHours: 1,
                    totalEmployees: 1,
                    projectName: "\$projectInfo.proName",
                    departmentName: "\$departmentInfo.depName",
                },
            },
        ]);

        res.json(report);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { workHoursReport };`,
  explanation: B(
    `<p><code>\$sum: 1</code> in the <code>\$group</code> stage counts worksOns ROWS per project — correct here because the seed data has at most one worksOn record per (project, employee) pair, so a row count IS the employee count; if an employee could have multiple worksOn rows for the same project, this would need <code>\$addToSet: "\$empId"</code> + <code>\$size</code> instead to count DISTINCT employees. Two chained <code>\$lookup</code>+<code>\$unwind</code> pairs join first to <code>projects</code> (to get <code>depId</code> and <code>proName</code>), then from the project's own <code>depId</code> to <code>departments</code> (to get <code>depName</code>) — a lookup chain, not two independent lookups from worksOns.</p>`,
    `<p><code>\$sum: 1</code> ở giai đoạn <code>\$group</code> đếm số DÒNG worksOns mỗi dự án — đúng ở đây vì dữ liệu seed có tối đa 1 bản ghi worksOn cho mỗi cặp (dự án, nhân viên), nên đếm dòng CHÍNH LÀ đếm nhân viên; nếu 1 nhân viên có thể có nhiều dòng worksOn cho cùng dự án, cần <code>\$addToSet: "\$empId"</code> + <code>\$size</code> thay vào để đếm nhân viên DUY NHẤT. 2 cặp <code>\$lookup</code>+<code>\$unwind</code> nối chuỗi: trước join tới <code>projects</code> (lấy <code>depId</code> và <code>proName</code>), rồi từ <code>depId</code> của chính project đó join tới <code>departments</code> (lấy <code>depName</code>) — 1 chuỗi lookup nối tiếp, không phải 2 lookup độc lập từ worksOns.</p>`,
  ),
  rubric: [
    { id: 'aggregation_pipeline_used', criterion: B('Uses a MongoDB aggregation pipeline (not application-level looping) grouped by proId.', 'Dùng aggregation pipeline MongoDB (không phải lặp phía ứng dụng) nhóm theo proId.'), weight: 1, maxScore: 0.6 },
    { id: 'totals_correct', criterion: B('Correctly calculates totalWorkHours (sum) and totalEmployees (count) per project.', 'Tính đúng totalWorkHours (tổng) và totalEmployees (đếm) mỗi dự án.'), weight: 1, maxScore: 0.8 },
    { id: 'joined_names_correct', criterion: B('Correctly joins to both the projects and departments collections to resolve projectName and departmentName (via a chained lookup: worksOns → project → department).', 'Join đúng cả bảng projects và departments để phân giải projectName và departmentName (qua lookup nối chuỗi: worksOns → project → department).'), weight: 1, maxScore: 0.8 },
    { id: 'response_shape_correct', criterion: B('Each result object has exactly totalWorkHours, totalEmployees, projectName, departmentName.', 'Mỗi object kết quả có đúng totalWorkHours, totalEmployees, projectName, departmentName.'), weight: 1, maxScore: 0.3 },
  ],
};

const q4 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (3.5 points): Create Project with Employees.</strong> Create a new project and assign employees to it together with their working hours. Endpoint: <code>POST /api/projects</code>.</p>` +
    `<pre><code class="language-json">// Request body
{
  "proName": "Digital Government",
  "depId": "65a100000000000000000001",
  "location": [ {"locId": "65a000000000000000000001"}, {"locId": "65a000000000000000000003"} ],
  "employees": [
    { "empId": "65a200000000000000000002", "workHours": 20 },
    { "empId": "65a200000000000000000003", "workHours": 25 }
  ]
}</code></pre>` +
    `<p><strong>Business Rules:</strong> validate department exists, return 404 if not found. If employees provided: validate all empId exist, return 400 if any invalid. Create project. Insert records into worksOns. Return created project info.</p>` +
    `<pre><code class="language-json">// 404 (Not Found)
{ "error": "Department with _id='65a100000000000000000005' not found" }

// 201 (Created): employees empty, insert into projects only
{ "message": "Project created successfully", "newProject": { "projectId": "69ba0ebeb7f537a8b8b5d2f1", "projectName": "Digital Government" } }

// 400 (Bad Request): employees not exist
{ "error": "Some employees do not exist", "invalidEmployees": ["65a200000000000000000008", "65a200000000000000000009"] }

// 201 (Created): insert into projects and worksOns
{
  "message": "Project created successfully",
  "newProject": {
    "projectId": "69ba0ebeb7f537a8b8b5d2fa",
    "projectName": "Digital Government",
    "worksOns": [
      { "_id": "69ba0ebeb7f537a8b8b5d2fd", "proId": "69ba0ebeb7f537a8b8b5d2fa", "empId": "65a200000000000000000002", "workHours": 20 },
      { "_id": "69ba0ebeb7f537a8b8b5d2fe", "proId": "69ba0ebeb7f537a8b8b5d2fa", "empId": "65a200000000000000000003", "workHours": 25 }
    ]
  }
}</code></pre>`,
    `<p><strong>Câu 4 (3.5 điểm): Tạo dự án kèm nhân viên.</strong> Tạo dự án mới và gán nhân viên vào kèm giờ làm việc. Endpoint: <code>POST /api/projects</code>.</p>` +
    `<pre><code class="language-json">// Request body
{
  "proName": "Digital Government",
  "depId": "65a100000000000000000001",
  "location": [ {"locId": "65a000000000000000000001"}, {"locId": "65a000000000000000000003"} ],
  "employees": [
    { "empId": "65a200000000000000000002", "workHours": 20 },
    { "empId": "65a200000000000000000003", "workHours": 25 }
  ]
}</code></pre>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm phòng ban tồn tại, trả 404 nếu không. Nếu có employees: kiểm mọi empId tồn tại, trả 400 nếu sai. Tạo project. Chèn bản ghi vào worksOns. Trả thông tin dự án đã tạo.</p>` +
    `<pre><code class="language-json">// 404 (Not Found)
{ "error": "Department with _id='65a100000000000000000005' not found" }

// 201 (Created): employees rỗng, chỉ chèn vào projects
{ "message": "Project created successfully", "newProject": { "projectId": "69ba0ebeb7f537a8b8b5d2f1", "projectName": "Digital Government" } }

// 400 (Bad Request): employees không tồn tại
{ "error": "Some employees do not exist", "invalidEmployees": ["65a200000000000000000008", "65a200000000000000000009"] }

// 201 (Created): chèn vào cả projects và worksOns
{
  "message": "Project created successfully",
  "newProject": {
    "projectId": "69ba0ebeb7f537a8b8b5d2fa",
    "projectName": "Digital Government",
    "worksOns": [
      { "_id": "69ba0ebeb7f537a8b8b5d2fd", "proId": "69ba0ebeb7f537a8b8b5d2fa", "empId": "65a200000000000000000002", "workHours": 20 },
      { "_id": "69ba0ebeb7f537a8b8b5d2fe", "proId": "69ba0ebeb7f537a8b8b5d2fa", "empId": "65a200000000000000000003", "workHours": 25 }
    ]
  }
}</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Department = db.department;
const Employee = db.employee;
const Project = db.project;
const WorksOn = db.workson;

const createProject = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { createProject };`,
  sampleSolution:
`const db = require("../models/index");
const Department = db.department;
const Employee = db.employee;
const Project = db.project;
const WorksOn = db.workson;

const createProject = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { proName, depId, location, employees } = req.body;

        const department = await Department.findById(depId);
        if (!department) {
            return res.status(404).json({ error: \`Department with _id='\${depId}' not found\` });
        }

        let validEmployees = [];
        if (Array.isArray(employees) && employees.length > 0) {
            const invalidEmployees = [];
            for (const { empId } of employees) {
                const emp = await Employee.findById(empId);
                if (!emp) invalidEmployees.push(empId);
            }
            if (invalidEmployees.length > 0) {
                return res.status(400).json({ error: "Some employees do not exist", invalidEmployees });
            }
            validEmployees = employees;
        }

        const project = await Project.create({ proName, depId, location: location || [] });

        const responseBody = {
            message: "Project created successfully",
            newProject: {
                projectId: project._id,
                projectName: project.proName,
            },
        };

        if (validEmployees.length > 0) {
            const worksOnsDocs = await WorksOn.insertMany(
                validEmployees.map((e) => ({ proId: project._id, empId: e.empId, workHours: e.workHours }))
            );
            responseBody.newProject.worksOns = worksOnsDocs.map((w) => ({
                _id: w._id,
                proId: w.proId,
                empId: w.empId,
                workHours: w.workHours,
            }));
        }

        res.status(201).json(responseBody);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { createProject };`,
  explanation: B(
    `<p>The response deliberately OMITS the <code>worksOns</code> key entirely when no valid employees were supplied (rather than including an empty array) — matching the paper's own two distinct 201 examples, one with no <code>worksOns</code> key at all and one with it populated. Employee validation happens entirely BEFORE the project is created, so an invalid employee list never leaves an orphan project with no assignments — the whole request fails cleanly with 400 and nothing is written.</p>`,
    `<p>Response cố tình BỎ HẲN key <code>worksOns</code> khi không có nhân viên hợp lệ nào (thay vì để mảng rỗng) — khớp đúng 2 ví dụ 201 khác nhau của đề, 1 cái không có key <code>worksOns</code> nào, 1 cái có đủ. Kiểm nhân viên xảy ra hoàn toàn TRƯỚC KHI tạo dự án, nên danh sách nhân viên sai không bao giờ để lại 1 dự án mồ côi không có phân công — cả request thất bại sạch với 400 và không ghi gì.</p>`,
  ),
  rubric: [
    { id: 'department_existence_check', criterion: B('Validates the department exists, returning the exact 404 error before any other processing if not.', 'Kiểm phòng ban tồn tại, trả đúng lỗi 404 trước mọi xử lý khác nếu không.'), weight: 1, maxScore: 0.7 },
    { id: 'employee_existence_check', criterion: B('When employees are provided, validates every empId exists BEFORE creating the project, returning the exact 400 error with the list of invalid ids if any fail.', 'Khi có employees, kiểm mọi empId tồn tại TRƯỚC KHI tạo dự án, trả đúng lỗi 400 kèm danh sách id sai nếu có.'), weight: 1, maxScore: 1 },
    { id: 'project_and_worksons_created', criterion: B('Correctly creates the project and, when valid employees are provided, inserts the corresponding worksOns records.', 'Tạo đúng dự án và, khi có nhân viên hợp lệ, chèn đúng bản ghi worksOns tương ứng.'), weight: 1, maxScore: 0.9 },
    { id: 'response_shape_matches_both_cases', criterion: B('The response correctly omits the worksOns key when no employees were provided, and includes it (with the created records) when they were — matching both of the paper\'s 201 examples.', 'Response đúng bỏ key worksOns khi không có nhân viên, và có đủ (kèm bản ghi đã tạo) khi có — khớp cả 2 ví dụ 201 của đề.'), weight: 1, maxScore: 0.9 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE10',
    title: 'SDN302 – Practical Exam (Spring 2026, B5, Paper 2), Project Management System|||SDN302 – Thi thực hành (Spring 2026, B5, Paper 2), Hệ thống quản lý dự án',
    description: 'SDN302 PE (CODE): projects by department with manager populate, employees by project via worksOns, aggregation-based work-hours report, and project+employee creation with existence validation, AI-graded.|||PE SDN302 (viết mã): dự án theo phòng ban kèm populate quản lý, nhân viên theo dự án qua worksOns, báo cáo giờ làm qua aggregation, và tạo dự án+nhân viên kèm kiểm tồn tại, chấm AI.',
    durationMinutes: 90,
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
