/**
 * 9.2 — Xác thực, người dùng, vai trò và quyền tối thiểu (soạn 24/11/2026, agent mgo).
 * Output thật: ../_ma.mjs OUT['s09-2-auth'] (kịch bản demo/s09/s09-2-auth.txt; container mgo-auth --auth, cổng 127.0.0.1:47023; client ngoài chạy --network host).
 * Khối: 0 ngoài container: createUser bị từ chối · 1–3 localhost exception (getUsers bị chặn, tạo user đầu được, user thứ hai bị chặn)
 * · 4–5 tạo ctshopApi (readWrite) + baoCao (read) · 6–9 ctshopApi ghi được, không drop DB / đọc admin / ghi DB khác · 10–12 baoCao · 13–19 view + vai trò tự định nghĩa
 * · 20–21 BẪY readWrite drop được collection + tạo index · 22–25 vai trò ungDungCtShop chỉ find/insert/update/remove ⇒ drop bị chặn
 * · 26–28 authSource sai / mật khẩu sai cùng một thông báo, log máy chủ phân biệt UserNotFound / storedKey mismatch · 29–31 mật khẩu có @ : / trong URI.
 * Mật khẩu trong kịch bản là mật khẩu LAB (container xoá ngay sau đó).
 * Nguồn GET kiểm 24/11/2026: MongoDB Docs localhost-exception, built-in-roles, security-user-defined-roles, security-scram, connection-string (percent-encode).
 */
import { lenh, ma, nguon, kv, lienKet, loiGiai } from '../_chung.mjs';

const K = 's09-2-auth';

const URI = `# Ba "người" trong kịch bản — mỗi người một chuỗi kết nối (mật khẩu LAB, đừng dùng lại)
quantri   mongodb://quantri:…@localhost:27017/ctshop?authSource=admin   # user tạo trong database admin
ctshopapi mongodb://ctshopApi:…@localhost:27017/ctshop                  # user tạo trong ctshop ⇒ authSource mặc định = ctshop
baocao    mongodb://baoCao:…@localhost:27017/ctshop`;

const ENV = `// Node.js — mật khẩu đi vào từ biến môi trường / trình quản lý bí mật, KHÔNG nằm trong mã hay git
import { MongoClient } from 'mongodb';
const u = encodeURIComponent(process.env.MONGO_USER);        // bắt buộc mã hoá: @ : / ? # [ ] % trong mật khẩu làm hỏng URI
const p = encodeURIComponent(process.env.MONGO_PASSWORD);
const client = new MongoClient(\`mongodb://\${u}:\${p}@db.noi-bo:27017/ctshop?authSource=ctshop\`, { appName: 'ctshop-api' });`;

