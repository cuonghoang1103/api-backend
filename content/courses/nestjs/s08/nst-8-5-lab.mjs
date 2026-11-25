/**
 * 8.5 — Lab: Phủ test module đặt lịch — đơn vị, guard và e2e (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Nest 12.6.0, Vitest 4.1.12, PostgreSQL 16.16): scratchpad/nst/lab/c8/lab85/dot-bien.py cài lần lượt 8 đột biến vào moc8,
 * chạy cả bộ test, gỡ ra. Bộ test mốc 7 (31 test, xanh, phủ 89,47% dòng, policy/perm.guard 100% dòng): bắt 0/8. Thêm 3 tệp lời giải
 * (src/lab85: don-vi 6, thanh-phan 6, http.e2e 2 ⇒ 45 test): bắt 8/8. Thử phá thật: lần đầu một test lời giải sai + thiếu DATABASE_URL_TEST
 * ⇒ bộ test đỏ sẵn ⇒ "8/8" giả — vì vậy script kiểm mã gốc phải xanh trước.
 * Sự cố: CrowdStrike Channel File 291, 19/07/2024 — RCA 06/08/2024 (Content Validator có lỗi logic nên cho qua mẫu thiếu trường thứ 21).
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-8-2-mutation', title: 'Testing 8.2 — Mutation testing', sub: 'Lý thuyết và Stryker: đo chất lượng test bằng lỗi cài sẵn — lab này làm tay với 8 lỗi.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-8-1-do-phu', title: 'Testing 8.1 — Độ phủ', sub: 'Độ phủ dòng, nhánh, và vì sao 100% vẫn chưa chứng minh gì.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-6-lab', title: 'NestJS 7.6 — Lab ma trận quyền', sub: 'Lab trước cũng "thử phá" — ở đây phá có hệ thống, 8 lần.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🕵️', 'CrowdStrike — Channel File 291 Incident Root Cause Analysis (06/08/2024)', 'Mẫu nội dung có 21 trường nhưng mã gọi chỉ cấp 20; Content Validator có lỗi nên cho qua; đọc ngoài mảng ⇒ máy Windows sập.', 'https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf'),
  nguon('🕵️', 'CrowdStrike — Preliminary Post Incident Review (24/07/2024)', '"Due to a bug in the Content Validator, one of the two Template Instances passed validation despite containing problematic content data."', 'https://www.crowdstrike.com/en-us/blog/falcon-content-update-preliminary-post-incident-report/'),
  nguon('🕵️', 'TechTarget — CrowdStrike: Content validation bug led to global outage', 'Tóm tắt báo cáo sơ bộ và các thay đổi quy trình kiểm thử sau sự cố.', 'https://www.techtarget.com/cybersecurity/news/366596579/CrowdStrike-Content-validation-bug-led-to-global-outage'),
].join('\n');
const MA_DB = "#!/usr/bin/env python3\n# dot-bien.py — cài từng lỗi (đột biến) vào mã moc8, chạy cả bộ test, gỡ lỗi; in đột biến nào bị test BẮT (đỏ) hay SỐNG SÓT (xanh)\nimport subprocess, sys, pathlib, os\nos.environ.setdefault('DATABASE_URL_TEST', 'postgresql://nst:nst@127.0.0.1:41601/moc8_test')\nGOC = pathlib.Path(os.path.abspath('.'))\nDB = [\n  ('M1', 'src/bookings/bookings.service.ts', 's <= this.clock.now()', 's < this.clock.now()', 'cho đặt lịch bắt đầu ĐÚNG lúc này'),\n  ('M2', 'src/bookings/bookings.service.ts', 'b.attendees > room.capacity', 'b.attendees >= room.capacity', 'đủ 30/30 chỗ cũng bị từ chối'),\n  ('M3', 'src/bookings/bookings.service.ts', \"notIn: ['CANCELLED', 'REJECTED']\", \"notIn: ['CANCELLED']\", 'lịch bị từ chối vẫn hiện là \"bận\"'),\n  ('M4', 'src/bookings/bookings.service.ts', 'where: { id, version: b.version }', 'where: { id }', 'mất khoá lạc quan (hai người cùng duyệt)'),\n  ('M5', 'src/auth/perm.guard.ts', \"if (!perm) throw new ForbiddenException('Route chưa khai quyền', { errorCode: 'ROUTE_NOT_DECLARED' });\", 'if (!perm) return true;', 'route quên khai quyền thì MỞ'),\n  ('M6', 'src/auth/booking.policy.ts', \"can(['approve', 'reject'], 'Booking', { managerId: u.id, status: 'PENDING' });\", \"can(['approve', 'reject'], 'Booking', { managerId: u.id });\", 'duyệt lại lịch đã duyệt/đã từ chối'),\n  ('M7', 'src/common/problem.filter.ts', 'status >= 500 ?', 'status > 500 ?', 'lỗi 500 lộ thông điệp gốc'),\n  ('M8', 'src/auth/auth.service.ts', \"findUnique({ where: { email: d.email.toLowerCase() } })\", \"findUnique({ where: { email: d.email } })\", 'đăng nhập phân biệt hoa/thường email'),\n]\nchon = sys.argv[1:]\nchay = lambda: subprocess.run(['npx', 'vitest', 'run', '--reporter=dot'], cwd=GOC, capture_output=True, text=True, env={**os.environ, 'NO_COLOR': '1'}, timeout=300)\ngoc = chay()   # bộ test PHẢI xanh trên mã gốc — đỏ sẵn thì mọi đột biến đều \"bị bắt\" giả\nif goc.returncode != 0: sys.exit('Bộ test đang ĐỎ trên mã gốc — sửa test trước:\\n' + goc.stdout[-1500:])\nprint('mã gốc:', [l.strip() for l in goc.stdout.splitlines() if l.strip().startswith('Tests')][-1])\nkq = []\nfor ma, tep, cu, moi, mota in DB:\n    if chon and ma not in chon: continue\n    p = GOC / tep; s = p.read_text()\n    assert s.count(cu) == 1, f'{ma}: không thấy đúng 1 chỗ \"{cu}\" trong {tep}'\n    p.write_text(s.replace(cu, moi))\n    try:\n        r = chay()\n    finally:\n        p.write_text(s)\n    do = r.returncode != 0\n    dong = [l for l in r.stdout.splitlines() if l.strip().startswith('Tests')]\n    kq.append(do)\n    print(f'{ma} {\"BẮT ✔\" if do else \"SỐNG ✘\"}  {mota:42s} {dong[-1].strip() if dong else \"\"}', flush=True)\nprint(f'— bắt {sum(kq)}/{len(kq)} đột biến')";
const OUT_TRUOC = "$ python3 dot-bien.py      # bộ test của mốc 7: 31 test\nmã gốc: Tests  31 passed (31)\nM1 SỐNG ✘  cho đặt lịch bắt đầu ĐÚNG lúc này          Tests  31 passed (31)\nM2 SỐNG ✘  đủ 30/30 chỗ cũng bị từ chối               Tests  31 passed (31)\nM3 SỐNG ✘  lịch bị từ chối vẫn hiện là \"bận\"          Tests  31 passed (31)\nM4 SỐNG ✘  mất khoá lạc quan (hai người cùng duyệt)   Tests  31 passed (31)\nM5 SỐNG ✘  route quên khai quyền thì MỞ               Tests  31 passed (31)\nM6 SỐNG ✘  duyệt lại lịch đã duyệt/đã từ chối         Tests  31 passed (31)\nM7 SỐNG ✘  lỗi 500 lộ thông điệp gốc                  Tests  31 passed (31)\nM8 SỐNG ✘  đăng nhập phân biệt hoa/thường email       Tests  31 passed (31)\n— bắt 0/8 đột biến";
const OUT_SAU = "$ python3 dot-bien.py      # thêm 3 tệp test của lab\nmã gốc: Tests  45 passed (45)\nM1 BẮT ✔  cho đặt lịch bắt đầu ĐÚNG lúc này          Tests  1 failed | 44 passed (45)\nM2 BẮT ✔  đủ 30/30 chỗ cũng bị từ chối               Tests  1 failed | 44 passed (45)\nM3 BẮT ✔  lịch bị từ chối vẫn hiện là \"bận\"          Tests  1 failed | 44 passed (45)\nM4 BẮT ✔  mất khoá lạc quan (hai người cùng duyệt)   Tests  1 failed | 44 passed (45)\nM5 BẮT ✔  route quên khai quyền thì MỞ               Tests  1 failed | 44 passed (45)\nM6 BẮT ✔  duyệt lại lịch đã duyệt/đã từ chối         Tests  1 failed | 44 passed (45)\nM7 BẮT ✔  lỗi 500 lộ thông điệp gốc                  Tests  1 failed | 44 passed (45)\nM8 BẮT ✔  đăng nhập phân biệt hoa/thường email       Tests  1 failed | 44 passed (45)\n— bắt 8/8 đột biến";
const MA_L1 = "// lab85/don-vi.spec.ts — luật của BookingsService, DB giả + đồng hồ cố định (bắt M1, M2, M4)\nimport { Test } from '@nestjs/testing';\nimport { BookingsService } from '../bookings/bookings.service.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport { Clock } from '../common/clock.module.js';\nimport { NGUOI } from '../test/auth.js';\n\nconst BAY_GIO = new Date('2027-01-05T08:00:00+07:00');\nconst db = { room: { findUnique: vi.fn() }, booking: { create: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() } };\nlet svc: BookingsService;\nbeforeEach(async () => {\n  vi.resetAllMocks();\n  db.room.findUnique.mockResolvedValue({ id: 1, code: 'AL-201', capacity: 30, managerId: NGUOI.gv.id });\n  db.booking.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }));\n  svc = (await Test.createTestingModule({ providers: [BookingsService, { provide: PrismaService, useValue: db }, { provide: Clock, useValue: { now: () => BAY_GIO } }] }).compile()).get(BookingsService);\n});\nconst dat = (start: string, attendees = 5) => svc.create({ roomId: 1, start: `2027-01-05T${start}:00+07:00`, end: '2027-01-05T11:00:00+07:00', attendees }, NGUOI.an);\n\ndescribe('biên thời gian (bây giờ = 08:00)', () => {\n  it('07:30 ⇒ quá khứ', () => expect(dat('07:30')).rejects.toMatchObject({ errorCode: 'BOOKING_IN_PAST' }));\n  it('08:00 — đúng lúc này — cũng là quá khứ', () => expect(dat('08:00')).rejects.toMatchObject({ errorCode: 'BOOKING_IN_PAST' }));   // M1\n  it('08:30 ⇒ được', () => expect(dat('08:30')).resolves.toMatchObject({ userId: NGUOI.an.id }));\n});\ndescribe('biên sức chứa (phòng 30 chỗ)', () => {\n  it('30 người ⇒ được', () => expect(dat('09:00', 30)).resolves.toBeDefined());                                                       // M2\n  it('31 người ⇒ 400', () => expect(dat('09:00', 31)).rejects.toMatchObject({ status: 400 }));\n});\nit('đổi trạng thái là UPDATE có điều kiện version (khoá lạc quan)', async () => {                                                      // M4\n  db.booking.findUnique.mockResolvedValue({ id: 7, userId: NGUOI.an.id, roomId: 1, status: 'PENDING', version: 3, room: { managerId: NGUOI.gv.id } });\n  db.booking.updateMany.mockResolvedValue({ count: 0 });\n  await expect(svc.setStatus(NGUOI.gv, 7, 'approve')).rejects.toMatchObject({ status: 409, errorCode: 'BOOKING_CHANGED' });\n  expect(db.booking.updateMany.mock.calls[0][0].where).toEqual({ id: 7, version: 3 });\n});";
const MA_L2 = "// lab85/thanh-phan.spec.ts — guard, policy, filter test riêng từng cái (bắt M5, M6, M7)\nimport { ArgumentsHost, ExecutionContext, Logger } from '@nestjs/common';\nimport { Reflector } from '@nestjs/core';\nimport { subject } from '@casl/ability';\nimport { PermGuard } from '../auth/perm.guard.js';\nimport { bookingAbility } from '../auth/booking.policy.js';\nimport { ProblemFilter } from '../common/problem.filter.js';\nimport { createMock } from '../test/tao-mock.js';\nimport { NGUOI } from '../test/auth.js';\n\nit('PermGuard: handler không khai @Public/@AnyUser/@CanPerm ⇒ 403 ROUTE_NOT_DECLARED (mặc định đóng)', () => {        // M5\n  class C { quen() {} }\n  const ctx = createMock<ExecutionContext>({ getHandler: () => C.prototype.quen, getClass: () => C, switchToHttp: () => ({ getRequest: () => ({ user: { id: 1, role: 'ADMIN' } }) }) });\n  expect(() => new PermGuard(new Reflector()).canActivate(ctx)).toThrow(expect.objectContaining({ status: 403, errorCode: 'ROUTE_NOT_DECLARED' }));\n});\n\ndescribe('bookingAbility — giảng viên quản lý phòng 1', () => {                                                                       // M6\n  const a = bookingAbility(NGUOI.gv);\n  const lich = (status: string) => subject('Booking', { userId: NGUOI.an.id, roomId: 1, status, managerId: NGUOI.gv.id, started: false });\n  it.each([['PENDING', true], ['APPROVED', false], ['REJECTED', false], ['CANCELLED', false]])('approve lịch %s ⇒ %s', (st, mong) => {\n    expect(a.can('approve', lich(st))).toBe(mong);\n    expect(a.can('reject', lich(st))).toBe(mong);\n  });\n});\n\nit('ProblemFilter: lỗi lạ ⇒ 500 và detail KHÔNG chứa thông điệp gốc', () => {                                                      // M7\n  Logger.overrideLogger(false);                       // filter ghi log lỗi 500 — tắt cho gọn output test\n  const reply = vi.fn();\n  const f = new ProblemFilter({ httpAdapter: { reply, setHeader: vi.fn() } } as never);\n  f.catch(new Error('relation \"users\" does not exist'), createMock<ArgumentsHost>({ switchToHttp: () => ({ getRequest: () => ({ id: 'r1', originalUrl: '/x' }), getResponse: () => ({}) }) }));\n  expect(reply.mock.calls[0][2]).toBe(500);\n  expect(reply.mock.calls[0][1].detail).not.toContain('users');\n});";
const MA_L3 = "// lab85/http.e2e.spec.ts — qua HTTP + PostgreSQL thật (bắt M3, M8)\nimport request from 'supertest';\nimport type { INestApplication } from '@nestjs/common';\nimport { taoApp } from '../test/tao-app.js';\nimport { bearer, MAT_KHAU, NGUOI } from '../test/auth.js';\n\nlet app: INestApplication;\nbeforeAll(async () => { app = await taoApp(); });\nafterAll(() => app.close());\nconst http = () => request(app.getHttpServer());\n\nit('lịch bị TỪ CHỐI trả lại khung giờ: không còn trong danh sách bận', async () => {                                              // M3\n  const b = (await http().post('/bookings').set(bearer(app, 'an')).send({ roomId: 1, start: '2027-01-08T07:30:00+07:00', end: '2027-01-08T09:30:00+07:00', attendees: 5 }).expect(201)).body;\n  await http().patch(`/bookings/${b.id}/reject`).set(bearer(app, 'gv')).expect(200);\n  const ban = (await http().get('/bookings/room/1').set(bearer(app, 'binh')).expect(200)).body;\n  expect(ban.map((x: { id: number }) => x.id)).not.toContain(b.id);\n});\nit('email không phân biệt hoa/thường khi đăng nhập', async () => {                                                                  // M8\n  await http().post('/auth/login').send({ email: NGUOI.an.email.toUpperCase(), password: MAT_KHAU }).expect(200);\n});";
const OUT_PHU = "— bộ test mốc 7 (31 test, 0/8 đột biến):\nFile               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s\nAll files          |   86.31 |    69.42 |   85.52 |   89.47 |\n  ...ing.policy.ts |      90 |       75 |     100 |     100 | 11\n  perm.guard.ts    |    92.3 |       80 |     100 |     100 | 7,14\n  ...gs.service.ts |   82.05 |    70.83 |   85.71 |   92.59 | 28-32\n  ...lem.filter.ts |   94.11 |    62.06 |     100 |     100 | 5-16,18-19,23\n\n— thêm 3 tệp của lab (45 test, 8/8 đột biến):\nAll files          |   90.52 |    77.07 |   90.78 |   92.98 |\n  ...ing.policy.ts |      90 |       75 |     100 |     100 | 11\n  perm.guard.ts    |     100 |       90 |     100 |     100 | 7\n  ...gs.service.ts |   89.74 |    79.16 |     100 |   96.29 | 28\n  ...lem.filter.ts |     100 |     93.1 |     100 |     100 | 5,19";

export default {
  title: '8.5 — Lab: Covering the bookings module — unit, guard and e2e|||8.5 — Lab: Phủ test module đặt lịch — đơn vị, guard và e2e',
  slug: 'nst-8-5-lab',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lab gộp cả chương, đo bằng lỗi cài sẵn: một script cài lần lượt 8 lỗi nhỏ vào dự án (lệch biên thời gian, sức chứa, mất khoá lạc quan, route quên khai quyền thì mở, lỗi 500 lộ thông điệp…) rồi chạy cả bộ test. 31 test xanh của mốc 7, phủ 89% dòng, bắt được 0/8. Bạn viết test đơn vị, test guard/policy/filter và hai test e2e cho tới khi bắt đủ 8/8 — kèm sự cố CrowdStrike 2024, khi chính bộ kiểm tra có lỗi.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lab</span>
<h2>8.5 — How good are the tests? Plant eight bugs and count</h2>
<p class="lead">"All tests green" says nothing about how many bugs the tests would catch. The honest way to find out is to plant bugs on purpose and count how many turn the suite red — mutation testing, done by hand here with eight realistic mutants. Then you write the missing tests, with the three techniques of this chapter, until every mutant dies.</p>

<h3>Goal and pass criteria</h3>
<ul>
<li>Starting point: the project after mốc 7 with the mốc 8 test setup (lesson 8.3: <code>taoApp()</code>, one database per worker) — 31 green tests.</li>
<li><strong>Pass</strong>: the script below reports <strong>8/8</strong> caught, the suite is green on the unmodified code, and every new test has a name a reviewer understands without reading the code.</li>
</ul>

<h3>Step 1 — the mutation script</h3>
<p>Each mutant is one small textual change of the kind real people make: <code>&lt;=</code> written as <code>&lt;</code>, one value missing from a list, a condition dropped. The script applies one, runs the whole suite, restores the file and prints whether the suite caught it:</p>
<pre><code class="language-python">${esc(MA_DB)}</code></pre>

<h3>Step 2 — run it against the existing suite</h3>
<p>Predict first: how many of the eight will the 31 tests of mốc 7 catch?</p>
<details><summary>Show the result</summary>
<div class="out">${esc(OUT_TRUOC)}</div>
<p><strong>Zero.</strong> The mốc 7 tests are good tests — each one checks a real rule through HTTP — but they test the main paths: a booking at 07:30, five attendees, one approval, a route that <em>is</em> declared. None sits on a boundary, none runs two approvals on the same version, none sends a request to an undeclared route. Here is what code coverage said about the same suite:</p>
<div class="out">${esc(OUT_PHU)}</div>
<p><code>booking.policy.ts</code> and <code>perm.guard.ts</code> were at 100% lines while the M5 and M6 mutants in exactly those files survived. Coverage says which lines ran, not which mistakes would be noticed.</p>
</details>

<h3>Step 3 — write the tests (yourself first)</h3>
<p>One test per mutant, at the cheapest level that can catch it. Hints:</p>
<table>
<tr><th>Mutant</th><th>Level</th><th>Hint</th></tr>
<tr><td>M1, M2</td><td>unit (8.1)</td><td>Fixed clock at 08:00; book exactly at 08:00; book exactly 30 of 30 seats.</td></tr>
<tr><td>M4</td><td>unit (8.1)</td><td>A real race is not deterministic; assert that the update is conditional on <code>version</code> and that <code>count: 0</code> means 409.</td></tr>
<tr><td>M5</td><td>guard (8.2)</td><td>A handler with no decorator ⇒ 403 <code>ROUTE_NOT_DECLARED</code>. No such route exists in the app — that is why only a unit test can cover it.</td></tr>
<tr><td>M6</td><td>policy (8.2)</td><td>The CASL ability is a pure function: a table over the four statuses.</td></tr>
<tr><td>M7</td><td>filter (8.2)</td><td>An unknown error whose message contains a table name.</td></tr>
<tr><td>M3, M8</td><td>e2e (8.3)</td><td>Reject a booking, then read the room's busy list; log in with the e-mail in capitals.</td></tr>
</table>
<details><summary>Show the solution — unit</summary>
<pre><code class="language-ts">${esc(MA_L1)}</code></pre>
</details>
<details><summary>Show the solution — guard, policy, filter</summary>
<pre><code class="language-ts">${esc(MA_L2)}</code></pre>
</details>
<details><summary>Show the solution — e2e</summary>
<pre><code class="language-ts">${esc(MA_L3)}</code></pre>
</details>

<h3>Step 4 — run the script again</h3>
<details><summary>Show the result</summary>
<div class="out">${esc(OUT_SAU)}</div>
<p>14 new tests (45 in total), 8/8 caught, each mutant by exactly one test — which is what you want: a red test names the broken rule. The new tests cost well under a second; only two of them needed HTTP and the database.</p>
</details>

<h3>Break it on purpose: a checker with a bug</h3>
<p>The first time this lab was run, the script reported 8/8 immediately — before the solution was correct. Two reasons, both real: one solution test had a wrong expectation (it was red on correct code), and in another run the environment variable <code>DATABASE_URL_TEST</code> was missing, so <em>every</em> run failed in global setup. A suite that is already red "catches" every mutant. That is why the script now runs the suite on the unmodified code first and stops if it is not green — the same check you should do before trusting any red/green signal, including CI.</p>

<h3>🕵️ Real incident — when the validator itself had a bug (CrowdStrike, 19 July 2024)</h3>
<p>On 19 July 2024 a content update for CrowdStrike Falcon crashed millions of Windows machines worldwide; airlines, hospitals and banks stopped. CrowdStrike's root cause analysis (6 August 2024) describes a test gap very close to this lab: a new template type defined <strong>21</strong> input fields, the code calling it supplied only <strong>20</strong>, and the automated <strong>Content Validator</strong> — the check that should have stopped bad content — had a logic bug and let the template instance pass. The sensor read the 21st entry out of bounds and the kernel crashed. No test ever ran that combination of real input and real code. Lessons for a backend developer: a check that cannot fail is not a check (prove your tests can go red, as in this lab); test the boundary between what is declared and what is actually passed (M2, the note column in lesson 8.6); and roll out gradually — CrowdStrike now stages content updates.</p>

<h3>Everyday analogy: a smoke detector test button</h3>
<p>A smoke detector that never beeps might be in a house that never burns — or have no battery. The test button exists to tell those apart. Mutants are the test button of your test suite.</p>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Your coverage is 90%. Is the code well tested?</strong> Not necessarily: in this lab, 89% line coverage caught 0 of 8 planted bugs. Coverage finds untested code; mutants measure whether tests check anything.</li>
<li><strong>What is mutation testing?</strong> Automatically making small changes to the code and checking that at least one test fails for each; surviving mutants show missing assertions. Tools: Stryker for JS/TS.</li>
<li><strong>Which tests would you add to a Nest module first?</strong> Boundaries of business rules (unit), the default-deny path of guards and policies (unit), and a few e2e tests for what only the database can decide.</li>
<li><strong>How do you know a test can fail?</strong> See it red once: write it before the fix, or break the code on purpose.</li>
</ol>

<h3>💼 On the job</h3>
<p>Before a release, a customer's QA team asks "how do you know your tests are good?". Showing a coverage report invites the next question. Showing a short table — "8 typical mistakes planted, 8 caught, here is the script" — ends the discussion. For a larger codebase, run Stryker (Testing course 8.2) on the most critical module only; full runs are slow.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mutant</span><span class="v">A copy of the code with one small deliberate change.</span></div>
  <div class="kv"><span class="k">Killed / survived</span><span class="v">At least one test failed / all tests stayed green with the mutant.</span></div>
  <div class="kv"><span class="k">Boundary value</span><span class="v">The value exactly at a limit (08:00 when now is 08:00, 30 of 30 seats).</span></div>
  <div class="kv"><span class="k">Default deny</span><span class="v">The guard path for undeclared routes — must have its own test.</span></div>
  <div class="kv"><span class="k">Baseline run</span><span class="v">Running the suite on unmodified code first; red baseline makes every result meaningless.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>31 green tests, 89% line coverage, 0/8 planted bugs caught.</li>
<li>14 targeted tests — mostly unit, two e2e — catch 8/8.</li>
<li>Pick the cheapest level that can see the bug: unit for rules and pure policies, e2e for what only the DB decides.</li>
<li>Check the checker: the suite must be green on correct code before any red means something (CrowdStrike 2024).</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Lab</span>
<h2>8.5 — Test tốt tới đâu? Cài tám lỗi rồi đếm</h2>
<p class="lead">"Test xanh hết" chẳng nói gì về số lỗi mà bộ test sẽ bắt được. Cách trung thực để biết là cố tình cài lỗi rồi đếm xem bao nhiêu lỗi làm bộ test đỏ — kiểm thử đột biến (mutation testing), ở đây làm tay với tám đột biến sát thực tế. Rồi bạn viết những test còn thiếu, bằng ba kỹ thuật của chương này, cho tới khi mọi đột biến đều bị bắt.</p>

<h3>Mục tiêu và tiêu chí đạt</h3>
<ul>
<li>Điểm xuất phát: dự án sau mốc 7 với cách dựng test của mốc 8 (bài 8.3: <code>taoApp()</code>, mỗi worker một DB) — 31 test xanh.</li>
<li><strong>Đạt</strong>: script dưới đây báo bắt <strong>8/8</strong>, bộ test xanh trên mã chưa sửa, và mỗi test mới có tên mà người review hiểu được không cần đọc mã.</li>
</ul>

<h3>Bước 1 — script đột biến</h3>
<p>Mỗi đột biến là một thay đổi chữ nhỏ kiểu người thật hay mắc: <code>&lt;=</code> viết thành <code>&lt;</code>, thiếu một giá trị trong danh sách, rơi mất một điều kiện. Script cài một đột biến, chạy cả bộ test, trả tệp về như cũ và in xem bộ test có bắt được không:</p>
<pre><code class="language-python">${esc(MA_DB)}</code></pre>

<h3>Bước 2 — chạy với bộ test đang có</h3>
<p>Đoán trước: 31 test của mốc 7 bắt được mấy trong tám?</p>
<details><summary>Xem kết quả</summary>
<div class="out">${esc(OUT_TRUOC)}</div>
<p><strong>Không lỗi nào.</strong> Test của mốc 7 là test tốt — mỗi test kiểm một luật thật qua HTTP — nhưng chúng đi đường chính: lịch lúc 07:30, năm người, duyệt một lần, route <em>có</em> khai quyền. Không test nào đứng ngay trên biên, không test nào duyệt hai lần cùng một version, không test nào gọi route chưa khai. Còn đây là độ phủ của chính bộ test đó:</p>
<div class="out">${esc(OUT_PHU)}</div>
<p><code>booking.policy.ts</code> và <code>perm.guard.ts</code> đạt 100% dòng trong khi đột biến M5 và M6 nằm đúng trong hai tệp đó vẫn sống. Độ phủ cho biết dòng nào đã chạy, không cho biết sai sót nào sẽ bị phát hiện.</p>
</details>

<h3>Bước 3 — viết test (tự làm trước)</h3>
<p>Mỗi đột biến một test, ở mức rẻ nhất mà vẫn bắt được. Gợi ý:</p>
<table>
<tr><th>Đột biến</th><th>Mức</th><th>Gợi ý</th></tr>
<tr><td>M1, M2</td><td>đơn vị (8.1)</td><td>Đồng hồ cố định 08:00; đặt đúng 08:00; đặt đúng 30 trên 30 chỗ.</td></tr>
<tr><td>M4</td><td>đơn vị (8.1)</td><td>Đua thật không tất định; khẳng định câu UPDATE có điều kiện <code>version</code> và <code>count: 0</code> nghĩa là 409.</td></tr>
<tr><td>M5</td><td>guard (8.2)</td><td>Handler không decorator ⇒ 403 <code>ROUTE_NOT_DECLARED</code>. Ứng dụng không có route nào như vậy — vì thế chỉ test đơn vị phủ được.</td></tr>
<tr><td>M6</td><td>policy (8.2)</td><td>Ability của CASL là hàm thuần: một bảng qua bốn trạng thái.</td></tr>
<tr><td>M7</td><td>filter (8.2)</td><td>Một lỗi lạ có thông điệp chứa tên bảng.</td></tr>
<tr><td>M3, M8</td><td>e2e (8.3)</td><td>Từ chối một lịch rồi đọc danh sách bận của phòng; đăng nhập với email viết hoa.</td></tr>
</table>
<details><summary>Xem lời giải — đơn vị</summary>
<pre><code class="language-ts">${esc(MA_L1)}</code></pre>
</details>
<details><summary>Xem lời giải — guard, policy, filter</summary>
<pre><code class="language-ts">${esc(MA_L2)}</code></pre>
</details>
<details><summary>Xem lời giải — e2e</summary>
<pre><code class="language-ts">${esc(MA_L3)}</code></pre>
</details>

<h3>Bước 4 — chạy lại script</h3>
<details><summary>Xem kết quả</summary>
<div class="out">${esc(OUT_SAU)}</div>
<p>14 test mới (tổng 45), bắt 8/8, mỗi đột biến bị đúng một test bắt — đó là điều bạn muốn: test đỏ gọi đúng tên luật bị hỏng. Các test mới tốn chưa tới một giây; chỉ hai test cần HTTP và DB.</p>
</details>

<h3>Thử phá: bộ kiểm tra có lỗi</h3>
<p>Lần đầu chạy lab này, script báo 8/8 ngay — khi lời giải còn chưa đúng. Hai lý do, đều có thật: một test lời giải khẳng định sai (đỏ trên mã đúng), và ở một lượt khác biến môi trường <code>DATABASE_URL_TEST</code> bị thiếu nên <em>mọi</em> lượt chạy đều chết ở global setup. Bộ test đỏ sẵn thì "bắt" được mọi đột biến. Vì vậy script giờ chạy bộ test trên mã chưa sửa trước và dừng nếu nó không xanh — đúng phép kiểm bạn nên làm trước khi tin bất kỳ tín hiệu xanh/đỏ nào, kể cả CI.</p>

<h3>🕵️ Sự cố thật — khi chính bộ kiểm tra có lỗi (CrowdStrike, 19/07/2024)</h3>
<p>Ngày 19/07/2024, một bản cập nhật nội dung của CrowdStrike Falcon làm sập hàng triệu máy Windows khắp thế giới; hãng bay, bệnh viện, ngân hàng ngừng hoạt động. Báo cáo nguyên nhân gốc của CrowdStrike (06/08/2024) tả một lỗ hổng kiểm thử rất giống lab này: một kiểu mẫu mới khai <strong>21</strong> trường đầu vào, đoạn mã gọi nó chỉ cấp <strong>20</strong>, và <strong>Content Validator</strong> tự động — phép kiểm lẽ ra phải chặn nội dung hỏng — có lỗi logic nên cho bản mẫu đó qua. Trình cảm biến đọc phần tử thứ 21 ngoài mảng và nhân hệ điều hành sập. Chưa test nào từng chạy đúng tổ hợp đầu vào thật với mã thật đó. Bài học cho dân backend: phép kiểm không thể đỏ thì không phải phép kiểm (chứng minh test của bạn đỏ được, như lab này); hãy test đúng ranh giới giữa thứ được khai báo và thứ thực sự được truyền (M2, cột ghi chú ở bài 8.6); và phát hành dần dần — CrowdStrike nay đã phát hành cập nhật nội dung theo từng đợt.</p>

<h3>Liên hệ đời thường: nút thử của máy báo khói</h3>
<p>Máy báo khói chưa bao giờ kêu có thể vì nhà chưa từng cháy — hoặc vì nó hết pin. Nút thử tồn tại để phân biệt hai chuyện đó. Đột biến chính là nút thử của bộ test.</p>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Độ phủ 90% thì mã đã được test kỹ chưa?</strong> Chưa chắc: trong lab này, 89% độ phủ dòng bắt được 0 trên 8 lỗi cài sẵn. Độ phủ tìm mã chưa test; đột biến đo xem test có kiểm gì không.</li>
<li><strong>Kiểm thử đột biến là gì?</strong> Tự động đổi nhỏ mã nguồn rồi kiểm rằng mỗi thay đổi làm ít nhất một test đỏ; đột biến sống sót chỉ ra khẳng định còn thiếu. Công cụ: Stryker cho JS/TS.</li>
<li><strong>Bạn thêm test nào cho một module Nest trước?</strong> Biên của luật nghiệp vụ (đơn vị), nhánh mặc định từ chối của guard và policy (đơn vị), và vài test e2e cho thứ chỉ DB quyết định được.</li>
<li><strong>Làm sao biết một test có thể đỏ?</strong> Thấy nó đỏ một lần: viết nó trước khi sửa lỗi, hoặc cố tình làm hỏng mã.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Trước một đợt phát hành, đội QA phía khách hàng hỏi "sao các bạn biết test của mình tốt?". Đưa báo cáo độ phủ thì sẽ có câu hỏi tiếp theo. Đưa một bảng ngắn — "cài 8 lỗi điển hình, bắt 8, đây là script" — thì cuộc bàn kết thúc. Với mã nguồn lớn, chạy Stryker (khoá Testing 8.2) cho riêng module quan trọng nhất; chạy toàn bộ rất chậm.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đột biến (mutant)</span><span class="v">Bản sao của mã với một thay đổi nhỏ có chủ ý.</span></div>
  <div class="kv"><span class="k">Bị bắt / sống sót</span><span class="v">Ít nhất một test đỏ / mọi test vẫn xanh khi có đột biến.</span></div>
  <div class="kv"><span class="k">Giá trị biên</span><span class="v">Giá trị đúng tại giới hạn (08:00 khi bây giờ là 08:00, 30 trên 30 chỗ).</span></div>
  <div class="kv"><span class="k">Mặc định từ chối</span><span class="v">Nhánh của guard cho route chưa khai — phải có test riêng.</span></div>
  <div class="kv"><span class="k">Lượt chạy gốc</span><span class="v">Chạy bộ test trên mã chưa sửa trước; lượt gốc đỏ thì mọi kết quả sau đều vô nghĩa.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>31 test xanh, 89% độ phủ dòng, bắt 0/8 lỗi cài sẵn.</li>
<li>14 test nhắm đúng chỗ — phần lớn là test đơn vị, hai test e2e — bắt 8/8.</li>
<li>Chọn mức rẻ nhất nhìn thấy được lỗi: đơn vị cho luật và policy thuần, e2e cho thứ chỉ DB quyết định.</li>
<li>Kiểm cả bộ kiểm: bộ test phải xanh trên mã đúng thì màu đỏ mới có nghĩa (CrowdStrike 2024).</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
