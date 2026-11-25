/**
 * 12.4 — Hàng đợi và thời gian thực cho dự án cuối: nhắc trước một ngày (đúng đề), đổi giờ mở cửa ⇒ báo từng chủ lịch qua BullMQ
 * + bảng phòng nhận "room-hours" qua Socket.IO (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, BullMQ 6.7.8, Socket.IO 4.8, Redis 7.4, PostgreSQL 16): lab/c12/moc12 — test
 * src/notifications/moc12.e2e.spec.ts; ../o12db.sh ⇒ lab/c12/o/124-*.txt. Ghép: gen.mjs rồi ghep.sh 124 nst-12-4-hang-doi-realtime.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-9-4-lab', title: 'NestJS 9.4 — Lab: giết worker giữa chừng', sub: 'Bốn bước idempotent và phép thử SIGKILL — mục rubric "không gửi trùng".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-3-events', title: 'NestJS 9.3 — Sự kiện trong tiến trình', sub: 'Vì sao module đặt lịch phát sự kiện thay vì gọi thẳng thông báo.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-10-2-ws-auth-scale', title: 'NestJS 10.2 — Xác thực socket, Redis adapter', sub: 'Hai bản API cùng phát cho mọi socket — nền của "room-hours".', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('📘', 'BullMQ Docs — Job Ids', 'jobId tự đặt chống thêm trùng; không dùng dấu ":".', 'https://docs.bullmq.io/guide/jobs/job-ids'),
].join('\n');
const MA_EV = "/** mốc 12: admin đổi giờ mở cửa; bookingIds = lịch sắp tới nằm ngoài giờ mới (không bị huỷ — chủ lịch được báo) */\nexport class RoomHoursChanged {\n  static readonly TEN = 'room.hours-changed';\n  constructor(readonly roomId: number, readonly open: string, readonly close: string, readonly bookingIds: number[]) {}\n}";
const MA_Q = "  /** mốc 12: một job cho mỗi lịch bị ảnh hưởng. jobId gồm cả giờ mới ⇒ admin bấm lại cùng giờ không thêm job; đổi giờ khác thì báo lần nữa */\n  async doiGio(e: RoomHoursChanged) {\n    const ma = `${e.open}${e.close}`.replaceAll(':', '');                       // BullMQ không nhận ':' trong jobId tự đặt\n    await this.q.addBulk(e.bookingIds.map((bookingId) => ({ name: 'doigio', data: { bookingId, open: e.open, close: e.close }, opts: { jobId: `doigio-${bookingId}-${ma}` } })));\n  }\n  // … (trong ThongBaoListener)\n  @OnEvent(RoomHoursChanged.TEN, { suppressErrors: false })\n  khiDoiGio(e: RoomHoursChanged) { return e.bookingIds.length ? this.thongBao.doiGio(e) : undefined; }";
const MA_P = "const TIEU_DE: Record<string, (id: number, phong: string, j: ThongBaoJob) => string> = {\n  duyet: (id, p) => `Lịch #${id} (phòng ${p}) đã được duyệt`,\n  nhac: (id, p) => `Nhắc: lịch #${id} ở phòng ${p} sắp bắt đầu`,\n  doigio: (id, p, j) => `Phòng ${p} đổi giờ mở cửa ${j.open}–${j.close}: lịch #${id} nằm ngoài giờ mới, hãy đổi hoặc huỷ`,   // mốc 12\n};\n// mốc 12: mỗi loại job tự nói lịch phải ở trạng thái nào LÚC CHẠY mới còn đáng gửi (doigio: lịch chờ duyệt cũng phải được báo)\nconst CON_HIEU_LUC: Record<string, string[]> = { duyet: ['APPROVED'], nhac: ['APPROVED'], doigio: ['PENDING', 'APPROVED'] };\n// email_log.kind (≤ 10 ký tự) — doigio kèm giờ mới: \"g08002000\" ⇒ mỗi lần đổi giờ khác nhau là một email riêng\nconst loai = (name: string, j: ThongBaoJob) => (name === 'doigio' ? `g${j.open}${j.close}`.replaceAll(':', '') : name);\n// …\n  async process(job: Job<ThongBaoJob>) {\n    const tieuDe = TIEU_DE[job.name];\n    if (!tieuDe) throw new Error(`job lạ: ${job.name}`);\n    const { bookingId } = job.data, kind = loai(job.name, job.data);\n    const b = await this.db.booking.findUnique({ where: { id: bookingId }, include: { user: true, room: true } });\n    if (!b || !CON_HIEU_LUC[job.name].includes(b.status) || !b.user) return `bỏ qua: ${b?.status ?? 'không có lịch'}`;   // 1. trạng thái LÚC CHẠY\n    if (await this.db.emailLog.findUnique({ where: { bookingId_kind: { bookingId, kind } } })) return 'bỏ qua: đã gửi';         // 2.\n    const kq = await this.mailer.gui(b.user.email, tieuDe(bookingId, b.room.code, job.data), `${kind}:${bookingId}`);          // 3.\n    await this.db.emailLog.createMany({ data: [{ bookingId, kind }], skipDuplicates: true });                                    // 4.\n    return kq;\n  }";
const MA_RT = "  @OnEvent(RoomHoursChanged.TEN)                                   // mốc 12: bảng phòng vẽ lại vùng giờ mở cửa ngay\n  khiDoiGio(e: RoomHoursChanged) { this.gw.phatGio({ roomId: e.roomId, open: e.open, close: e.close }); }";
const OUT_ENV = " FAIL  |unit| src/config/env.schema.spec.ts > EnvSchema của lab-booking (mốc 5 → 10) > dev: mặc định đủ\nAssertionError: expected { NODE_ENV: 'development', …(16) } to deeply equal { NODE_ENV: 'development', …(16) }\n-   \"NHAC_TRUOC_PHUT\": 30,\n+   \"NHAC_TRUOC_PHUT\": 1440,\n      Tests  1 failed | 67 passed (68)";
const OUT_MOC9 = "⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  |db| src/notifications/moc9.e2e.spec.ts > email nhắc: hẹn đúng 30 phút trước giờ bắt đầu; huỷ lịch ⇒ gỡ job nhắc\nTypeError: Cannot read properties of undefined (reading 'name')\n      Tests  1 failed | 3 passed (4)";
const MA_T4 = "// notifications/moc12.e2e.spec.ts — mốc 12: nhắc trước MỘT NGÀY (đề 0.2) và đổi giờ mở cửa ⇒ báo chủ lịch qua hàng đợi + bảng phòng cập nhật\nprocess.env.APP_ROLE = 'all';                                       // worker chạy chung tiến trình (như moc9)\nimport request from 'supertest';\nimport { io, type Socket } from 'socket.io-client';\nimport { getQueueToken } from '@nestjs/bullmq';\nimport type { Queue } from 'bullmq';\nimport { Redis } from 'ioredis';\nimport type { NestExpressApplication } from '@nestjs/platform-express';\nimport { taoApp } from '../test/tao-app.js';\nimport { bearer } from '../test/auth.js';\nimport { PrismaService } from '../prisma/prisma.service.js';\n\nconst bayGio = new Date('2026-12-01T00:00:00Z');                    // 07:00 giờ VN\nlet app: NestExpressApplication, r: Redis, q: Queue, db: PrismaService, url: string;\nbeforeAll(async () => {\n  r = new Redis(process.env.REDIS_URL!); await r.flushdb();\n  app = await taoApp({ now: () => bayGio }); await app.listen(0, '127.0.0.1'); url = await app.getUrl();\n  q = app.get(getQueueToken('thong-bao')); db = app.get(PrismaService);\n});\nafterAll(async () => { await app.close(); await r.quit(); });\nconst http = () => request(app.getHttpServer());\nconst dat = async (ai: 'an' | 'binh', ngay: string, tu: string, den: string) => (await http().post('/bookings').set(bearer(app, ai))\n  .send({ roomId: 1, start: `2026-12-${ngay}T${tu}:00+07:00`, end: `2026-12-${ngay}T${den}:00+07:00`, attendees: 3 }).expect(201)).body.id as number;\nconst cho = async (dk: () => Promise<boolean>, ms = 5000) => { for (const t0 = Date.now(); Date.now() - t0 < ms;) { if (await dk()) return; await new Promise((ok) => setTimeout(ok, 50)); } throw new Error('hết giờ chờ'); };\n\nit('đề 0.2 \"nhắc trước một ngày\": duyệt lịch 03/12 09:00 ⇒ job nhắc hẹn đúng 02/12 09:00 (giờ VN)', async () => {\n  const id = await dat('an', '03', '09:00', '10:00');\n  await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'gv')).expect(200);\n  const job = (await q.getJob(`nhac-${id}`))!;\n  expect(new Date(bayGio.getTime() + job.opts.delay!).toISOString()).toBe('2026-12-02T02:00:00.000Z');   // 09:00 VN\n});\nit('duyệt khi còn chưa tới một ngày ⇒ không hẹn nhắc (người đặt vừa nhận email duyệt — nhắc ngay lúc đó là hai email liền nhau)', async () => {\n  const id = await dat('an', '01', '15:00', '16:00');\n  await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'gv')).expect(200);\n  expect(await q.getJob(`nhac-${id}`)).toBeUndefined();\n});\n\nit('admin thu hẹp giờ ⇒ mỗi chủ lịch bị ảnh hưởng nhận đúng 1 email; bấm lại cùng giờ không gửi thêm; bảng phòng nhận room-hours', async () => {\n  const a = await dat('binh', '05', '07:00', '08:00');               // chờ duyệt — vẫn phải được báo\n  const b = await dat('binh', '05', '10:00', '11:00');               // trong giờ mới — không báo\n  await r.del('hopthu');\n  const s: Socket = io(url, { transports: ['websocket'], reconnection: false, auth: { token: bearer(app, 'an').authorization.slice(7) }, extraHeaders: { Origin: 'http://localhost:5173' } });\n  const gio: unknown[] = []; s.on('room-hours', (g) => gio.push(g));\n  await new Promise((ok) => s.on('connect', ok));\n  expect((await s.emitWithAck('watch-room', 1)).ok).toBe(true);\n  try {\n    const kq = await http().put('/rooms/1/hours').set(bearer(app, 'admin')).send({ open: '08:00', close: '21:00' }).expect(200);\n    expect(kq.body.ngoaiGioMoi).toContain(a);\n    expect(kq.body.ngoaiGioMoi).not.toContain(b);\n    await cho(async () => (await r.lrange('hopthu', 0, -1)).some((x) => x.includes(`#${a} `)));\n    await http().put('/rooms/1/hours').set(bearer(app, 'admin')).send({ open: '08:00', close: '21:00' }).expect(200);   // bấm lại\n    await new Promise((ok) => setTimeout(ok, 500));\n    const thu = (await r.lrange('hopthu', 0, -1)).filter((x) => x.includes(`#${a} `));\n    expect(thu).toEqual([`binh@fpt.edu.vn | Phòng AL-201 đổi giờ mở cửa 08:00–21:00: lịch #${a} nằm ngoài giờ mới, hãy đổi hoặc huỷ`]);\n    expect((await r.lrange('hopthu', 0, -1)).some((x) => x.includes(`#${b} `))).toBe(false);\n    expect(await db.emailLog.findMany({ where: { bookingId: a }, select: { kind: true } })).toEqual([{ kind: 'g08002100' }]);\n    // lớp 1 (jobId) riêng: thiếu nó thì email_log vẫn chặn email trùng — nhưng hàng đợi chạy job thừa. Đếm job để lớp này cũng có test\n    const jobs = await q.getJobs(['completed', 'waiting', 'active', 'delayed']);\n    expect(jobs.filter((j) => j.name === 'doigio' && j.data.bookingId === a)).toHaveLength(1);\n    expect(gio[0]).toEqual({ roomId: 1, open: '08:00', close: '21:00' });\n  } finally {\n    s.close();\n    await http().put('/rooms/1/hours').set(bearer(app, 'admin')).send({ open: '07:00', close: '21:00' }).expect(200);\n  }\n});";
const OUT_PHA4 = "# THỬ PHÁ 1: CON_HIEU_LUC.doigio chỉ còn ['APPROVED']\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nError: Test timed out in 5000ms.\n      Tests  1 failed | 2 passed (3)\n# THỬ PHÁ 2: bỏ jobId của job doigio — test cũ VẪN XANH\n      Tests  3 passed (3)\n# thêm phép đếm job, thử phá lại\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected [ Job{ …(23) }, Job{ …(23) } ] to have a length of 1 but got 2\n      Tests  1 failed | 2 passed (3)";
const OUT_XANH4 = " Test Files  14 passed (14)\n      Tests  68 passed (68)";