export default {
  title: '9.2 — Authentication, users, roles and least privilege|||9.2 — Xác thực, người dùng, vai trò và quyền tối thiểu',
  slug: 'mgo-9-2-xac-thuc-phan-quyen',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bật --auth và đi hết vòng đời tài khoản, chạy thật trên MongoDB 8.0: localhost exception chỉ cho tạo đúng MỘT user đầu tiên và chỉ từ trong máy (qua cổng Docker thì không); user thuộc database nào thì authSource là database đó; vai trò có sẵn read/readWrite và cái bẫy readWrite vẫn drop được collection; vai trò tự định nghĩa chỉ find/insert/update/remove; view + vai trò để giấu email/số điện thoại khỏi bộ phận chăm sóc khách; mật khẩu sai và user không tồn tại trả CÙNG một thông báo nhưng log máy chủ ghi rõ; mật khẩu có ký tự @ : / phải mã hoá trong URI. Kèm SCRAM-SHA-256, keyFile/x.509 giữa các thành viên replica set, mỗi ứng dụng một tài khoản và đổi mật khẩu định kỳ.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Authentication, users, roles and least privilege</h2>
<p class="lead">Authentication answers "who are you?"; authorization answers "what may you do?". MongoDB ships with both turned off — the lab you have used since Lesson 0.2 accepts anyone who reaches 127.0.0.1:47017. This lesson starts a server with <code>--auth</code> and walks through the whole life of an account: the very first user, users per application, built-in roles and the trap inside <code>readWrite</code>, a custom role that can do exactly what the API needs, and the small details (authSource, special characters in passwords, error messages) that cost hours on a real project.</p>

<h3>An everyday picture: an office building with key cards</h3>
<p>The building has a front desk (authentication: show your card), and each card opens certain doors (authorization: roles). The janitor's card opens every floor but not the safe. The accountant's card opens the finance office and nothing else. A new building has no cards yet — so whoever is <em>physically inside</em> on day one may print exactly one master card, and after that the printer only works for card holders. That first card is MongoDB's <strong>localhost exception</strong>.</p>

<h3>1. The first user: the localhost exception</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>The server has <code>--auth</code> and no users. From the host, through the published port, even <code>createUser</code> is refused — the connection arrives from Docker's gateway address, not from localhost. From <em>inside</em> the container (a real localhost connection) you cannot even list users, but you may create the first one. The moment it exists the exception closes: a second <code>createUser</code> without logging in is refused. The docs put it plainly: connections using the localhost exception "have access to create only the first user OR role". Make that first user an administrator (<code>root</code> or <code>userAdminAnyDatabase</code>), then do everything else logged in as it.</p>
${nguon('📘', 'MongoDB Docs — Localhost Exception', 'create only the first user or role after enabling access control', 'https://www.mongodb.com/docs/manual/core/localhost-exception/')}

<h3>2. One account per application, with built-in roles</h3>
${ma('bash', URI)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
<p><code>ctshopApi</code> has <code>readWrite</code> on <code>ctshop</code>: it can insert an order, but cannot drop the database, list users, or write to any other database. <code>baoCao</code> (the reporting tool) has <code>read</code>: counts work, deletes are refused. <code>connectionStatus</code> tells any connection who it is and which roles it holds — the first thing to run when "not authorized" surprises you. Note the error text: <code>not authorized on ctshop to execute command { dropDatabase: 1 … }</code> — the server says exactly which action on which database was missing.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">read</span><span class="lz-t">find, aggregate, listCollections …</span><span class="lz-d">reports, BI tools, read-only dashboards</span></div>
  <div class="lz-step"><span class="lz-k">readWrite</span><span class="lz-t">read + insert, update, remove, createIndex, dropCollection …</span><span class="lz-d">convenient — and more than an API usually needs (section 4)</span></div>
  <div class="lz-step"><span class="lz-k">dbAdmin / dbOwner</span><span class="lz-t">schema, indexes, stats / everything on one database</span><span class="lz-d">migration jobs, not the running app</span></div>
  <div class="lz-step"><span class="lz-k">clusterMonitor · backup · restore</span><span class="lz-t">read metrics · mongodump · mongorestore</span><span class="lz-d">monitoring agent (Lesson 9.1's self-check), backup job (Chapter 10)</span></div>
  <div class="lz-step"><span class="lz-k">root · userAdminAnyDatabase</span><span class="lz-t">everything · manage all users</span><span class="lz-d">humans in an emergency; never in an application's connection string</span></div>
</div>
${nguon('📘', 'MongoDB Docs — Built-In Roles', 'read, readWrite, dbAdmin, dbOwner, userAdmin, clusterMonitor, backup, restore, root …', 'https://www.mongodb.com/docs/manual/reference/built-in-roles/')}

<h3>3. Hiding fields: a view plus a custom role</h3>
${lenh(K, 13)}
${lenh(K, 14)}
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
<p>MongoDB privileges are per <em>collection</em>, not per field. To let the customer-care team see names and cities but not emails and phone numbers, create a <strong>view</strong> that projects only the safe fields and grant <code>find</code> on the view, not on the collection. The custom role <code>chamSocKhach</code> also lets them update orders (add a note) but not delete them. Reading the base collection directly is refused.</p>
${nguon('📘', 'MongoDB Docs — User-Defined Roles', 'privileges = resource (db + collection) + actions; roles can inherit other roles', 'https://www.mongodb.com/docs/manual/core/security-user-defined-roles/')}

<h3>4. The readWrite trap — and a role made for the API</h3>
${lenh(K, 20)}
${lenh(K, 21)}
<p>With <code>readWrite</code>, the API account just dropped a collection and created an index. If an attacker gets that connection string — from a leaked <code>.env</code>, a log line, or NoSQL injection that runs commands (Lesson 9.3) — they can drop <code>orders</code> too. An API needs four actions: find, insert, update, remove.</p>
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
${lenh(K, 25)}
<p><code>collection: ''</code> means "every collection in ctshop". Now the same account still serves every request, and <code>drop</code> is refused. Indexes and collections are created by a migration job with a separate, more powerful account that runs during deploys (Lesson 8.3 turned <code>autoIndex</code> off for the same reason).</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — the root account in the app's .env.</strong> It is the most common shortcut on student and outsourcing projects: one <code>root</code> user created by <code>MONGO_INITDB_ROOT_USERNAME</code>, pasted into every service. Any bug in any service then has the power to drop every database and create new admin users. Create one account per application per environment (dev/staging/prod passwords different), with the smallest role that works.</p>
</div>

<h3>5. authSource, wrong passwords, and what the server logs</h3>
${lenh(K, 26)}
${lenh(K, 27)}
${lenh(K, 28)}
<p>A user lives in the database where it was created. <code>ctshopApi</code> was created in <code>ctshop</code>, so connecting with <code>authSource=admin</code> fails even with the right password. The client sees the same message for "no such user" and "wrong password" — on purpose, so attackers cannot test which emails/usernames exist. The server log tells you the truth: <code>UserNotFound … for db "admin"</code> versus <code>storedKey mismatch</code>, plus the client IP. When a deploy fails with "Authentication failed", read the server log before changing passwords.</p>
<p>The mechanism is <strong>SCRAM-SHA-256</strong> (Salted Challenge Response): the password never travels on the wire; client and server prove to each other that they know a salted hash. The server stores only derived keys, not the password. It still doesn't stop someone from <em>reading your data</em> on the wire after login — that is TLS (Lesson 9.4).</p>
${nguon('📘', 'MongoDB Docs — SCRAM', 'SCRAM-SHA-256 default; salted challenge-response; server stores derived keys', 'https://www.mongodb.com/docs/manual/core/security-scram/')}

<h3>6. Passwords with special characters</h3>
${lenh(K, 29)}
${lenh(K, 30)}
${lenh(K, 31)}
<p>A strong password often contains <code>@ : /</code>, which are delimiters in a URI. The driver read <code>Ab</code> as the password and <code>c:d</code> as the host. Percent-encode the username and password (<code>encodeURIComponent</code> in JS, <code>URLEncoder</code> in Java), or pass them as separate options instead of in the URI.</p>
${ma('js', ENV)}

<h3>7. Between servers: keyFile and x.509</h3>
<p>Once a replica set (Chapter 7) or sharded cluster has authorization, its <em>members</em> must also prove themselves to each other — otherwise anyone could start a mongod claiming to be a secondary and receive the oplog. Two options: a shared <strong>keyFile</strong> (the same random secret file on every member, permissions 400, started with <code>--keyFile</code>; enabling it also turns on authorization) or <strong>x.509 certificates</strong> per member (preferred in production, ties into TLS from Lesson 9.4). The Chapter 7 compose files run without either because they live on a private Docker network with no published ports — never copy them to a server as-is.</p>

<h3>🕵️ Attacker's view: what a stolen connection string is worth</h3>
<p>Leaked credentials are more common than clever exploits: <code>.env</code> committed to a public repo, a connection string printed in a startup log, a Docker image with credentials baked in. Attackers scan GitHub for <code>mongodb+srv://</code> continuously. What the string is worth depends on the role: with <code>root</code> it is the whole cluster; with the API role above, it is still all customer data, but no dropping and no new users — and the database stays reachable only from the private network, so the string alone is not enough. Defences: secrets outside the repo (CI variables, a secret manager), <code>git-secrets</code>/GitHub secret scanning, rotate immediately when a string leaks, one account per app so you can disable just one.</p>

<h3>💼 On the job</h3>
<p>Typical onboarding on an outsourcing project: you get read access to staging, and the lead asks you to "create a user for the new notification service". The answer that earns trust: a user in the service's own database, a custom role with only the collections and actions it uses, a password generated by <code>openssl rand -base64 24</code> stored in the secret manager, the same request repeated for prod by someone with prod access, and a line in the README describing the role. If the client's security team audits, <code>db.getUsers({ showPrivileges: true })</code> is the evidence.</p>

<h3>🎤 What an interviewer will ask</h3>
<ol>
<li><strong>"What is the localhost exception and when does it close?"</strong> — With auth on and no users, a connection from localhost may create the first user or role; it closes as soon as one exists. Through a Docker-published port the connection isn't localhost.</li>
<li><strong>"Which role do you give the backend API?"</strong> — Not root, not dbOwner, ideally not even readWrite: a custom role with find/insert/update/remove on its own database; schema changes run with a separate migration account.</li>
<li><strong>"How do you restrict a team from seeing phone numbers?"</strong> — Privileges are per collection; expose a view that projects safe fields and grant find on the view only. For stronger guarantees, encrypt the field client-side (Lesson 9.4).</li>
<li><strong>"Connection fails with 'Authentication failed' after a deploy. Your steps?"</strong> — Check authSource matches the user's database, URL-encoding of the password, the right environment's secret; read the server log, which distinguishes UserNotFound from storedKey mismatch.</li>
</ol>

<h3>🧪 Practice (40 minutes)</h3>
<div class="callout ok"><ol>
<li>Start your own <code>--auth</code> container (copy section 1). Create the first admin from inside, then users <code>ctshopApi</code> (custom role) and <code>baoCao</code> (read). Prove with five commands what each can and cannot do.</li>
<li>Create the user <code>giaoHang</code> for the delivery app: it may read orders of status SHIPPED but only the fields <code>_id, address, phone, items</code>, and may set <code>status</code>. Which objects do you need?</li>
<li>Your company's password policy generates <code>P@ss:w0rd/#1</code>. Write the URI for user <code>app</code> on <code>db.noi-bo:27017/ctshop</code>.</li>
</ol>
${loiGiai('Suggested answers', `<p>1. Proof table: ctshopApi insert ✔ / drop ✘ (Unauthorized) / getUsers ✘; baoCao find ✔ / deleteMany ✘; connectionStatus shows the role for each.</p>
<p>2. A view <code>donGiao</code> on <code>orders</code> with <code>[{ $match: { status: 'SHIPPED' } }, { $project: { address: 1, phone: 1, items: 1 } }]</code>; a role with <code>find</code> on the view and <code>update</code> on <code>orders</code>. Views are read-only, so updates go to the collection — the API must filter by <code>status: 'SHIPPED'</code> itself, and update only <code>status</code> (restricting which <em>field</em> may be updated is the application's job; MongoDB roles cannot express it).</p>
<p>3. <code>encodeURIComponent('P@ss:w0rd/#1')</code> = <code>P%40ss%3Aw0rd%2F%231</code> ⇒ <code>mongodb://app:P%40ss%3Aw0rd%2F%231@db.noi-bo:27017/ctshop</code>.</p>`)}
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['Authentication / Authorization', 'Proving who you are / what you are allowed to do. Off by default; --auth or security.authorization: enabled.'],
  ['Localhost exception', 'With auth on and no users, a localhost connection may create the first user or role only.'],
  ['authSource', 'The database that holds the user. Defaults to the database in the URI path.'],
  ['Role / privilege', 'A role is a set of privileges; a privilege = resource (db, collection) + actions.'],
  ['Least privilege', 'Each account gets the minimum actions it needs; separate accounts for app, migration, backup, humans.'],
  ['SCRAM-SHA-256', 'Default password mechanism: challenge-response with salted hashes, password never sent.'],
  ['keyFile / x.509', 'How replica set and shard members authenticate to each other.'],
])}
<h3>📌 Summary</h3>
<ul>
<li>--auth + first admin via the localhost exception (from inside the machine), then log in for everything else.</li>
<li>One account per application per environment; root never in an application.</li>
<li>readWrite can drop collections and build indexes — a custom role with find/insert/update/remove is safer.</li>
<li>Field-level hiding = view + find on the view.</li>
<li>authSource = the user's database; percent-encode passwords; read the server log on auth failures.</li>
<li>Replica set members authenticate with keyFile or x.509.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Xác thực, người dùng, vai trò và quyền tối thiểu</h2>
<p class="lead">Xác thực (authentication) trả lời câu "bạn là ai?", còn phân quyền (authorization) trả lời câu "bạn được làm gì?". MongoDB mặc định tắt cả hai. Lab bạn dùng từ Bài 0.2 nhận bất kỳ ai tới được 127.0.0.1:47017. Bài này khởi động một máy chủ có <code>--auth</code> và đi hết vòng đời của một tài khoản: user đầu tiên, mỗi ứng dụng một user, các vai trò có sẵn cùng cái bẫy nằm trong <code>readWrite</code>, một vai trò tự định nghĩa làm đúng những gì API cần, và những chi tiết nhỏ (authSource, ký tự đặc biệt trong mật khẩu, thông báo lỗi) từng làm mất cả buổi ở dự án thật.</p>

