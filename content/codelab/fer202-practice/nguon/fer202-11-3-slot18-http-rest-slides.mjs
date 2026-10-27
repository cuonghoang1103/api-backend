/**
 * FER202 · 11.3 — Slide check: HTTP, JSON & REST (Slot 18). Điền bảng (verb ↔ CRUD, mã trạng thái) + trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-11-3-slot18-http-rest-slides',
  ten: '11.3 Slide check — HTTP & REST',
  khoa: KHOA,
  baiHoc: 'fer202-11-3-slot18-http-rest-slides',
  de: [
    tinh({
      loai: 'table',
      tieuDe: 'REST table: method, URI and status code',
      doKho: 'MEDIUM', phut: 12,
      khaiNiem: ['HTTP verbs', 'resource URIs', 'status codes'], the: ['http', 'rest', 'table'],
      moTa: {
        en: '<p>A REST API for students lives at <code>/students</code>. For each operation fill the HTTP <b>method</b> (GET, POST, PUT, PATCH, DELETE), the <b>URI</b> (use <code>/students</code> or <code>/students/5</code>) and the usual <b>success status code</b>. Then match common error situations to their status code.</p>',
        vi: '<p>API REST cho sinh viên ở <code>/students</code>. Với mỗi thao tác điền <b>method</b> HTTP (GET, POST, PUT, PATCH, DELETE), <b>URI</b> (dùng <code>/students</code> hoặc <code>/students/5</code>) và <b>mã thành công</b> thường gặp. Sau đó ghép tình huống lỗi với mã trạng thái.</p>',
      },
      bang: [
        {
          ma: 'crud', de: 'Operations on the students resource',
          cot: [{ ma: 'op', ten: 'Operation' }, { ma: 'm', ten: 'Method' }, { ma: 'u', ten: 'URI' }, { ma: 's', ten: 'Success status' }],
          hang: [
            { ma: 'list', o: { op: 'List all students' } },
            { ma: 'one', o: { op: 'Read student #5' } },
            { ma: 'create', o: { op: 'Create a new student' } },
            { ma: 'replace', o: { op: 'Replace student #5 completely' } },
            { ma: 'email', o: { op: 'Change only the email of student #5' } },
            { ma: 'delete', o: { op: 'Delete student #5' } },
          ],
          dapAn: {
            'list.m': 'GET', 'list.u': '/students', 'list.s': '200',
            'one.m': 'GET', 'one.u': '/students/5', 'one.s': '200',
            'create.m': 'POST', 'create.u': '/students', 'create.s': '201',
            'replace.m': 'PUT', 'replace.u': '/students/5', 'replace.s': '200',
            'email.m': 'PATCH', 'email.u': '/students/5', 'email.s': '200',
            'delete.m': 'DELETE', 'delete.u': '/students/5', 'delete.s': ['204', '200'],
          },
          giaiThich: 'Collections (/students) are listed and created into; single items (/students/5) are read, replaced, patched and deleted. 201 Created for POST; DELETE returns 204 No Content (json-server answers 200).|||Tập hợp (/students) để liệt kê và tạo mới; phần tử (/students/5) để đọc, thay, sửa một phần, xoá. POST trả 201 Created; DELETE trả 204 No Content (json-server trả 200).',
        },
        {
          ma: 'err', de: 'Which status code?',
          cot: [{ ma: 'tinh', ten: 'Situation' }, { ma: 's', ten: 'Status' }],
          hang: [
            { ma: 'nf', o: { tinh: 'GET /students/999 — no such student' } },
            { ma: 'bad', o: { tinh: 'POST with an invalid email in the body' } },
            { ma: 'auth', o: { tinh: 'No login token sent' } },
            { ma: 'forbid', o: { tinh: 'Logged in as a student, trying to delete another student' } },
            { ma: 'crash', o: { tinh: 'Unhandled exception on the server' } },
          ],
          dapAn: { 'nf.s': '404', 'bad.s': ['400', '422'], 'auth.s': '401', 'forbid.s': '403', 'crash.s': '500' },
          giaiThich: '4xx = the client did something wrong (400 bad data, 401 not authenticated, 403 not allowed, 404 not found); 5xx = the server failed.|||4xx = phía client sai (400 dữ liệu sai, 401 chưa xác thực, 403 không được phép, 404 không tìm thấy); 5xx = server lỗi.',
        },
      ],
      goiY: ['Danh từ số nhiều cho tập hợp, thêm /id cho một phần tử; động từ nằm ở METHOD, không nằm trong URI.', '2xx thành công · 4xx lỗi phía client · 5xx lỗi phía server.'],
      loiHayGap: ['Viết URI kiểu động từ <code>/getStudents</code>, <code>/deleteStudent?id=5</code> — không phải REST.', 'Nhầm 401 (chưa đăng nhập) với 403 (đã đăng nhập nhưng không có quyền).'],
      giaiThich: '<p>REST: tài nguyên là danh từ (URI), hành động là method HTTP, kết quả là mã trạng thái. PUT thay toàn bộ, PATCH sửa một phần.</p>',
      thuatNgu: [{ en: 'resource', vi: 'tài nguyên (sinh viên, bài viết…)' }, { en: 'idempotent', vi: 'gọi nhiều lần cho cùng kết quả như một lần (GET, PUT, DELETE)' }],
    }),
    tinh({
      tieuDe: 'Slide check: client/server, HTTP, JSON, REST',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['client/server', 'request/response', 'JSON', 'REST constraints'], the: ['http', 'rest', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 18: why the network is asynchronous, what is inside an HTTP request and response, JSON syntax, and the principles of REST (resources, representations, statelessness).</p>',
        vi: '<p>Mười câu về Slot 18: vì sao mạng là bất đồng bộ, trong request/response HTTP có gì, cú pháp JSON, và nguyên tắc REST (tài nguyên, biểu diễn, phi trạng thái).</p>',
      },
      goiY: ['JSON: khoá luôn trong nháy kép, không có hàm, không có undefined, không dấu phẩy thừa.', 'Stateless: mỗi request tự mang đủ thông tin (vd token).'],
      loiHayGap: ['Nghĩ JSON là object JavaScript — nó là CHUỖI văn bản theo cú pháp gần giống.', 'Nghĩ GET có thể gửi body để tạo dữ liệu.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'stateless', vi: 'server không nhớ trạng thái giữa các request' }],
      cauHoi: [
        q('q1', 'Why are network calls asynchronous in the browser?', [['a', 'JavaScript cannot do math while waiting'], ['b', 'A response may take a long time; blocking the single UI thread would freeze the page'], ['c', 'Servers require it'], ['d', 'They are not']], ['b'], 'The browser keeps the UI responsive and calls you back later.|||Trình duyệt giữ giao diện mượt và gọi lại bạn sau.'),
        q('q2', 'An HTTP request contains… (choose all)', [['a', 'A method'], ['b', 'A URL'], ['c', 'Headers'], ['d', 'A status code']], [['a', 'b', 'c']], 'The status code is in the RESPONSE. A body is optional.|||Mã trạng thái nằm ở RESPONSE. Body là tuỳ chọn.', true),
        q('q3', 'Which is valid JSON?', [['a', "<code>{ name: 'An' }</code>"], ['b', '<code>{ "name": "An", "age": 20 }</code>'], ['c', '<code>{ "name": "An", }</code>'], ['d', '<code>{ "fn": function() {} }</code>']], ['b'], 'Double-quoted keys and strings, no trailing comma, no functions.|||Khoá và chuỗi trong nháy kép, không phẩy thừa, không hàm.'),
        q('q4', 'Convert a JS object to a JSON string:', [['a', '<code>JSON.parse(obj)</code>'], ['b', '<code>JSON.stringify(obj)</code>'], ['c', '<code>obj.toJSON()</code> always'], ['d', '<code>String(obj)</code>']], ['b'], 'parse goes the other way: string → value.|||parse làm chiều ngược lại: chuỗi → giá trị.'),
        q('q5', 'The <code>Content-Type: application/json</code> header tells the receiver…', [['a', 'the body is JSON'], ['b', 'the user is logged in'], ['c', 'to cache the response'], ['d', 'the request is GET']], ['a'], 'axios sets it automatically when you send an object.|||axios tự đặt khi bạn gửi object.'),
        q('q6', 'In REST, a URI should name…', [['a', 'an action (/createStudent)'], ['b', 'a resource (/students/5)'], ['c', 'a file on disk'], ['d', 'a database table only']], ['b'], 'The method says what to do with it.|||Method cho biết làm gì với nó.'),
        q('q7', '"Stateless" means…', [['a', 'the server has no database'], ['b', 'each request carries all information needed; the server keeps no client session between requests'], ['c', 'responses are never cached'], ['d', 'only GET is allowed']], ['b'], 'That is why APIs send a token with every request.|||Vì vậy API gửi token kèm mọi request.'),
        q('q8', 'Which methods should NOT change data on the server?', [['a', 'GET'], ['b', 'POST'], ['c', 'DELETE'], ['d', 'PATCH']], ['a'], 'GET is safe; it only reads.|||GET là "an toàn": chỉ đọc.'),
        q('q9', 'A "representation" of a resource is…', [['a', 'its database row'], ['b', 'the format it is transferred in, e.g. JSON or XML'], ['c', 'its URL'], ['d', 'a React component']], ['b'], 'Same resource, different representations.|||Cùng tài nguyên, nhiều cách biểu diễn.'),
        q('q10', 'PUT vs PATCH:', [['a', 'Identical'], ['b', 'PUT replaces the whole resource; PATCH changes only the given fields'], ['c', 'PATCH creates; PUT deletes'], ['d', 'PUT is only for files']], ['b'], 'Sending a partial object with PUT can wipe the other fields.|||Gửi object thiếu bằng PUT có thể xoá mất các trường còn lại.'),
      ],
    }),
  ],
});