export default {
  title: '12.4 — Queue and real time: approval notifications and a live board|||12.4 — Hàng đợi và thời gian thực: thông báo duyệt và bảng trực tiếp',
  slug: 'nst-12-4-hang-doi-realtime',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Phần bất đồng bộ đã có từ chương 9–10 (job có thử lại, giết worker vẫn không gửi trùng, socket qua Redis adapter) — bài này chỉ lấp chỗ đề còn thiếu: nhắc trước một ngày thay vì 30 phút, và khi admin đổi giờ mở cửa thì từng chủ lịch bị ảnh hưởng nhận đúng một email qua BullMQ còn bảng phòng cập nhật ngay. Hai test cũ đỏ đúng lý do; một lần thử phá vẫn xanh làm lộ lớp bảo vệ chưa có test.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 4</span>
<h2>12.4 — Finish the async part of the brief, and test every layer</h2>
<p class="lead">The rubric's async line (10 points) asks for a job with retries and live updates, and the panel kills the worker to see whether emails are duplicated. That machinery exists since chapters 9 and 10 — the SIGKILL experiment is lesson 9.4, do not rebuild it. What the brief still lacks: the reminder is sent 30 minutes before instead of one day (US-08), and a change of opening hours reaches nobody (US-05 says affected bookings must be reported).</p>

<h3>Everyday analogy: the notice board and the text message</h3>
<p>When the faculty office changes the lab's hours, it pins a notice on the board (everyone looking at the room sees it at once — the socket event) and texts each student whose booking is affected (one message per person, never two for the same change — the queued email). Pinning the same notice twice is harmless; texting twice is spam.</p>

<h3>1. "One day before" — a number that two tests pinned</h3>
<p>The default <code>NHAC_TRUOC_PHUT</code> changes from 30 to 1440. Two tests reacted:</p>
<pre><code class="language-text">${esc(OUT_ENV)}</code></pre>
<p>Expected: the config test pins every default so that changing one is a conscious act. Then the milestone-9 reminder test:</p>
<pre><code class="language-text">${esc(OUT_MOC9)}</code></pre>
<p>Red for the right reason — its booking starts in 4 hours, so with a one-day lead no reminder job exists — but with a poor message: <code>getJob()</code> returned <code>undefined</code> and the test crashed on <code>.name</code>. That test checks the <em>mechanism</em> (delay computed, job removed on cancel), so it now sets <code>NHAC_TRUOC_PHUT=30</code> explicitly at the top of its file, and two new tests check the <em>requirement</em>:</p>
<ul>
<li>approve a booking on 03/12 at 09:00 ⇒ the reminder job is due exactly 02/12 09:00 Vietnam time;</li>
<li>approve when less than a day is left ⇒ no reminder (the owner has just received the approval email; a reminder at the same moment would be two emails in a row — a decision worth an ADR line).</li>
</ul>

<h3>2. Opening hours changed ⇒ an event, two listeners</h3>
<p><code>RoomsService.setHours()</code> (12.3) already knows the affected booking ids. It emits one event after the update; the rooms module does not know email or sockets exist:</p>
<pre><code class="language-ts">${esc(MA_EV)}</code></pre>
<p>Notifications turn it into one job per booking. The job id includes the new hours: pressing "save" twice with the same hours adds nothing; a different change is a new notice. BullMQ rejects custom ids containing <code>:</code> (its source throws <code>Custom Id cannot contain :</code>), hence <code>0800</code> rather than <code>08:00</code>:</p>
<pre><code class="language-ts">${esc(MA_Q)}</code></pre>
<p>The processor needed two changes. Step 1 of the idempotent recipe checks the booking's status <em>when the job runs</em> — but "approved only" is wrong for this kind: a pending request outside the new hours must be reported too. And <code>email_log.kind</code> includes the hours so each distinct change can be sent once:</p>
<pre><code class="language-ts">${esc(MA_P)}</code></pre>
<p>Real time is one listener and one emit to the room's socket room:</p>
<pre><code class="language-ts">${esc(MA_RT)}</code></pre>

<h3>3. Tests — and a break that stayed green</h3>
<pre><code class="language-ts">${esc(MA_T4)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA4)}</code></pre>
<p>Removing <code>PENDING</code> from the allowed statuses: the email never arrives and the test times out — caught. Removing the job id: <strong>still green</strong>. The second click enqueued a second job, the processor hit step 2 (<code>email_log</code> already has the row) and sent nothing. Two layers protect against duplicates, and the test only proved the second one. A layer without a test will be deleted one day by someone "simplifying", so the test now also counts <code>doigio</code> jobs for the booking — and the break goes red.</p>
<pre><code class="language-text">${esc(OUT_XANH4)}</code></pre>