<h3>Hình ảnh đời thường: toà văn phòng dùng thẻ từ</h3>
<p>Toà nhà có quầy lễ tân (xác thực: trình thẻ) và mỗi thẻ mở được một số cửa (phân quyền: vai trò). Thẻ của cô lao công mở mọi tầng nhưng không mở két sắt. Thẻ kế toán chỉ mở phòng tài chính. Toà nhà mới xây thì chưa có thẻ nào. Nên ai <em>đang đứng bên trong</em> vào ngày đầu được in đúng một thẻ tổng, và từ đó máy in thẻ chỉ chạy cho người đã có thẻ. Tấm thẻ đầu tiên ấy chính là <strong>localhost exception</strong> của MongoDB.</p>

<h3>1. User đầu tiên: localhost exception</h3>
${lenh(K, 0)}
${lenh(K, 1)}
${lenh(K, 2)}
${lenh(K, 3)}
<p>Máy chủ có <code>--auth</code> và chưa có user nào. Từ máy host, đi qua cổng Docker, đến <code>createUser</code> cũng bị từ chối, vì kết nối tới từ địa chỉ gateway của Docker chứ không phải localhost. Từ <em>bên trong</em> container (kết nối localhost thật), bạn không xem được danh sách user, nhưng được tạo user đầu tiên. Ngay khi user đó tồn tại, ngoại lệ đóng lại: lệnh <code>createUser</code> thứ hai mà chưa đăng nhập sẽ bị từ chối. Tài liệu ghi rõ: kết nối dùng localhost exception "chỉ được tạo user đầu tiên HOẶC role đầu tiên". Hãy để user đầu tiên là quản trị (<code>root</code> hoặc <code>userAdminAnyDatabase</code>), rồi đăng nhập bằng nó để làm mọi việc còn lại.</p>
${nguon('📘', 'MongoDB Docs — Localhost Exception', 'chỉ tạo được user hoặc role đầu tiên sau khi bật kiểm soát truy cập', 'https://www.mongodb.com/docs/manual/core/localhost-exception/')}

