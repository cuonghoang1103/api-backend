/**
 * 7.4 — Quyền theo chủ sở hữu: chặn IDOR, và CASL cho luật chi tiết (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Nest 12.6.0, @casl/ability 7.1.3; Vitest 4.1.12): scratchpad/nst/lab/c7/app/src/b74 — so-huu.ts CACH=ngay-tho
 * (9/9 request 200: xem/huỷ lịch người khác, duyệt phòng không phải của mình), CACH=where (chặn IDOR nhưng sót: huỷ lịch đã duyệt 200, admin 404),
 * CACH=casl (đúng cả 9, 403 "Lịch đã huỷ rồi"); policy.spec.ts 15 ca xanh.
 * Sự cố: First American Financial 2019 (~885 triệu hồ sơ qua URL đoán được) — KrebsOnSecurity 24/05/2019, SEC 15/06/2021 phạt 487.616 USD.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'authentication', bai: 'auth-9-3-abac-rebac', title: 'Authentication 9.3 — Thuộc tính và quan hệ', sub: 'ABAC, ReBAC: phần phân quyền mà RBAC không diễn đạt nổi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'authentication', bai: 'auth-9-4-nhieu-tenant', title: 'Authentication 9.4 — Nhiều tenant', sub: 'Cùng ý "lọc theo chủ" nhưng ở cấp tổ chức.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-3-3-pipe', title: 'NestJS 3.3 — Pipe', sub: 'Pipe chuyển id thành bản ghi — và cảnh báo BOLA khi pipe không biết ai đang gọi.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'KrebsOnSecurity — First American Financial Corp. leaked hundreds of millions of title insurance records (24/05/2019)', '~885 triệu tài liệu từ 2003, đọc được chỉ bằng cách đổi số trong URL.', 'https://krebsonsecurity.com/2019/05/first-american-financial-corp-leaked-hundreds-of-millions-of-title-insurance-records/'),
  nguon('🕵️', 'KrebsOnSecurity — First American Financial pays farcical $500K fine (18/06/2021)', 'SEC phạt 487.616 USD; nội bộ đã biết lỗ hổng từ 01/2019.', 'https://krebsonsecurity.com/2021/06/first-american-financial-pays-farcical-500k-fine/'),
  nguon('📘', 'OWASP API Security Top 10 2023 — API1: Broken Object Level Authorization', 'Lỗi số 1 của API: không kiểm người gọi có quyền với ĐÚNG bản ghi đó.', 'https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/'),
  nguon('📘', 'CASL — tài liệu chính thức', 'AbilityBuilder, can/cannot với điều kiện kiểu MongoDB, because(), subject().', 'https://casl.js.org/'),
].join('\n');
const MA_SVC = "@Injectable()\nclass BookingsService {\n  readonly ds: Booking[] = [\n    { id: 101, ownerId: 3, roomId: 1, status: 'PENDING', phone: '0912 000 003' },\n    { id: 102, ownerId: 4, roomId: 1, status: 'PENDING', phone: '0912 000 004' },\n    { id: 103, ownerId: 4, roomId: 2, status: 'APPROVED', phone: '0912 000 004' },\n  ];\n  private find(id: number) { const b = this.ds.find((x) => x.id === id); if (!b) throw new NotFoundException(); return b; }\n\n  // ✗ cách 1 (CACH=ngay-tho): chỉ biết \"đã đăng nhập\"\n  // ✓ cách 2 (CACH=where):   lọc theo chủ ngay trong truy vấn ⇒ không phải của bạn = 404\n  // ✓ cách 3 (CACH=casl):    luật CASL, nói được vì sao bị từ chối\n  get(u: User, id: number) {\n    const b = this.find(id);\n    if (CACH === 'where' && u.role === 'student' && b.ownerId !== u.id) throw new NotFoundException();\n    if (CACH === 'casl') this.kiem(u, 'read', b);\n    return b;\n  }\n  cancel(u: User, id: number) {\n    const b = this.find(id);\n    if (CACH === 'where' && b.ownerId !== u.id) throw new NotFoundException();\n    if (CACH === 'casl') this.kiem(u, 'cancel', b);\n    b.status = 'CANCELLED'; return b;\n  }\n  approve(u: User, id: number) {\n    const b = this.find(id);\n    if (CACH === 'where' && !(u.role === 'lecturer' && ROOMS.some((r) => r.id === b.roomId && r.managerId === u.id))) throw new NotFoundException();\n    if (CACH === 'casl') this.kiem(u, 'approve', b);\n    b.status = 'APPROVED'; return b;\n  }\n  list(u: User, studentId?: number) {\n    if (CACH === 'ngay-tho') return this.ds.filter((b) => !studentId || b.ownerId === studentId);   // tin tham số của client\n    if (CACH === 'where') return this.ds.filter((b) => u.role !== 'student' || b.ownerId === u.id);    // bỏ qua studentId của sinh viên\n    const a = abilityFor(u);\n    return this.ds.filter((b) => a.can('read', subject('Booking', b)));                               // chỉ trả thứ được đọc\n  }\n  private kiem(u: User, act: 'read' | 'cancel' | 'approve', b: Booking) {\n    const a = abilityFor(u);\n    if (a.can(act, subject('Booking', b))) return;\n    if (act !== 'read' && a.can('read', subject('Booking', b))) {\n      const ly = a.relevantRuleFor(act, subject('Booking', b))?.reason;\n      throw new ForbiddenException(ly ?? `Không được ${act} lịch này`);                                // thấy được ⇒ 403 có lý do\n    }\n    throw new NotFoundException();                                                                     // không được thấy ⇒ 404\n  }\n}";
const MA_POL = "import { AbilityBuilder, createMongoAbility, type MongoAbility } from '@casl/ability';\n\nexport type User = { id: number; role: 'student' | 'lecturer' | 'admin' };\nexport type Booking = { id: number; ownerId: number; roomId: number; status: 'PENDING' | 'APPROVED' | 'CANCELLED'; phone: string };\nexport const ROOMS = [{ id: 1, managerId: 20 }, { id: 2, managerId: 21 }];   // giảng viên #20 quản lý phòng 1\n\n// —— luật quyền viết MỘT chỗ, bằng CASL ——\nexport type Ability = MongoAbility<[ 'read' | 'cancel' | 'approve' | 'manage', 'Booking' | (Booking & { __caslSubjectType__?: 'Booking' }) | 'all' ]>;\nexport function abilityFor(u: User): Ability {\n  const { can, cannot, build } = new AbilityBuilder<Ability>(createMongoAbility);\n  if (u.role === 'admin') can('manage', 'all');\n  if (u.role === 'student') {\n    can('read', 'Booking', { ownerId: u.id });\n    can('cancel', 'Booking', { ownerId: u.id, status: 'PENDING' });       // đã duyệt thì sinh viên không tự huỷ\n  }\n  if (u.role === 'lecturer') {\n    const phong = ROOMS.filter((r) => r.managerId === u.id).map((r) => r.id);\n    can('read', 'Booking', { roomId: { $in: phong } });\n    can('approve', 'Booking', { roomId: { $in: phong }, status: 'PENDING' });\n  }\n  cannot('cancel', 'Booking', { status: 'CANCELLED' }).because('Lịch đã huỷ rồi');\n  return build();\n}";
const OUT = "$ CACH=ngay-tho node dist/b74/so-huu.js\ntk-an    GET /bookings/102           → 200 #102 chủ 4 PENDING 0912 000 004\ntk-an    GET /bookings?studentId=4   → 200 [#102 chủ 4 PENDING 0912 000 004 | #103 chủ 4 APPROVED 0912 000 004]\ntk-an    DELETE /bookings/102        → 200 #102 chủ 4 CANCELLED 0912 000 004\ntk-an    DELETE /bookings/101        → 200 #101 chủ 3 CANCELLED 0912 000 003\ntk-an    DELETE /bookings/101        → 200 #101 chủ 3 CANCELLED 0912 000 003\ntk-binh  DELETE /bookings/103        → 200 #103 chủ 4 CANCELLED 0912 000 004\ntk-gv20  PATCH /bookings/103/approve → 200 #103 chủ 4 APPROVED 0912 000 004\ntk-an    PATCH /bookings/101/approve → 200 #101 chủ 3 APPROVED 0912 000 003\ntk-admin DELETE /bookings/103        → 200 #103 chủ 4 CANCELLED 0912 000 004\n$ CACH=where node dist/b74/so-huu.js\ntk-an    GET /bookings/102           → 404 Not Found\ntk-an    GET /bookings?studentId=4   → 200 [#101 chủ 3 PENDING 0912 000 003]\ntk-an    DELETE /bookings/102        → 404 Not Found\ntk-an    DELETE /bookings/101        → 200 #101 chủ 3 CANCELLED 0912 000 003\ntk-an    DELETE /bookings/101        → 200 #101 chủ 3 CANCELLED 0912 000 003\ntk-binh  DELETE /bookings/103        → 200 #103 chủ 4 CANCELLED 0912 000 004\ntk-gv20  PATCH /bookings/103/approve → 404 Not Found\ntk-an    PATCH /bookings/101/approve → 404 Not Found\ntk-admin DELETE /bookings/103        → 404 Not Found\n$ CACH=casl node dist/b74/so-huu.js\ntk-an    GET /bookings/102           → 404 Not Found\ntk-an    GET /bookings?studentId=4   → 200 [#101 chủ 3 PENDING 0912 000 003]\ntk-an    DELETE /bookings/102        → 404 Not Found\ntk-an    DELETE /bookings/101        → 200 #101 chủ 3 CANCELLED 0912 000 003\ntk-an    DELETE /bookings/101        → 403 Lịch đã huỷ rồi\ntk-binh  DELETE /bookings/103        → 403 Không được cancel lịch này\ntk-gv20  PATCH /bookings/103/approve → 404 Not Found\ntk-an    PATCH /bookings/101/approve → 403 Không được approve lịch này\ntk-admin DELETE /bookings/103        → 200 #103 chủ 4 CANCELLED 0912 000 004";
const MA_SPEC = "// Bài tập 7.4: test luật quyền như một hàm thuần — không cần HTTP, không cần DB\nimport { subject } from '@casl/ability';\nimport { abilityFor, type Booking, type User } from './policy.js';\n\nconst an: User = { id: 3, role: 'student' }, gv20: User = { id: 20, role: 'lecturer' }, admin: User = { id: 1, role: 'admin' };\nconst lich = (o: Partial<Booking>): Booking => ({ id: 1, ownerId: 3, roomId: 1, status: 'PENDING', phone: '-', ...o });\nconst BANG: [User, 'read' | 'cancel' | 'approve', Partial<Booking>, boolean][] = [\n  [an, 'read', {}, true], [an, 'read', { ownerId: 4 }, false],\n  [an, 'cancel', {}, true], [an, 'cancel', { status: 'APPROVED' }, false], [an, 'cancel', { status: 'CANCELLED' }, false], [an, 'cancel', { ownerId: 4 }, false],\n  [an, 'approve', {}, false],\n  [gv20, 'read', { roomId: 1, ownerId: 9 }, true], [gv20, 'read', { roomId: 2 }, false],\n  [gv20, 'approve', { roomId: 1 }, true], [gv20, 'approve', { roomId: 2 }, false], [gv20, 'approve', { status: 'APPROVED' }, false], [gv20, 'cancel', {}, false],\n  [admin, 'cancel', { ownerId: 4, status: 'APPROVED' }, true], [admin, 'cancel', { status: 'CANCELLED' }, false],\n];\ndescribe('ma trận quyền Booking', () => {\n  it.each(BANG.map(([u, a, o, dung]) => [`${u.role}#${u.id} ${a} ${JSON.stringify(o)} ⇒ ${dung}`, u, a, o, dung] as const))('%s', (_, u, a, o, dung) => {\n    expect(abilityFor(u).can(a, subject('Booking', lich(o)))).toBe(dung);\n  });\n});";
const OUT_BT = "$ npx vitest run src/b74 --reporter=verbose\n RUN  v4.1.12 /home/sv/app\n ✓ src/b74/policy.spec.ts > ma trận quyền Booking > student#3 read {} ⇒ true 3ms\n ✓ src/b74/policy.spec.ts > ma trận quyền Booking > student#3 read {\"ownerId\":4} ⇒ false 0ms\n ✓ src/b74/policy.spec.ts > ma trận quyền Booking > student#3 cancel {} ⇒ true 1ms\n ✓ src/b74/policy.spec.ts > ma trận quyền Booking > student#3 cancel {\"status\":\"APPROVED\"} ⇒ false 0ms\n … (10 ca ✓ khác — sinh viên huỷ/duyệt, giảng viên phòng 1/phòng 2, admin huỷ lịch đã duyệt)\n ✓ src/b74/policy.spec.ts > ma trận quyền Booking > admin#1 cancel {\"status\":\"CANCELLED\"} ⇒ false 0ms\n Test Files  1 passed (1)\n      Tests  15 passed (15)\n   Start at  07:22:11\n   Duration  348ms (transform 70ms, setup 0ms, import 91ms, tests 9ms, environment 0ms)";

export default {
  title: '7.4 — Ownership and policies: stopping IDOR, and CASL for fine-grained rules|||7.4 — Quyền theo chủ sở hữu: chặn IDOR, và CASL cho luật chi tiết',
  slug: 'nst-7-4-so-huu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Vai trò trả lời "sinh viên được huỷ lịch không?", không trả lời "lịch NÀY có phải của bạn không?". Chạy thật ba cách cho cùng 9 request: ngây thơ thì An xem, huỷ lịch của Bình và tự duyệt lịch mình (9/9 lọt 200); tự viết điều kiện where thì chặn được IDOR nhưng sót hai luật; luật CASL viết một chỗ thì đúng cả 9 và nói được lý do. Kèm sự cố First American 2019 — 885 triệu hồ sơ lộ chỉ vì đổi một con số trên URL — và test ma trận quyền 15 ca.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>7.4 — The question roles cannot answer: is this record yours?</h2>
<p class="lead">After lesson 7.3, a student may call <code>DELETE /bookings/:id</code>. That is the role rule. It says nothing about <em>which</em> booking. If the handler cancels whatever id arrives, any student cancels anyone's booking by changing a number. This is IDOR (insecure direct object reference), called <strong>BOLA</strong> by OWASP — number one in the API Security Top 10 2023. Guards see the route; only code that has loaded the record can see its owner.</p>

<h3>Everyday analogy: the coat check</h3>
<p>The coat check gives you ticket number 102. A badly run counter hands over coat 102 to whoever says "102" — so you say "103" and leave with a better coat. A good one checks that the ticket in your hand is the one they gave you. Your API's <code>:id</code> is the number you say aloud; the JWT is the ticket in your hand.</p>

<h3>The setup: three bookings, four people</h3>
<p>Student An (#3) owns booking 101; student Bình (#4) owns 102 (room 1) and 103 (room 2, already approved). Lecturer #20 manages room 1 only. Each booking holds a phone number — the data that leaks. The same nine requests are sent to three implementations of the service:</p>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<div class="out">${esc(OUT)}</div>

<h3>Reading the three runs</h3>
<ul>
<li><strong>Naive</strong> — 9/9 succeed. An reads Bình's booking and phone, lists all of Bình's bookings with <code>?studentId=4</code> (the query parameter is trusted), cancels Bình's booking, cancels her own twice, approves her own. Lecturer #20 approves a booking in a room they do not manage. Every request is authenticated; none is authorised.</li>
<li><strong>Hand-written <code>where</code></strong> — the IDOR is gone: Bình's booking is a 404 for An, the list ignores <code>studentId</code>. But two rules slipped: Bình cancels an <em>approved</em> booking (should be refused), and the admin gets 404 on 103 because the owner check forgot admins. Checks scattered over methods drift apart — this is the normal outcome, not bad luck.</li>
<li><strong>CASL</strong> — all nine as intended, and the refusals explain themselves (<code>Lịch đã huỷ rồi</code>).</li>
</ul>
<p><strong>404 or 403?</strong> If the caller may not even <em>see</em> the record, answer 404 — otherwise a 403 confirms "booking 102 exists", and sequential ids let anyone count your bookings. If they may see it but not perform the action (An's own cancelled booking), 403 with the reason is more helpful.</p>

<h3>The rules in one place: CASL</h3>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<ul>
<li><code>can(action, subject, conditions)</code>: conditions use MongoDB-style operators (<code>$in</code>) and are matched against the record — <code>subject('Booking', b)</code> tells CASL what type the plain object is.</li>
<li><code>cannot(…).because(…)</code> overrides earlier <code>can</code> rules, and <code>relevantRuleFor()</code> returns the reason for a 403.</li>
<li>The lecturer rule needs data that is not on the booking (which rooms they manage) — load it when building the ability. In milestone 7 the room's <code>managerId</code> is loaded with the booking.</li>
<li>Lists: here we filter in memory with <code>ability.can('read', …)</code>, fine for three rows. For a real table, push the rule into the query — either a hand-written <code>where: { userId }</code> as in milestone 7's <code>/bookings/mine</code>, or the <code>@casl/prisma</code> helper that turns rules into a Prisma <code>where</code>.</li>
</ul>

<h3>Do not generate ids to hide them</h3>
<p>Switching to UUIDs makes guessing harder, not impossible: ids leak through URLs, logs, e-mails and other endpoints. They are a speed bump, not an authorisation check. The check above is needed whatever the id looks like.</p>

<h3>🕵️ Real incident — First American Financial, 2019</h3>
<p>On 24 May 2019 KrebsOnSecurity reported that First American Financial Corp., a US title insurance company, served documents from its website at addresses ending in a sequential number. Anyone with one link — sent to them for their own home purchase — could change the number and read other people's documents: bank account numbers, mortgage and tax records, Social Security numbers, driver's licence images, going back to 2003. About <strong>885 million</strong> records were reachable with no login. In June 2021 the SEC fined the company $487,616, noting its security team had already found the vulnerability in January 2019 and it was not fixed for months; New York's financial regulator later settled for $1 million. The whole bug is the "naive" column above: the server checked nothing between the number in the URL and the person asking.</p>

<h3>🧪 Exercise (15 min)</h3>
<p>Rules that matter deserve their own tests, without HTTP or a database. Write a table-driven test for <code>abilityFor</code>: for each (user, action, booking) the expected yes/no — including the edge cases "student cancels an approved booking", "lecturer approves a booking in another room", "admin cancels a cancelled booking".</p>
<details><summary>Show solution</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>15 cases run in 9 ms. When someone later edits the policy, a red row names the exact cell that changed — reviewers can discuss "should admins be able to cancel a cancelled booking?" instead of reading conditions.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>What is IDOR/BOLA and how do you prevent it in NestJS?</strong> Accessing a record by id without checking the caller's right to that record. Check ownership in the service after loading (or in the query's <code>where</code>), never only by role in a guard.</li>
<li><strong>Why not a guard for ownership?</strong> A guard runs before the handler and only sees the request; it would have to load the record itself. Policy checks belong where the record is loaded — or in a dedicated policy service the handler calls.</li>
<li><strong>404 or 403 for someone else's resource?</strong> 404 when they must not learn it exists; 403 when they can see it but not act.</li>
<li><strong>What does CASL add?</strong> Declarative rules with conditions on record fields, defined in one place, testable as pure functions, with reasons for refusals.</li>
</ol>

<h3>💼 On the job</h3>
<p>Security testers at a client's acceptance phase (or a bug-bounty hunter) try IDOR first: log in as user A, copy a request from user B, swap the token. When you join a project, do this yourself on every <code>:id</code> route in an afternoon — it is the cheapest high-severity finding there is, and fixing it before the pentest is worth more than any feature you ship that week.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Reaching another user's record by changing an id; OWASP API1:2023.</span></div>
  <div class="kv"><span class="k">Ownership check</span><span class="v">Comparing the record's owner (or room manager…) with the caller, after loading it.</span></div>
  <div class="kv"><span class="k">CASL ability</span><span class="v">Set of can/cannot rules for one user; ability.can(action, subject(type, record)).</span></div>
  <div class="kv"><span class="k">Conditions</span><span class="v">MongoDB-style filters on record fields inside a rule ({ userId: u.id, status: 'PENDING' }).</span></div>
  <div class="kv"><span class="k">relevantRuleFor / because</span><span class="v">Find the rule deciding a check and its human-readable reason.</span></div>
  <div class="kv"><span class="k">404 vs 403</span><span class="v">Hide existence (404) or explain the refusal (403).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Roles decide the action; ownership decides the record. Guards cannot see the record.</li>
<li>Naive code: 9/9 requests succeeded. Scattered <code>where</code> checks: IDOR fixed, two rules missed. One CASL policy: all correct, with reasons.</li>
<li>Never trust owner ids from the client (<code>?studentId=</code>, body fields); take the owner from the token.</li>
<li>Test the policy as a table; push list filters into the query.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>7.4 — Câu hỏi vai trò không trả lời được: bản ghi này có phải của bạn?</h2>
<p class="lead">Sau bài 7.3, sinh viên được gọi <code>DELETE /bookings/:id</code>. Đó là luật theo vai trò. Nó không nói gì về <em>lịch nào</em>. Nếu handler huỷ bất kỳ id nào gửi tới, sinh viên nào cũng huỷ được lịch của người khác chỉ bằng cách đổi một con số. Đó là IDOR (insecure direct object reference), OWASP gọi là <strong>BOLA</strong> — đứng số một trong API Security Top 10 2023. Guard nhìn thấy route; chỉ đoạn mã đã nạp bản ghi mới thấy chủ của nó.</p>

<h3>Liên hệ đời thường: quầy gửi áo</h3>
<p>Quầy gửi áo đưa bạn vé số 102. Một quầy làm ẩu đưa áo 102 cho bất kỳ ai nói "102" — thế là bạn nói "103" và ra về với cái áo đẹp hơn. Một quầy cẩn thận kiểm cái vé trong tay bạn có đúng là vé họ đã đưa không. <code>:id</code> trong API của bạn là con số bạn đọc to lên; JWT là cái vé trong tay.</p>

<h3>Bối cảnh: ba lịch, bốn người</h3>
<p>Sinh viên An (#3) có lịch 101; sinh viên Bình (#4) có 102 (phòng 1) và 103 (phòng 2, đã duyệt). Giảng viên #20 chỉ quản lý phòng 1. Mỗi lịch có số điện thoại — dữ liệu sẽ bị lộ. Cùng chín request được gửi tới ba cách cài service:</p>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<div class="out">${esc(OUT)}</div>

<h3>Đọc ba lần chạy</h3>
<ul>
<li><strong>Ngây thơ</strong> — 9/9 thành công. An đọc được lịch và số điện thoại của Bình, liệt kê mọi lịch của Bình bằng <code>?studentId=4</code> (tham số query được tin), huỷ lịch của Bình, huỷ lịch mình hai lần, tự duyệt lịch mình. Giảng viên #20 duyệt lịch ở phòng họ không quản lý. Request nào cũng đã xác thực; không request nào được phân quyền.</li>
<li><strong>Tự viết <code>where</code></strong> — hết IDOR: lịch của Bình là 404 với An, danh sách bỏ qua <code>studentId</code>. Nhưng sót hai luật: Bình huỷ được lịch <em>đã duyệt</em> (lẽ ra bị từ chối), và admin nhận 404 ở lịch 103 vì phép kiểm chủ quên mất admin. Phép kiểm rải ở từng method sẽ lệch nhau dần — đó là kết cục bình thường, không phải xui.</li>
<li><strong>CASL</strong> — cả chín đúng như ý, và câu từ chối tự giải thích (<code>Lịch đã huỷ rồi</code>).</li>
</ul>
<p><strong>404 hay 403?</strong> Nếu người gọi không được cả <em>thấy</em> bản ghi, trả 404 — không thì 403 xác nhận "lịch 102 có tồn tại", và id tăng dần cho phép bất kỳ ai đếm số lịch của bạn. Nếu được thấy nhưng không được làm (lịch đã huỷ của chính An), 403 kèm lý do có ích hơn.</p>

<h3>Luật ở một chỗ: CASL</h3>
<pre><code class="language-ts">${esc(MA_POL)}</code></pre>
<ul>
<li><code>can(hành động, chủ thể, điều kiện)</code>: điều kiện dùng toán tử kiểu MongoDB (<code>$in</code>) và được so với bản ghi — <code>subject('Booking', b)</code> cho CASL biết object thường đó thuộc kiểu nào.</li>
<li><code>cannot(…).because(…)</code> ghi đè các luật <code>can</code> trước đó, và <code>relevantRuleFor()</code> trả về lý do cho mã 403.</li>
<li>Luật của giảng viên cần dữ liệu không nằm trên lịch (họ quản lý phòng nào) — nạp nó khi dựng ability. Ở mốc 7, <code>managerId</code> của phòng được nạp cùng lịch.</li>
<li>Danh sách: ở đây ta lọc trong bộ nhớ bằng <code>ability.can('read', …)</code>, ổn với ba dòng. Với bảng thật, đẩy luật vào truy vấn — hoặc tự viết <code>where: { userId }</code> như <code>/bookings/mine</code> của mốc 7, hoặc dùng <code>@casl/prisma</code> để biến luật thành <code>where</code> của Prisma.</li>
</ul>

<h3>Đừng đổi kiểu id để giấu nó</h3>
<p>Đổi sang UUID làm việc đoán khó hơn, không phải không thể: id lộ qua URL, log, email và các endpoint khác. Nó là gờ giảm tốc, không phải phép kiểm quyền. Phép kiểm ở trên vẫn cần dù id trông thế nào.</p>

<h3>🕵️ Sự cố thật — First American Financial, 2019</h3>
<p>Ngày 24/05/2019, KrebsOnSecurity đưa tin First American Financial Corp., một công ty bảo hiểm quyền sở hữu nhà đất ở Mỹ, phục vụ tài liệu trên website ở các địa chỉ kết thúc bằng một con số tăng dần. Ai có một đường dẫn — được gửi cho chính họ khi mua nhà — đều đổi được con số đó và đọc tài liệu của người khác: số tài khoản ngân hàng, hồ sơ vay và thuế, số an sinh xã hội, ảnh bằng lái, từ năm 2003 trở lại đây. Khoảng <strong>885 triệu</strong> hồ sơ mở ra mà không cần đăng nhập. Tháng 6/2021, SEC phạt công ty 487.616 USD, ghi nhận đội bảo mật nội bộ đã tìm ra lỗ hổng từ tháng 01/2019 mà mấy tháng sau vẫn chưa sửa; cơ quan quản lý tài chính New York sau đó dàn xếp mức 1 triệu USD. Toàn bộ con lỗi chính là cột "ngây thơ" ở trên: máy chủ không kiểm gì giữa con số trên URL và người đang hỏi.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Luật quan trọng xứng đáng có test riêng, không cần HTTP hay cơ sở dữ liệu. Viết một test dạng bảng cho <code>abilityFor</code>: với mỗi (người, hành động, lịch) là kết quả có/không mong đợi — gồm cả ca biên "sinh viên huỷ lịch đã duyệt", "giảng viên duyệt lịch ở phòng khác", "admin huỷ lịch đã huỷ".</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>15 ca chạy trong 9 ms. Sau này ai sửa luật, một dòng đỏ chỉ đúng ô đã đổi — người review bàn được "admin có nên huỷ lịch đã huỷ không?" thay vì ngồi đọc điều kiện.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>IDOR/BOLA là gì, chặn trong NestJS thế nào?</strong> Truy cập bản ghi theo id mà không kiểm người gọi có quyền với chính bản ghi đó. Kiểm quyền sở hữu trong service sau khi nạp (hoặc ngay trong <code>where</code> của truy vấn), không bao giờ chỉ dựa vào vai trò ở guard.</li>
<li><strong>Sao không dùng guard để kiểm sở hữu?</strong> Guard chạy trước handler và chỉ thấy request; nó sẽ phải tự nạp bản ghi. Phép kiểm luật nằm ở chỗ nạp bản ghi — hoặc trong một policy service mà handler gọi.</li>
<li><strong>Tài nguyên của người khác: 404 hay 403?</strong> 404 khi họ không được biết nó tồn tại; 403 khi họ thấy được nhưng không được làm.</li>
<li><strong>CASL thêm được gì?</strong> Luật khai báo với điều kiện trên các trường của bản ghi, viết ở một chỗ, test được như hàm thuần, có lý do khi từ chối.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Người kiểm thử bảo mật ở giai đoạn nghiệm thu của khách hàng (hay một thợ săn bug bounty) thử IDOR đầu tiên: đăng nhập bằng người A, chép một request của người B, đổi token. Khi vào một dự án, hãy tự làm việc này với mọi route có <code>:id</code> trong một buổi chiều — đó là phát hiện mức nghiêm trọng cao rẻ nhất có thể, và sửa nó trước đợt pentest giá trị hơn bất kỳ tính năng nào bạn giao trong tuần đó.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">IDOR / BOLA</span><span class="v">Chạm tới bản ghi của người khác bằng cách đổi id; OWASP API1:2023.</span></div>
  <div class="kv"><span class="k">Kiểm quyền sở hữu</span><span class="v">So chủ của bản ghi (hoặc người quản lý phòng…) với người gọi, sau khi nạp.</span></div>
  <div class="kv"><span class="k">CASL ability</span><span class="v">Tập luật can/cannot cho một người; ability.can(hành động, subject(kiểu, bản ghi)).</span></div>
  <div class="kv"><span class="k">Điều kiện (conditions)</span><span class="v">Bộ lọc kiểu MongoDB trên trường của bản ghi trong một luật ({ userId: u.id, status: 'PENDING' }).</span></div>
  <div class="kv"><span class="k">relevantRuleFor / because</span><span class="v">Tìm luật quyết định một phép kiểm và lý do dễ đọc của nó.</span></div>
  <div class="kv"><span class="k">404 so với 403</span><span class="v">Giấu sự tồn tại (404) hay giải thích việc từ chối (403).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Vai trò quyết định hành động; quyền sở hữu quyết định bản ghi. Guard không nhìn thấy bản ghi.</li>
<li>Mã ngây thơ: 9/9 request thành công. <code>where</code> rải rác: hết IDOR, sót hai luật. Một policy CASL: đúng hết, có lý do.</li>
<li>Không bao giờ tin id chủ sở hữu từ client (<code>?studentId=</code>, trường trong body); lấy chủ từ token.</li>
<li>Test policy dạng bảng; đẩy bộ lọc danh sách vào truy vấn.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