<h3>🧪 Exercise (40 min)</h3>
<p>Add US-04b: "a lecturer gets one email when a new pending request arrives in a room they manage". Use an event from <code>BookingsService.create()</code>, a job with a deterministic id, and a test that checks both the mailbox and the job count. Then break each layer once.</p>
<details><summary>Show hints</summary>
<ul>
<li>Event: <code>BookingCreated(bookingId, roomId)</code>; the listener looks up the room's manager — a room without a manager sends nothing.</li>
<li>Job id <code>moi-&lt;bookingId&gt;</code>, kind <code>moi</code> in <code>email_log</code>; step 1 allows only <code>PENDING</code> (if it was cancelled before the job ran, skip).</li>
<li>Three breaks to try: no job id, no email_log check, wrong status list.</li>
</ul>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"How do you avoid duplicate emails?"</strong> — Layers: deterministic job id, a unique row in <code>email_log</code> checked before sending, the provider's idempotency key. And a test per layer — the green break above.</li>
<li><strong>"How do you test a reminder due tomorrow without waiting?"</strong> — Inject the clock and assert the job's delay/due time; the delivery itself is tested by running the processor directly.</li>
<li><strong>"Why an event instead of calling the notification service?"</strong> — The rule module stays ignorant of email and sockets; adding a listener does not touch tested booking code (12.2: nothing imports BookingsModule).</li>
</ol>