<h3>2. Mỗi ứng dụng một tài khoản, dùng vai trò có sẵn</h3>
${ma('bash', URI)}
${lenh(K, 4)}
${lenh(K, 5)}
${lenh(K, 6)}
${lenh(K, 7)}
${lenh(K, 8)}
${lenh(K, 9)}
${lenh(K, 10)}
${lenh(K, 11)}
${lenh(K, 12)}
<p><code>ctshopApi</code> có <code>readWrite</code> trên <code>ctshop</code>: chèn được đơn, nhưng không xoá được database, không xem được danh sách user, không ghi được vào database khác. <code>baoCao</code> (công cụ báo cáo) có <code>read</code>: đếm được, xoá thì bị từ chối. <code>connectionStatus</code> cho mọi kết nối biết mình là ai và đang giữ vai trò gì. Đó là lệnh đầu tiên nên chạy khi bất ngờ gặp "not authorized". Để ý câu báo lỗi: <code>not authorized on ctshop to execute command { dropDatabase: 1 … }</code>. Máy chủ nói chính xác thiếu hành động nào trên database nào.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">read</span><span class="lz-t">find, aggregate, listCollections …</span><span class="lz-d">báo cáo, công cụ BI, bảng điều khiển chỉ đọc</span></div>
  <div class="lz-step"><span class="lz-k">readWrite</span><span class="lz-t">read + insert, update, remove, createIndex, dropCollection …</span><span class="lz-d">tiện — nhưng nhiều hơn API thường cần (mục 4)</span></div>
  <div class="lz-step"><span class="lz-k">dbAdmin / dbOwner</span><span class="lz-t">schema, index, thống kê / mọi thứ trên một database</span><span class="lz-d">cho tác vụ di trú, không cho ứng dụng đang chạy</span></div>
  <div class="lz-step"><span class="lz-k">clusterMonitor · backup · restore</span><span class="lz-t">đọc chỉ số · mongodump · mongorestore</span><span class="lz-d">tác tử giám sát (script tự kiểm Bài 9.1), tác vụ sao lưu (Chương 10)</span></div>
  <div class="lz-step"><span class="lz-k">root · userAdminAnyDatabase</span><span class="lz-t">mọi thứ · quản lý mọi user</span><span class="lz-d">cho con người khi khẩn cấp; không bao giờ nằm trong chuỗi kết nối của ứng dụng</span></div>
