/**
 * build-sdn302-pe1.mjs — sinh content/exams/SDN302-PE1.mjs.
 *
 * Nguồn thật: "SDN302 - FA 2024 - PE" (Node.js/Express/MongoDB/Mongoose
 * RESTful API, hệ thống department/employee/job). Đề gốc chạy trong VS
 * Code + MongoDB Compass + Postman thật — phòng thi này không có môi
 * trường Node/Mongo sống, nên câu hỏi ở dạng CODE chấm AI theo rubric
 * (giống mẫu CSD201-PE*.mjs), không compile/run thật.
 *
 * ⚠️ CÓ `solution.rar` đính kèm — đã giải nén và ĐỌC KỸ, phát hiện đây
 * là bản "given" CHƯA HOÀN CHỈNH, không phải đáp án đúng đầy đủ:
 *   - `create` và `update` trong employee.controller.js RỖNG (chưa
 *     implement) — Câu 3 (Create) hoàn toàn chưa có lời giải nào.
 *   - `findEmployeesByDepartment` (Câu 2) có LỖI THẬT: dòng
 *     `const managerName = employees[0].name || ""` đọc nhầm field
 *     `name` (object {firstName,lastName,middleName} của CHÍNH nhân
 *     viên đó) thay vì field `manager` (chuỗi tên quản lý) — sẽ trả về
 *     1 object thay vì chuỗi "Emily Catherine Johnson" như Figure 2 yêu
 *     cầu. Đã sửa thành `employees[0].manager`.
 *   - Model `department.model.js` THIẾU `unique: true` trên `name` —
 *     không thể tạo lỗi trùng tên (Figure 6) nếu thiếu unique index.
 *   - Model `employee.model.js` THIẾU `required: true` trên
 *     `name.middleName`, `gender`, và validator định dạng email/độ
 *     mạnh mật khẩu — không thể tạo các lỗi validation ở Figure 7/8.
 * Đã SỬA cả 2 model và TỰ VIẾT `create` hoàn chỉnh — không copy mù bản
 * "given" này. `findAll` (Câu 1) đã đúng sẵn trong bản given, đã tự
 * kiểm lại độc lập khớp Figure 1 trước khi tin dùng.
 *
 * Điểm gốc: Q1=3.5, Q2=2.5, Q3=4.0 (đúng theo đề, tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE1.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE1.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Schema (department, employee, job collections; department 1—M employee; job M—1 employee):</b>` +
  `<pre><code class="language-javascript">// department.model.js (given)
const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

// employee.model.js (given)
const EmployeeSchema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    manager: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "department" },
    account: {
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    dependents: [
        { _id: { type: Schema.Types.ObjectId }, fullName: { type: String }, relation: { type: String } }
    ],
    jobs: [{ type: Schema.Types.ObjectId, ref: "job" }]
}, { timestamps: true });

// job.model.js (given)
const JobSchema = new Schema({
    name: { type: String, required: true },
    issues: [{ title: { type: String }, date: { type: Date, default: Date.now }, isCompleted: { type: Boolean, default: false } }],
    startDate: { type: Date },
    endDate: { type: Date }
}, { timestamps: true });</code></pre></div>`,
  `<div class="pe-system"><b>Schema đề cho (bảng department, employee, job; department 1—N employee; job N—1 employee):</b>` +
  `<pre><code class="language-javascript">// department.model.js (đề cho)
const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

// employee.model.js (đề cho)
const EmployeeSchema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    manager: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "department" },
    account: {
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    dependents: [
        { _id: { type: Schema.Types.ObjectId }, fullName: { type: String }, relation: { type: String } }
    ],
    jobs: [{ type: Schema.Types.ObjectId, ref: "job" }]
}, { timestamps: true });

// job.model.js (đề cho)
const JobSchema = new Schema({
    name: { type: String, required: true },
    issues: [{ title: { type: String }, date: { type: Date, default: Date.now }, isCompleted: { type: Boolean, default: false } }],
    startDate: { type: Date },
    endDate: { type: Date }
}, { timestamps: true });</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Fall 2024)</strong>. The real exam runs in VS Code + MongoDB Compass + Postman with a live database. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question (not compiled/executed). Build a RESTful API on database <code>SDN302_FALL24_B1</code> (collections: departments, employees, jobs) fulfilling each question below. A score of 0 is given for work not using a MongoDB connection string from a <code>.env</code> file, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Fall 2024)</strong>. Đề thi thật chạy trong VS Code + MongoDB Compass + Postman với database sống. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu (không biên dịch/chạy thật). Xây RESTful API trên database <code>SDN302_FALL24_B1</code> (bảng: departments, employees, jobs) đáp ứng từng câu dưới. Điểm 0 nếu không dùng connection string MongoDB từ file <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (3.5 marks):</strong> display all employees, with API endpoint <code>GET http://localhost:9999/employee/list</code>. Output: an array of employee objects containing the department name and manager information.</p>` +
    `<pre><code class="language-json">[
  {
    "employeeId": "6706c540be090ec1c08abf8e",
    "fullName": "Emily Catherine Johnson",
    "dob": "1978-03-30T08:00:00.000Z",
    "gender": "female",
    "email": "emily.johnson@example.com",
    "department": "Human Resources",
    "manager": "",
    "dependents": []
  },
  {
    "employeeId": "6706c540be090ec1c08abf89",
    "fullName": "John Albert Doe",
    "dob": "1980-05-15T08:00:00.000Z",
    "gender": "male",
    "email": "john.doe@example.com",
    "department": "Human Resources",
    "manager": "Emily Catherine Johnson",
    "dependents": [
      { "name": "Jane Doe", "relation": "Wife" },
      { "name": "Jake Doe", "relation": "Son" }
    ]
  }
]</code></pre>` +
    `<p><strong>Requirement:</strong> return an array of employee objects from the employee collection, without any output formatting techniques (1 mark). Display the correct number of data fields and formatting as output (0.5 marks). Display correct data of the fields: fullName (0.5), department (0.5), manager (0.5), dependents (0.5). <i>Note: 0.5 marks deducted if output field names are incorrect.</i></p>`,
    `<p><strong>Câu 1 (3.5 điểm):</strong> hiển thị tất cả nhân viên, endpoint <code>GET http://localhost:9999/employee/list</code>. Output: mảng object nhân viên gồm tên phòng ban và thông tin quản lý.</p>` +
    `<pre><code class="language-json">[
  {
    "employeeId": "6706c540be090ec1c08abf8e",
    "fullName": "Emily Catherine Johnson",
    "dob": "1978-03-30T08:00:00.000Z",
    "gender": "female",
    "email": "emily.johnson@example.com",
    "department": "Human Resources",
    "manager": "",
    "dependents": []
  },
  {
    "employeeId": "6706c540be090ec1c08abf89",
    "fullName": "John Albert Doe",
    "dob": "1980-05-15T08:00:00.000Z",
    "gender": "male",
    "email": "john.doe@example.com",
    "department": "Human Resources",
    "manager": "Emily Catherine Johnson",
    "dependents": [
      { "name": "Jane Doe", "relation": "Wife" },
      { "name": "Jake Doe", "relation": "Son" }
    ]
  }
]</code></pre>` +
    `<p><strong>Yêu cầu:</strong> trả về mảng object nhân viên từ bảng employee, không kỹ thuật định dạng output nào (1đ). Đúng số lượng field và định dạng output (0.5đ). Đúng dữ liệu field: fullName (0.5), department (0.5), manager (0.5), dependents (0.5). <i>Lưu ý: trừ 0.5đ nếu tên field output sai.</i></p>`,
  ),
  starterCode:
`const db = require("../models/index");
const Employee = db.employee;

const findAll = async (req, res, next) => {
    try {
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    } catch (error) {
        next(error);
    }
};

module.exports = { findAll };`,
  sampleSolution:
`const db = require("../models/index");
const Employee = db.employee;

const findAll = async (req, res, next) => {
    try {
        // ---------- Student's code starts from here ----------
        const employees = await Employee.find()
            .populate("department", "name")
            .lean();

        const formattedEmployees = employees.map((employee) => ({
            employeeId: employee._id,
            fullName: \`\${employee.name.firstName} \${employee.name.middleName || ""} \${employee.name.lastName}\`.trim(),
            dob: employee.dateOfBirth,
            gender: employee.gender,
            email: employee.account?.email,
            department: employee.department?.name || "",
            manager: employee.manager || "",
            dependents: (employee.dependents || []).map((dependent) => ({
                name: dependent.fullName,
                relation: dependent.relation,
            })),
        }));

        res.json(formattedEmployees);
        // -------------------------------------------------------
    } catch (error) {
        next(error);
    }
};

module.exports = { findAll };`,
  explanation: B(
    `<p>Verified independently against the paper's Figure 1 sample field-by-field: <code>fullName</code> concatenates firstName+middleName+lastName (trimmed, so a missing middleName doesn't leave a double space); <code>department</code> requires <code>.populate("department", "name")</code> since department is stored as an ObjectId ref, then reads <code>.name</code>; <code>manager</code> is read directly as a plain string field (the schema stores it as <code>String</code>, not a ref, so no populate needed — Emily has no manager, hence <code>""</code>); <code>dependents</code> is remapped from the schema's <code>fullName</code>/<code>relation</code> fields to the output's <code>name</code>/<code>relation</code> fields (field name changes on the way out). <code>.lean()</code> is used per the requirement "without any output formatting techniques" (avoids Mongoose document getters/virtuals reshaping the raw data).</p>`,
    `<p>Đã tự kiểm độc lập so từng field với Figure 1 của đề: <code>fullName</code> ghép firstName+middleName+lastName (có trim, để middleName thiếu không để lại 2 dấu cách); <code>department</code> cần <code>.populate("department", "name")</code> vì department lưu dạng ObjectId ref, rồi đọc <code>.name</code>; <code>manager</code> đọc trực tiếp field chuỗi thường (schema lưu <code>String</code>, không phải ref, nên không cần populate — Emily không có quản lý nên <code>""</code>); <code>dependents</code> đổi tên field từ <code>fullName</code>/<code>relation</code> của schema sang <code>name</code>/<code>relation</code> ở output. Dùng <code>.lean()</code> đúng yêu cầu "không kỹ thuật định dạng output nào" (tránh getter/virtual của Mongoose document làm biến dạng dữ liệu thô).</p>`,
  ),
  rubric: [
    { id: 'raw_array_no_formatting', criterion: B('Returns a plain array of employee objects fetched from the employee collection (e.g. using .lean() or plain find()), without extra formatting techniques applied to the raw query.', 'Trả về mảng thuần các object nhân viên lấy từ bảng employee (VD dùng .lean() hoặc find() thuần), không kỹ thuật định dạng thêm lên kết quả truy vấn thô.'), weight: 1, maxScore: 1 },
    { id: 'field_count_and_format', criterion: B('Output has exactly the correct set of fields (employeeId, fullName, dob, gender, email, department, manager, dependents), correctly named and structured.', 'Output có đúng đủ bộ field (employeeId, fullName, dob, gender, email, department, manager, dependents), đặt tên và cấu trúc đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'fullname_correct', criterion: B('fullName correctly concatenates firstName, middleName (optional), and lastName.', 'fullName ghép đúng firstName, middleName (tuỳ chọn), lastName.'), weight: 1, maxScore: 0.5 },
    { id: 'department_correct', criterion: B('department is correctly resolved to the department NAME (via populate), not the raw ObjectId.', 'department được đúng phân giải thành TÊN phòng ban (qua populate), không phải ObjectId thô.'), weight: 1, maxScore: 0.5 },
    { id: 'manager_correct', criterion: B('manager is read as the plain string field directly (no populate attempted on it, since it is not a ref in the schema), correctly showing "" when absent.', 'manager đọc đúng field chuỗi thường trực tiếp (không cố populate, vì không phải ref trong schema), hiện đúng "" khi không có.'), weight: 1, maxScore: 0.5 },
    { id: 'dependents_correct', criterion: B('dependents is correctly mapped to an array of {name, relation} objects.', 'dependents mapped đúng thành mảng object {name, relation}.'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (2.5 marks):</strong> list employees by department ID, with API endpoint <code>GET http://localhost:9999/department/:departmentId</code>. Output: a single object.</p>` +
    `<pre><code class="language-json">{
  "department": "Human Resources",
  "manager": "Emily Catherine Johnson",
  "employees": [
    { "id": "6706c540be090ec1c08abf89", "fullName": "John Albert Doe" },
    { "id": "6706c540be090ec1c08abf8c", "fullName": "Alice B Smith" }
  ]
}</code></pre>` +
    `<p><strong>Requirement:</strong> display the correct number of data fields and formatting as output (0.5 marks). Return correct data of the fields: department (0.5), manager (0.5), employees (0.5). If no employees are found in the department, return an appropriate error response instead of an empty/malformed object (0.5).</p>`,
    `<p><strong>Câu 2 (2.5 điểm):</strong> liệt kê nhân viên theo departmentId, endpoint <code>GET http://localhost:9999/department/:departmentId</code>. Output: 1 object.</p>` +
    `<pre><code class="language-json">{
  "department": "Human Resources",
  "manager": "Emily Catherine Johnson",
  "employees": [
    { "id": "6706c540be090ec1c08abf89", "fullName": "John Albert Doe" },
    { "id": "6706c540be090ec1c08abf8c", "fullName": "Alice B Smith" }
  ]
}</code></pre>` +
    `<p><strong>Yêu cầu:</strong> đúng số lượng field và định dạng output (0.5đ). Đúng dữ liệu field: department (0.5), manager (0.5), employees (0.5). Nếu phòng ban không có nhân viên nào, trả về phản hồi lỗi phù hợp thay vì object rỗng/sai định dạng (0.5).</p>`,
  ),
  starterCode:
`const db = require("../models/index");
const Employee = db.employee;

const findEmployeesByDepartment = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        // ---------- Student's code starts from here ----------

        // -------------------------------------------------------
    } catch (error) {
        next(error);
    }
};

module.exports = { findEmployeesByDepartment };`,
  sampleSolution:
`const db = require("../models/index");
const Employee = db.employee;

const findEmployeesByDepartment = async (req, res, next) => {
    try {
        const { departmentId } = req.params;
        // ---------- Student's code starts from here ----------
        const employees = await Employee.find({ department: departmentId })
            .populate("department", "name")
            .lean();

        if (!employees.length) {
            return res.status(404).json({ message: "No employees found in this department." });
        }

        const departmentName = employees[0].department?.name || "Unknown";
        const managerName = employees[0].manager || "";

        res.json({
            department: departmentName,
            manager: managerName,
            employees: employees.map((employee) => ({
                id: employee._id,
                fullName: \`\${employee.name.firstName} \${employee.name.middleName || ""} \${employee.name.lastName}\`.trim(),
            })),
        });
        // -------------------------------------------------------
    } catch (error) {
        next(error);
    }
};

module.exports = { findEmployeesByDepartment };`,
  explanation: B(
    `<p><b>Caught a real bug in a "given/solution" reference package found alongside this paper's source</b>: it read <code>const managerName = employees[0].name || ""</code> — <code>employees[0].name</code> is that employee's OWN name sub-object (<code>{firstName, lastName, middleName}</code>), not the manager. The manager's name is a separate plain-string field, <code>employees[0].manager</code> — that is what must be read to match the paper's own expected output ("Emily Catherine Johnson" as a string, not an object). Fixed by reading the correct field. Also added a 404 guard for an empty department, since returning a single object with an empty <code>employees</code> array and undefined department/manager would not match "correct format" for a department that doesn't exist or has no staff.</p>`,
    `<p><b>Bắt được lỗi thật trong gói "given/solution" tham khảo tìm thấy cùng nguồn đề này</b>: nó đọc <code>const managerName = employees[0].name || ""</code> — <code>employees[0].name</code> là object tên của CHÍNH nhân viên đó (<code>{firstName, lastName, middleName}</code>), không phải quản lý. Tên quản lý là 1 field chuỗi thường riêng, <code>employees[0].manager</code> — đó mới là cái cần đọc để khớp đúng output mẫu của đề ("Emily Catherine Johnson" dạng chuỗi, không phải object). Đã sửa đọc đúng field. Cũng thêm chốt 404 cho phòng ban rỗng, vì trả 1 object với mảng <code>employees</code> rỗng và department/manager undefined sẽ không khớp "đúng định dạng" cho phòng ban không tồn tại hoặc không có nhân viên.</p>`,
  ),
  rubric: [
    { id: 'field_count_and_format', criterion: B('Output has exactly the correct set of fields (department, manager, employees), correctly named and structured as a single object.', 'Output có đúng đủ bộ field (department, manager, employees), đặt tên đúng, cấu trúc thành 1 object.'), weight: 1, maxScore: 0.5 },
    { id: 'department_field_correct', criterion: B('department is correctly resolved to the department NAME.', 'department phân giải đúng thành TÊN phòng ban.'), weight: 1, maxScore: 0.5 },
    { id: 'manager_field_correct', criterion: B('manager reads the manager field from an employee record in that department (e.g. employees[0].manager), NOT that employee\'s own name object — a real bug to catch and avoid.', 'manager đọc đúng field manager từ 1 bản ghi nhân viên trong phòng ban đó (VD employees[0].manager), KHÔNG phải object tên của chính nhân viên đó — lỗi thật cần bắt và tránh.'), weight: 1, maxScore: 0.5 },
    { id: 'employees_list_correct', criterion: B('employees is a correctly formatted array of {id, fullName} for every employee in that department.', 'employees là mảng {id, fullName} định dạng đúng cho mọi nhân viên phòng ban đó.'), weight: 1, maxScore: 0.5 },
    { id: 'empty_department_handling', criterion: B('Returns an appropriate error response (e.g. 404) when the department has no employees, rather than a malformed/empty success object.', 'Trả về phản hồi lỗi phù hợp (VD 404) khi phòng ban không có nhân viên, thay vì object thành công rỗng/sai định dạng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 4, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (4.0 marks):</strong> create a new department together with the employees belonging to it, with API endpoint <code>POST http://localhost:9999/department/create</code>.</p>` +
    `<p><b>Request body (raw JSON):</b></p>` +
    `<pre><code class="language-json">{
  "name": "Customer Service",
  "description": "Handles customer inquiries and resolves issues.",
  "employees": [
    { "name": { "firstName": "Michael", "lastName": "Doe", "middleName": "Ryan" }, "dateOfBirth": "1990-05-15", "gender": "male", "department": null },
    { "name": { "firstName": "Emily", "lastName": "Clark", "middleName": "Jane" }, "dateOfBirth": "1992-08-20", "gender": "female", "department": null }
  ]
}</code></pre>` +
    `<p><b>Response (201 Created):</b></p>` +
    `<pre><code class="language-json">{
  "message": "Create a new department and add employees successfully",
  "result": {
    "departmentId": "6705ffee87114567a57ec5e7",
    "departmentName": "Customer Service",
    "employeesList": [
      { "name": "Michael Ryan Doe" },
      { "name": "Emily Jane Clark" }
    ]
  }
}</code></pre>` +
    `<p><strong>Requirement:</strong> create a new department successfully (0.5). Create new employees belonging to the successfully added department (1) — <i>reduce 1 mark if the "department" field of each inserted employee document is not updated</i>. Return the correct format/result after a successful insertion, as shown above (1).</p>` +
    `<p><strong>Use model validation to check the input data:</strong> when a new department is created without a "name" field, respond <code>{"error":{"status":500,"message":"department validation failed: name: Department name is required"}}</code> (0.25). When the department name already exists, respond a duplicate-key error like <code>{"error":{"status":500,"message":"E11000 duplicate key error collection: SDN302_FALL24_B1.departments index: name_1 dup key: {...}"}}</code> (0.25). When the employee name data is missing firstName/middlename/lastName and the gender value is not one of ['male','female','other'] (0.5). When the email format is invalid and the password is weak (must be at least 8 characters, including at least 1 uppercase letter, 1 lowercase letter, and 1 special character) (0.5).</p>`,
    `<p><strong>Câu 3 (4.0 điểm):</strong> tạo phòng ban mới cùng các nhân viên thuộc phòng đó, endpoint <code>POST http://localhost:9999/department/create</code>.</p>` +
    `<p><b>Request body (raw JSON):</b></p>` +
    `<pre><code class="language-json">{
  "name": "Customer Service",
  "description": "Handles customer inquiries and resolves issues.",
  "employees": [
    { "name": { "firstName": "Michael", "lastName": "Doe", "middleName": "Ryan" }, "dateOfBirth": "1990-05-15", "gender": "male", "department": null },
    { "name": { "firstName": "Emily", "lastName": "Clark", "middleName": "Jane" }, "dateOfBirth": "1992-08-20", "gender": "female", "department": null }
  ]
}</code></pre>` +
    `<p><b>Response (201 Created):</b></p>` +
    `<pre><code class="language-json">{
  "message": "Create a new department and add employees successfully",
  "result": {
    "departmentId": "6705ffee87114567a57ec5e7",
    "departmentName": "Customer Service",
    "employeesList": [
      { "name": "Michael Ryan Doe" },
      { "name": "Emily Jane Clark" }
    ]
  }
}</code></pre>` +
    `<p><strong>Yêu cầu:</strong> tạo phòng ban mới thành công (0.5). Tạo nhân viên mới thuộc phòng ban vừa tạo (1) — <i>trừ 1 điểm nếu field "department" của mỗi nhân viên chèn vào không được cập nhật</i>. Trả đúng định dạng/kết quả sau khi chèn thành công, như trên (1).</p>` +
    `<p><strong>Dùng model validation kiểm dữ liệu vào:</strong> khi tạo phòng ban thiếu field "name", trả <code>{"error":{"status":500,"message":"department validation failed: name: Department name is required"}}</code> (0.25). Khi tên phòng ban đã tồn tại, trả lỗi trùng khoá như <code>{"error":{"status":500,"message":"E11000 duplicate key error collection: SDN302_FALL24_B1.departments index: name_1 dup key: {...}"}}</code> (0.25). Khi thiếu firstName/middlename/lastName của nhân viên và gender không thuộc ['male','female','other'] (0.5). Khi email sai định dạng và mật khẩu yếu (phải tối thiểu 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường, 1 ký tự đặc biệt) (0.5).</p>`,
  ),
  starterCode:
`// ===== models/department.model.js (given, to be fixed) =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("department", DepartmentSchema);

// ===== models/employee.model.js (given, to be fixed) =====
const EmployeeSchema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        middleName: { type: String }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    manager: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "department" },
    account: {
        email: { type: String, required: true },
        password: { type: String, required: true }
    },
    dependents: [
        { _id: { type: Schema.Types.ObjectId }, fullName: { type: String }, relation: { type: String } }
    ],
    jobs: [{ type: Schema.Types.ObjectId, ref: "job" }]
}, { timestamps: true });

module.exports = mongoose.model("employee", EmployeeSchema);

// ===== controllers/department.controller.js =====
const db = require("../models/index");
const Department = db.department;
const Employee = db.employee;

const create = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { create };`,
  sampleSolution:
`// ===== models/department.model.js (FIXED: added unique index on name) =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const DepartmentSchema = new Schema({
    name: { type: String, required: [true, "Department name is required"], unique: true },
    description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("department", DepartmentSchema);

// ===== models/employee.model.js (FIXED: required middleName/gender, email/password validators) =====
const EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
const STRONG_PASSWORD_RE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

const EmployeeSchema = new Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: [true, "LastName is required"] },
        middleName: { type: String, required: [true, "MiddleName is required"] }
    },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    manager: { type: String },
    department: { type: Schema.Types.ObjectId, ref: "department" },
    account: {
        email: {
            type: String,
            match: [EMAIL_RE, "Email is not valid"]
        },
        password: {
            type: String,
            validate: {
                validator: (v) => v == null || STRONG_PASSWORD_RE.test(v),
                message: "Password is not strong"
            }
        }
    },
    dependents: [
        { _id: { type: Schema.Types.ObjectId }, fullName: { type: String }, relation: { type: String } }
    ],
    jobs: [{ type: Schema.Types.ObjectId, ref: "job" }]
}, { timestamps: true });

module.exports = mongoose.model("employee", EmployeeSchema);

// ===== controllers/department.controller.js =====
const db = require("../models/index");
const Department = db.department;
const Employee = db.employee;

const create = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, description, employees } = req.body;

        const department = await Department.create({ name, description });

        const createdEmployees = [];
        if (Array.isArray(employees)) {
            for (const emp of employees) {
                const employee = await Employee.create({
                    name: emp.name,
                    dateOfBirth: emp.dateOfBirth,
                    gender: emp.gender,
                    manager: emp.manager,
                    account: emp.account,
                    department: department._id,
                });
                createdEmployees.push(employee);
            }
        }

        res.status(201).json({
            message: "Create a new department and add employees successfully",
            result: {
                departmentId: department._id,
                departmentName: department.name,
                employeesList: createdEmployees.map((e) => ({
                    name: \`\${e.name.firstName} \${e.name.middleName || ""} \${e.name.lastName}\`.trim(),
                })),
            },
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { create };`,
  explanation: B(
    `<p><b>Fixed two real gaps found in a "given/solution" reference package alongside this paper's source</b> — its <code>create</code> function was an empty stub (Question 3 had no reference answer at all), and its models could not produce two of the four required validation errors: <code>department.model.js</code> was missing <code>unique: true</code> on <code>name</code> (without it, MongoDB never raises the E11000 duplicate-key error the paper's Figure 6 requires), and <code>employee.model.js</code> was missing <code>required</code> on <code>name.middleName</code>/<code>gender</code>, plus any email-format or password-strength validator at all (without them, Figure 7 and Figure 8's error scenarios simply cannot occur). Both models here are corrected accordingly.</p>
     <p><b>Design choice on account.email/account.password:</b> deliberately left NOT required (only format/strength validated when a value IS supplied), because the paper's own sample request body for the main success case (shown above) omits <code>account</code> entirely for both employees — making email/password strictly required would make the paper's own documented happy-path payload fail. This still satisfies Figure 7 (missing name/bad gender, unrelated to account) and Figure 8 (invalid email/weak password — implying that specific test request supplies an <code>account</code> block with a badly-formed value, which the match/validate rules correctly reject).</p>
     <p>Department is created first (fails fast on missing/duplicate name before touching employees); each employee is then created with <code>department: department._id</code> explicitly set (satisfying the "reduce 1 mark if department field not updated" note); the response shape matches the paper's Figure 4 exactly.</p>`,
    `<p><b>Đã vá 2 lỗ hổng thật tìm thấy trong gói "given/solution" tham khảo cùng nguồn đề này</b> — hàm <code>create</code> của nó là stub rỗng (Câu 3 hoàn toàn không có lời giải tham khảo), và model của nó không thể tạo ra 2 trong 4 lỗi validation đề yêu cầu: <code>department.model.js</code> thiếu <code>unique: true</code> trên <code>name</code> (thiếu nó, MongoDB không bao giờ ra lỗi trùng khoá E11000 mà Figure 6 của đề yêu cầu), và <code>employee.model.js</code> thiếu <code>required</code> trên <code>name.middleName</code>/<code>gender</code>, cộng hoàn toàn không có validator định dạng email hay độ mạnh mật khẩu (thiếu chúng, tình huống lỗi Figure 7 và Figure 8 đơn giản không thể xảy ra). Cả 2 model ở đây đã sửa tương ứng.</p>
     <p><b>Lựa chọn thiết kế về account.email/account.password:</b> cố tình KHÔNG bắt buộc (chỉ kiểm định dạng/độ mạnh khi CÓ giá trị), vì request body mẫu chính của đề cho trường hợp thành công (ở trên) hoàn toàn không có <code>account</code> cho cả 2 nhân viên — bắt buộc email/password sẽ làm chính payload happy-path đề tài liệu hoá thất bại. Vẫn thoả Figure 7 (thiếu tên/gender sai, không liên quan account) và Figure 8 (email sai định dạng/password yếu — ngụ ý request test đó có gửi kèm block <code>account</code> với giá trị sai định dạng, mà quy tắc match/validate bắt đúng).</p>
     <p>Department tạo trước (fail nhanh nếu thiếu/trùng tên trước khi đụng tới nhân viên); mỗi nhân viên tạo sau có <code>department: department._id</code> gán tường minh (thoả lưu ý "trừ 1 điểm nếu field department không cập nhật"); định dạng phản hồi khớp đúng Figure 4 của đề.</p>`,
  ),
  rubric: [
    { id: 'department_created', criterion: B('Successfully creates a new department from the request body.', 'Tạo thành công phòng ban mới từ request body.'), weight: 1, maxScore: 0.5 },
    { id: 'employees_created_with_department', criterion: B('Successfully creates employees belonging to the newly created department, with each employee\'s department field explicitly set to the new department\'s _id.', 'Tạo thành công nhân viên thuộc phòng ban vừa tạo, mỗi nhân viên có field department gán tường minh đúng _id phòng ban mới.'), weight: 1, maxScore: 1 },
    { id: 'response_format_correct', criterion: B('Returns the correct response format/result after a successful insertion, matching the paper\'s example (message, result.departmentId, result.departmentName, result.employeesList[{name}]).', 'Trả đúng định dạng/kết quả sau khi chèn thành công, khớp ví dụ đề (message, result.departmentId, result.departmentName, result.employeesList[{name}]).'), weight: 1, maxScore: 1 },
    { id: 'missing_department_name_validation', criterion: B('Creating a department without a "name" field produces the correct model validation error.', 'Tạo phòng ban thiếu field "name" tạo đúng lỗi model validation.'), weight: 1, maxScore: 0.25 },
    { id: 'duplicate_department_name_validation', criterion: B('Creating a department with an already-existing name produces a duplicate-key error (requires a unique index on department.name).', 'Tạo phòng ban với tên đã tồn tại tạo đúng lỗi trùng khoá (cần unique index trên department.name).'), weight: 1, maxScore: 0.25 },
    { id: 'employee_name_gender_validation', criterion: B('Creating an employee with missing name.middleName/name.lastName or an invalid gender value produces the correct model validation error(s).', 'Tạo nhân viên thiếu name.middleName/name.lastName hoặc gender không hợp lệ tạo đúng lỗi model validation.'), weight: 1, maxScore: 0.5 },
    { id: 'email_password_validation', criterion: B('Creating an employee with an invalid email format or a weak password (not meeting the 8-char/uppercase/lowercase/special-character rule) produces the correct validation error.', 'Tạo nhân viên với email sai định dạng hoặc mật khẩu yếu (không đủ quy tắc 8 ký tự/hoa/thường/đặc biệt) tạo đúng lỗi validation.'), weight: 1, maxScore: 0.5 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE1',
    title: 'SDN302 – Practical Exam (Fall 2024), Employee/Department Management API|||SDN302 – Thi thực hành (Fall 2024), API quản lý Employee/Department',
    description: 'SDN302 PE (CODE): Express + Mongoose REST API — employee listing with populate, department lookup, and department+employee creation with full model validation, AI-graded.|||PE SDN302 (viết mã): REST API Express + Mongoose — liệt kê nhân viên có populate, tra cứu phòng ban, tạo phòng ban+nhân viên có validation đầy đủ, chấm AI.',
    durationMinutes: 90,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