<h3>💼 On the job</h3>
<p>Requirements like "remind one day before" often get implemented with whatever default the first developer picked, and nobody notices until a user complains. When you take over a module, grep for config defaults and compare them with the spec — it is one of the cheapest ways to find bugs that every test still passes.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">At-least-once delivery</span><span class="v">A job may run more than once; the handler must be idempotent.</span></div>
  <div class="kv"><span class="k">Deterministic job id</span><span class="v">The id is derived from the data, so enqueuing the same thing twice is one job.</span></div>
  <div class="kv"><span class="k">Defence in depth</span><span class="v">Several independent layers against one failure — each needs its own test.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Reminder default 30 → 1440 minutes; two tests went red for the right reason; the mechanism test now pins its own value.</li>
<li>Hours changed ⇒ one event, a job per affected booking (id includes the new hours) and a <code>room-hours</code> socket event.</li>
<li>Removing the job id stayed green; a job-count assertion now covers that layer. 68/68 green.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 4</span>
<h2>12.4 — Làm nốt phần bất đồng bộ của đề, và test từng lớp</h2>
<p class="lead">Dòng rubric bất đồng bộ (10 điểm) đòi một job có thử lại và cập nhật trực tiếp, và hội đồng sẽ giết worker để xem email có bị gửi trùng không. Bộ máy đó đã có từ chương 9 và 10 — phép thử SIGKILL là bài 9.4, đừng dựng lại. Thứ đề còn thiếu: email nhắc gửi trước 30 phút thay vì một ngày (US-08), và đổi giờ mở cửa thì không ai được báo (US-05 ghi lịch bị ảnh hưởng phải được báo).</p>