</div>
${nguon('📘', 'MongoDB Docs — Built-In Roles', 'read, readWrite, dbAdmin, dbOwner, userAdmin, clusterMonitor, backup, restore, root …', 'https://www.mongodb.com/docs/manual/reference/built-in-roles/')}

<h3>3. Giấu trường: view cộng vai trò tự định nghĩa</h3>
${lenh(K, 13)}
${lenh(K, 14)}
${lenh(K, 15)}
${lenh(K, 16)}
${lenh(K, 17)}
${lenh(K, 18)}
${lenh(K, 19)}
<p>Quyền trong MongoDB tính theo <em>collection</em>, không theo trường. Muốn bộ phận chăm sóc khách xem được tên và thành phố nhưng không thấy email, số điện thoại, ta tạo một <strong>view</strong> chỉ chiếu các trường an toàn. Rồi cấp <code>find</code> trên view, không cấp trên collection gốc. Vai trò tự định nghĩa <code>chamSocKhach</code> còn cho sửa đơn (thêm ghi chú) nhưng không cho xoá. Đọc thẳng collection gốc thì bị từ chối.</p>
${nguon('📘', 'MongoDB Docs — User-Defined Roles', 'quyền = tài nguyên (db + collection) + hành động; role kế thừa được role khác', 'https://www.mongodb.com/docs/manual/core/security-user-defined-roles/')}