<h3>Liên hệ đời thường: bảng tin và tin nhắn riêng</h3>
<p>Khi văn phòng khoa đổi giờ mở cửa phòng lab, họ dán thông báo lên bảng tin (ai đang nhìn phòng đó cũng thấy ngay — sự kiện socket) và nhắn riêng cho từng sinh viên có lịch bị ảnh hưởng (mỗi người một tin, không bao giờ hai tin cho cùng một lần đổi — email qua hàng đợi). Dán cùng một thông báo hai lần thì vô hại; nhắn hai lần là làm phiền.</p>

<h3>1. "Trước một ngày" — một con số bị hai test ghim</h3>
<p>Giá trị mặc định <code>NHAC_TRUOC_PHUT</code> đổi từ 30 sang 1440. Hai test phản ứng:</p>
<pre><code class="language-text">${esc(OUT_ENV)}</code></pre>
<p>Đúng như mong đợi: test cấu hình ghim mọi giá trị mặc định để việc đổi một cái phải là hành động có ý thức. Rồi tới test nhắc lịch của mốc 9:</p>
<pre><code class="language-text">${esc(OUT_MOC9)}</code></pre>
<p>Đỏ đúng lý do — lịch trong test bắt đầu sau 4 giờ, với khoảng nhắc một ngày thì không có job nhắc nào — nhưng thông báo tệ: <code>getJob()</code> trả <code>undefined</code> và test vỡ ở <code>.name</code>. Test đó kiểm <em>cơ chế</em> (tính độ trễ, gỡ job khi huỷ), nên giờ nó tự đặt <code>NHAC_TRUOC_PHUT=30</code> ngay đầu tệp, còn hai test mới kiểm <em>yêu cầu</em>:</p>
<ul>
<li>duyệt lịch 09:00 ngày 03/12 ⇒ job nhắc đến hạn đúng 09:00 ngày 02/12 giờ Việt Nam;</li>
<li>duyệt khi còn chưa tới một ngày ⇒ không nhắc (người đặt vừa nhận email duyệt; nhắc ngay lúc đó là hai email liền nhau — một quyết định đáng một dòng ADR).</li>
</ul>

<h3>2. Đổi giờ mở cửa ⇒ một sự kiện, hai bên nghe</h3>
<p><code>RoomsService.setHours()</code> (bài 12.3) đã biết id các lịch bị ảnh hưởng. Nó phát một sự kiện sau khi cập nhật; module phòng không hề biết có email hay socket:</p>
<pre><code class="language-ts">${esc(MA_EV)}</code></pre>
<p>Phần thông báo biến sự kiện thành mỗi lịch một job. Id của job chứa giờ mới: bấm "lưu" hai lần cùng giờ thì không thêm gì; đổi sang giờ khác là một thông báo mới. BullMQ từ chối id tự đặt có dấu <code>:</code> (mã nguồn của nó ném <code>Custom Id cannot contain :</code>), nên viết <code>0800</code> thay vì <code>08:00</code>:</p>
<pre><code class="language-ts">${esc(MA_Q)}</code></pre>
<p>Processor cần sửa hai chỗ. Bước 1 của công thức idempotent kiểm trạng thái lịch <em>lúc job chạy</em> — nhưng "chỉ lịch đã duyệt" là sai với loại job này: lịch chờ duyệt nằm ngoài giờ mới cũng phải được báo. Và <code>email_log.kind</code> chứa cả giờ mới, để mỗi lần đổi khác nhau được gửi đúng một lần:</p>
<pre><code class="language-ts">${esc(MA_P)}</code></pre>
<p>Phần thời gian thực chỉ là một listener và một lần phát vào phòng socket của phòng lab:</p>
<pre><code class="language-ts">${esc(MA_RT)}</code></pre>