<h3>4. Bẫy readWrite — và một vai trò may đo cho API</h3>
${lenh(K, 20)}
${lenh(K, 21)}
<p>Với <code>readWrite</code>, tài khoản của API vừa xoá được một collection và tạo được index. Nếu kẻ xấu có được chuỗi kết nối đó, chúng cũng drop được <code>orders</code>. Chuỗi kết nối có thể lộ từ tệp <code>.env</code>, một dòng log, hoặc một lỗ NoSQL injection chạy được lệnh (Bài 9.3). API chỉ cần bốn hành động: find, insert, update, remove.</p>
${lenh(K, 22)}
${lenh(K, 23)}
${lenh(K, 24)}
${lenh(K, 25)}
<p><code>collection: ''</code> nghĩa là "mọi collection trong ctshop". Giờ vẫn tài khoản đó phục vụ đủ mọi request, còn <code>drop</code> thì bị từ chối. Index và collection do một tác vụ di trú tạo ra, chạy lúc triển khai bằng một tài khoản riêng mạnh hơn (Bài 8.3 tắt <code>autoIndex</code> cũng vì lý do này).</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — tài khoản root nằm trong .env của ứng dụng.</strong> Đây là đường tắt phổ biến nhất ở dự án sinh viên lẫn dự án outsourcing: một user <code>root</code> tạo bằng <code>MONGO_INITDB_ROOT_USERNAME</code>, rồi dán vào mọi service. Khi đó lỗi ở bất kỳ service nào cũng đủ quyền xoá mọi database và tạo user quản trị mới. Hãy tạo mỗi ứng dụng một tài khoản cho từng môi trường (mật khẩu dev, staging, prod khác nhau), với vai trò nhỏ nhất mà vẫn chạy được.</p>
</div>

<h3>5. authSource, sai mật khẩu, và máy chủ ghi log gì</h3>
${lenh(K, 26)}
${lenh(K, 27)}
${lenh(K, 28)}
<p>User thuộc về database nơi nó được tạo. <code>ctshopApi</code> được tạo trong <code>ctshop</code>, nên nối với <code>authSource=admin</code> sẽ thất bại dù mật khẩu đúng. Client nhận cùng một câu báo cho "không có user này" và "sai mật khẩu". Đó là cố ý, để kẻ tấn công không dò được email hay tên đăng nhập nào có thật. Log máy chủ mới nói sự thật: <code>UserNotFound … for db "admin"</code> khác với <code>storedKey mismatch</code>, kèm IP của client. Khi một lần triển khai hỏng vì "Authentication failed", hãy đọc log máy chủ trước khi đổi mật khẩu.</p>
<p>Cơ chế xác thực là <strong>SCRAM-SHA-256</strong> (Salted Challenge Response). Mật khẩu không bao giờ đi trên dây mạng: client và máy chủ chứng minh cho nhau thấy mình biết một giá trị băm có muối. Máy chủ chỉ lưu các khoá suy ra, không lưu mật khẩu. Nhưng SCRAM không ngăn ai đó <em>đọc dữ liệu</em> trên đường truyền sau khi đăng nhập xong. Việc đó cần TLS (Bài 9.4).</p>
${nguon('📘', 'MongoDB Docs — SCRAM', 'SCRAM-SHA-256 mặc định; hỏi–đáp có muối; máy chủ lưu khoá suy ra', 'https://www.mongodb.com/docs/manual/core/security-scram/')}

<h3>6. Mật khẩu có ký tự đặc biệt</h3>
${lenh(K, 29)}
${lenh(K, 30)}
${lenh(K, 31)}
<p>Mật khẩu mạnh hay chứa <code>@ : /</code>, mà đây lại là các ký tự phân cách trong URI. Driver đọc <code>Ab</code> là mật khẩu, còn <code>c:d</code> là tên máy. Hãy mã hoá phần trăm (percent-encode) tên đăng nhập và mật khẩu (<code>encodeURIComponent</code> trong JS, <code>URLEncoder</code> trong Java), hoặc truyền chúng qua tuỳ chọn riêng thay vì nhét vào URI.</p>
${ma('js', ENV)}

<h3>7. Giữa các máy chủ với nhau: keyFile và x.509</h3>
<p>Khi replica set (Chương 7) hay cụm shard đã bật phân quyền, các <em>thành viên</em> cũng phải chứng minh danh tính với nhau. Nếu không, ai cũng có thể dựng một mongod tự xưng là secondary và nhận oplog. Có hai cách. Một là <strong>keyFile</strong> dùng chung: cùng một tệp bí mật ngẫu nhiên trên mọi thành viên, quyền 400, khởi động với <code>--keyFile</code>; bật keyFile cũng bật luôn phân quyền. Hai là <strong>chứng chỉ x.509</strong> riêng cho từng thành viên, nên dùng ở production và gắn với TLS của Bài 9.4. Các tệp compose ở Chương 7 không dùng cách nào, vì chúng nằm trong mạng Docker riêng và không xuất cổng. Đừng bao giờ chép nguyên chúng lên máy chủ thật.</p>

<h3>🕵️ Góc hacker: một chuỗi kết nối bị lộ đáng giá bao nhiêu</h3>
<p>Lộ thông tin đăng nhập phổ biến hơn nhiều so với các kỹ thuật khai thác tinh vi. Thường gặp: tệp <code>.env</code> bị commit lên repo công khai, chuỗi kết nối in ra trong log khởi động, ảnh Docker đóng gói sẵn mật khẩu. Kẻ xấu quét GitHub tìm <code>mongodb+srv://</code> liên tục. Chuỗi kết nối đáng giá bao nhiêu tuỳ vai trò của nó. Với <code>root</code> thì đó là cả cụm. Với vai trò API ở trên thì vẫn lộ toàn bộ dữ liệu khách, nhưng không xoá được gì, không tạo được user. Thêm nữa database chỉ tới được từ mạng riêng, nên có chuỗi thôi là chưa đủ. Cách phòng: để bí mật ngoài repo (biến của CI, trình quản lý bí mật), bật <code>git-secrets</code> hoặc GitHub secret scanning, đổi mật khẩu ngay khi chuỗi bị lộ, và mỗi ứng dụng một tài khoản để khi cần chỉ khoá đúng một cái.</p>

<h3>💼 Đi làm</h3>
<p>Một buổi nhận việc điển hình ở dự án outsourcing: bạn được quyền đọc staging, và trưởng nhóm nhờ "tạo user cho service thông báo mới". Câu trả lời khiến người ta tin tưởng gồm: một user trong database riêng của service; một vai trò tự định nghĩa chỉ có đúng các collection và hành động service dùng; mật khẩu sinh bằng <code>openssl rand -base64 24</code> và cất trong trình quản lý bí mật; yêu cầu tương tự cho prod gửi tới người có quyền prod; và một dòng trong README mô tả vai trò đó. Khi đội bảo mật của khách hàng kiểm tra, <code>db.getUsers({ showPrivileges: true })</code> chính là bằng chứng.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Localhost exception là gì và khi nào nó đóng?"</strong> — Khi đã bật auth mà chưa có user, kết nối từ localhost được tạo user hoặc role đầu tiên; có một cái là ngoại lệ đóng. Đi qua cổng Docker thì kết nối không phải localhost.</li>
<li><strong>"Bạn cấp vai trò gì cho backend API?"</strong> — Không phải root, không phải dbOwner, tốt nhất cũng không phải readWrite. Dùng vai trò tự định nghĩa có find/insert/update/remove trên database của nó; đổi schema thì chạy bằng tài khoản di trú riêng.</li>
<li><strong>"Làm sao để một nhóm không xem được số điện thoại?"</strong> — Quyền tính theo collection; tạo view chỉ chiếu trường an toàn và chỉ cấp find trên view. Muốn chắc hơn thì mã hoá trường đó ở phía client (Bài 9.4).</li>
<li><strong>"Sau khi triển khai, kết nối báo 'Authentication failed'. Bạn làm gì?"</strong> — Kiểm authSource có đúng database của user không, mật khẩu đã mã hoá URL chưa, có lấy đúng bí mật của môi trường không; đọc log máy chủ, nơi phân biệt UserNotFound với storedKey mismatch.</li>
</ol>