<h3>3. Test — và một lần thử phá vẫn xanh</h3>
<pre><code class="language-ts">${esc(MA_T4)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA4)}</code></pre>
<p>Bỏ <code>PENDING</code> khỏi danh sách trạng thái hợp lệ: email không bao giờ tới và test hết giờ chờ — bắt được. Bỏ id của job: <strong>vẫn xanh</strong>. Lần bấm thứ hai xếp thêm một job, processor gặp bước 2 (<code>email_log</code> đã có dòng đó) và không gửi gì. Có hai lớp chống trùng, còn test chỉ chứng minh lớp thứ hai. Một lớp không có test thì sớm muộn sẽ bị ai đó "rút gọn" mất, nên test giờ đếm thêm số job <code>doigio</code> của lịch đó — và lần phá đó đỏ.</p>
<pre><code class="language-text">${esc(OUT_XANH4)}</code></pre>

<h3>🧪 Thực hành (40 phút)</h3>
<p>Thêm US-04b: "giảng viên nhận một email khi có lịch chờ duyệt mới ở phòng mình phụ trách". Dùng một sự kiện phát từ <code>BookingsService.create()</code>, một job có id tất định, và một test kiểm cả hộp thư lẫn số job. Rồi phá từng lớp một lần.</p>
<details><summary>Xem gợi ý</summary>
<ul>
<li>Sự kiện: <code>BookingCreated(bookingId, roomId)</code>; listener tra người quản lý phòng — phòng không có người quản lý thì không gửi.</li>
<li>Id job <code>moi-&lt;bookingId&gt;</code>, kind <code>moi</code> trong <code>email_log</code>; bước 1 chỉ nhận <code>PENDING</code> (đã huỷ trước khi job chạy thì bỏ qua).</li>
<li>Ba lần phá nên thử: bỏ id job, bỏ bước kiểm email_log, sai danh sách trạng thái.</li>
</ul>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Bạn chống gửi trùng email thế nào?"</strong> — Nhiều lớp: id job tất định, một dòng duy nhất trong <code>email_log</code> kiểm trước khi gửi, khoá idempotency của nhà cung cấp. Và mỗi lớp một test — chuyện lần phá vẫn xanh ở trên.</li>
<li><strong>"Test email nhắc ngày mai mà không phải chờ thế nào?"</strong> — Tiêm đồng hồ và khẳng định độ trễ / thời điểm đến hạn của job; việc gửi thì test bằng cách gọi thẳng processor.</li>
<li><strong>"Sao dùng sự kiện mà không gọi thẳng service thông báo?"</strong> — Module luật không biết gì về email hay socket; thêm một listener không đụng tới mã đặt lịch đã có test (12.2: không ai import BookingsModule).</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Yêu cầu kiểu "nhắc trước một ngày" hay bị làm theo bất kỳ giá trị mặc định nào người viết đầu tiên chọn, và không ai để ý cho tới khi người dùng phàn nàn. Khi nhận bàn giao một module, hãy grep các giá trị cấu hình mặc định rồi so với đặc tả — đó là một trong những cách rẻ nhất để tìm lỗi mà mọi test vẫn xanh.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Giao ít nhất một lần</span><span class="v">Một job có thể chạy hơn một lần; bộ xử lý phải idempotent.</span></div>
  <div class="kv"><span class="k">Id job tất định</span><span class="v">Id suy ra từ dữ liệu, nên xếp cùng một việc hai lần vẫn chỉ là một job.</span></div>
  <div class="kv"><span class="k">Phòng thủ nhiều lớp</span><span class="v">Nhiều lớp độc lập chống cùng một hỏng hóc — lớp nào cũng cần test riêng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mặc định nhắc đổi 30 → 1440 phút; hai test đỏ đúng lý do; test cơ chế giờ tự ghim giá trị của nó.</li>
<li>Đổi giờ ⇒ một sự kiện, mỗi lịch bị ảnh hưởng một job (id chứa giờ mới) và một sự kiện socket <code>room-hours</code>.</li>
<li>Bỏ id job vẫn xanh; thêm phép đếm job để lớp đó cũng có test. 68/68 xanh.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