<h3>🧪 Thực hành (40 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng một container <code>--auth</code> của riêng bạn (chép mục 1). Tạo admin đầu tiên từ bên trong, rồi tạo user <code>ctshopApi</code> (vai trò tự định nghĩa) và <code>baoCao</code> (read). Chứng minh bằng năm câu lệnh mỗi user làm được gì và không làm được gì.</li>
<li>Tạo user <code>giaoHang</code> cho ứng dụng giao hàng: được đọc đơn có trạng thái SHIPPED nhưng chỉ các trường <code>_id, address, phone, items</code>, và được đặt lại <code>status</code>. Bạn cần những đối tượng nào?</li>
<li>Chính sách mật khẩu công ty sinh ra <code>P@ss:w0rd/#1</code>. Viết URI cho user <code>app</code> tới <code>db.noi-bo:27017/ctshop</code>.</li>
</ol>
${loiGiai('Gợi ý đáp án', `<p>1. Bảng chứng minh: ctshopApi insert ✔ / drop ✘ (Unauthorized) / getUsers ✘; baoCao find ✔ / deleteMany ✘; connectionStatus cho thấy vai trò của từng user.</p>
<p>2. Một view <code>donGiao</code> trên <code>orders</code> với <code>[{ $match: { status: 'SHIPPED' } }, { $project: { address: 1, phone: 1, items: 1 } }]</code>, và một vai trò có <code>find</code> trên view cùng <code>update</code> trên <code>orders</code>. View chỉ đọc được, nên lệnh sửa phải đi vào collection gốc. Vì vậy API phải tự lọc <code>status: 'SHIPPED'</code> và chỉ sửa <code>status</code>. Giới hạn <em>trường</em> nào được sửa là việc của ứng dụng, vai trò MongoDB không diễn đạt được điều đó.</p>
<p>3. <code>encodeURIComponent('P@ss:w0rd/#1')</code> = <code>P%40ss%3Aw0rd%2F%231</code> ⇒ <code>mongodb://app:P%40ss%3Aw0rd%2F%231@db.noi-bo:27017/ctshop</code>.</p>`)}
</div>

<h3>🗂 Thuật ngữ</h3>
${kv([
  ['Xác thực / Phân quyền', 'Chứng minh mình là ai / được phép làm gì. Mặc định tắt; bật bằng --auth hoặc security.authorization: enabled.'],
  ['Localhost exception', 'Khi đã bật auth mà chưa có user, kết nối localhost chỉ được tạo user hoặc role đầu tiên.'],
  ['authSource', 'Database chứa user. Mặc định là database trong đường dẫn của URI.'],
  ['Vai trò / quyền', 'Vai trò là tập quyền; một quyền = tài nguyên (db, collection) + các hành động.'],
  ['Quyền tối thiểu', 'Mỗi tài khoản chỉ có những hành động nó cần; tách tài khoản cho ứng dụng, di trú, sao lưu, con người.'],
  ['SCRAM-SHA-256', 'Cơ chế mật khẩu mặc định: hỏi–đáp bằng giá trị băm có muối, mật khẩu không gửi đi.'],
  ['keyFile / x.509', 'Cách các thành viên replica set và shard xác thực lẫn nhau.'],
])}
<h3>📌 Tóm tắt</h3>
<ul>
<li>Bật --auth, tạo admin đầu tiên qua localhost exception (từ bên trong máy), rồi đăng nhập để làm mọi việc khác.</li>
<li>Mỗi ứng dụng một tài khoản cho từng môi trường; root không bao giờ nằm trong ứng dụng.</li>
<li>readWrite xoá được collection và dựng được index; vai trò tự định nghĩa find/insert/update/remove an toàn hơn.</li>
<li>Giấu trường = view + quyền find trên view.</li>
<li>authSource = database của user; mã hoá phần trăm mật khẩu; đọc log máy chủ khi xác thực lỗi.</li>
<li>Các thành viên replica set xác thực nhau bằng keyFile hoặc x.509.</li>
</ul>
</div>
`,
};
