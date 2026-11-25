/**
 * 8.1 — Test đơn vị với Test.createTestingModule, overrideProvider và mock (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, Vitest 4.1.12; PostgreSQL 16.16 cho thí nghiệm "mock nói dối"):
 * scratchpad/nst/lab/c8/moc8/src/thu/b81 — don-vi.spec (new trực tiếp vs TestingModule, 4 xanh), bay.spec (thiếu provider, useMocker,
 * get()/resolve() với scope REQUEST, compile() chưa gọi onModuleInit, useValue thiếu hàm ⇒ TypeError), mock-noi-doi.spec ('CANCELED':
 * mock xanh, DB thật đỏ), bt.spec (setStatus 4 xanh). Chạy: lab/c8/o.sh 81-… vitest.thu.config.ts b81/…
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Testing 3.1 — Stub, mock, spy, fake', sub: 'Bốn loại "đồ giả" là gì — bài này dùng chúng trong TestingModule mà không giảng lại.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-3-qua-da', title: 'Testing 3.3 — Khi mock làm test vô giá trị', sub: 'Một lỗi cài sẵn, một thay đổi vô hại: thước đo để biết mình mock quá tay.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-2-provider', title: 'NestJS 2.2 — Sáu kiểu provider', sub: 'useValue/useClass/useFactory — đúng những thứ overrideProvider dùng lại.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'NestJS docs — Testing', 'Test.createTestingModule, overrideProvider, useMocker, resolve() cho provider có scope.', 'https://docs.nestjs.com/fundamentals/testing'),
  nguon('📘', 'Vitest — Mocking', 'vi.fn, mockResolvedValue, vi.mocked, resetAllMocks.', 'https://vitest.dev/guide/mocking'),
].join('\n');
const MA_DONVI = "// b81/don-vi.spec.ts — BookingsService KHÔNG cần PostgreSQL: thay PrismaService và Clock\nimport { Test } from '@nestjs/testing';\nimport { BookingsService } from '../../bookings/bookings.service.js';\nimport { PrismaService } from '../../prisma/prisma.service.js';\nimport { Clock } from '../../common/clock.module.js';\n\nconst AN = { id: 4, role: 'STUDENT', studentCode: 'SE170001' } as const;\nconst PHONG = { id: 1, code: 'AL-201', building: 'Alpha', capacity: 30, managerId: 2 };\nconst gio = (h: string) => `2026-12-01T${h}:00+07:00`;\nconst dongHo = { now: () => new Date(gio('08:00')) };\n\n// —— cách 1: new trực tiếp\ndescribe('cách 1 — new BookingsService(fake, clock)', () => {\n  it('quá sức chứa ⇒ 400, không ghi gì', async () => {\n    const db = { room: { findUnique: vi.fn().mockResolvedValue(PHONG) }, booking: { create: vi.fn() } };\n    const svc = new BookingsService(db as unknown as PrismaService, dongHo);\n    await expect(svc.create({ roomId: 1, start: gio('09:00'), end: gio('10:00'), attendees: 31 }, AN)).rejects.toThrow('chỉ chứa 30');\n    expect(db.booking.create).not.toHaveBeenCalled();\n  });\n});\n\n// —— cách 2: TestingModule + overrideProvider\ndescribe('cách 2 — Test.createTestingModule', () => {\n  let svc: BookingsService;\n  const db = { room: { findUnique: vi.fn() }, booking: { create: vi.fn() } };\n  beforeEach(async () => {\n    vi.resetAllMocks();\n    const m = await Test.createTestingModule({\n      providers: [BookingsService, { provide: PrismaService, useValue: db }, { provide: Clock, useValue: dongHo }],\n    }).compile();\n    svc = m.get(BookingsService);\n  });\n  it('phòng không có ⇒ ROOM_NOT_FOUND', async () => {\n    db.room.findUnique.mockResolvedValue(null);\n    await expect(svc.create({ roomId: 9, start: gio('09:00'), end: gio('10:00'), attendees: 3 }, AN)).rejects.toMatchObject({ status: 404, errorCode: 'ROOM_NOT_FOUND' });\n  });\n  it('chủ lịch lấy từ người đăng nhập', async () => {\n    db.room.findUnique.mockResolvedValue(PHONG);\n    db.booking.create.mockImplementation(async ({ data }) => ({ id: 1, ...data }));\n    await svc.create({ roomId: 1, start: gio('09:00'), end: gio('10:00'), attendees: 3 }, AN);\n    expect(db.booking.create).toHaveBeenCalledWith({ data: expect.objectContaining({ userId: 4, studentId: 'SE170001', createdBy: 'user:4' }) });\n  });\n  it('DB báo 23P01 ⇒ 409 BOOKING_CONFLICT', async () => {\n    db.room.findUnique.mockResolvedValue(PHONG);\n    db.booking.create.mockRejectedValue({ cause: { originalCode: '23P01' } });\n    await expect(svc.create({ roomId: 1, start: gio('09:00'), end: gio('10:00'), attendees: 3 }, AN)).rejects.toMatchObject({ status: 409, errorCode: 'BOOKING_CONFLICT' });\n  });\n});";
const OUT_DONVI = " RUN  v4.1.12 /home/sv/app\n ✓ src/thu/b81/don-vi.spec.ts > cách 1 — new BookingsService(fake, clock) > quá sức chứa ⇒ 400, không ghi gì 4ms\n ✓ src/thu/b81/don-vi.spec.ts > cách 2 — Test.createTestingModule > phòng không có ⇒ ROOM_NOT_FOUND 59ms\n ✓ src/thu/b81/don-vi.spec.ts > cách 2 — Test.createTestingModule > chủ lịch lấy từ người đăng nhập 3ms\n ✓ src/thu/b81/don-vi.spec.ts > cách 2 — Test.createTestingModule > DB báo 23P01 ⇒ 409 BOOKING_CONFLICT 2ms\n Test Files  1 passed (1)\n      Tests  4 passed (4)\n   Start at  07:54:22\n   Duration  749ms (transform 148ms, setup 0ms, import 430ms, tests 70ms, environment 0ms)";
const MA_BAY = "// b81/bay.spec.ts — bốn chỗ hay vấp của TestingModule (in ra để chép vào bài)\nimport { Injectable, OnModuleInit, OnModuleDestroy, Scope } from '@nestjs/common';\nimport { Test } from '@nestjs/testing';\nimport { BookingsService } from '../../bookings/bookings.service.js';\nimport { PrismaService } from '../../prisma/prisma.service.js';\nimport { Clock } from '../../common/clock.module.js';\n\nit('① quên khai một phụ thuộc', async () => {\n  const loi = await Test.createTestingModule({ providers: [BookingsService, { provide: Clock, useValue: {} }] }).compile().catch((e) => e);\n  console.log(loi.message);\n});\n\nit('② useMocker: Nest hỏi gì thì đưa nấy', async () => {\n  const hoi: string[] = [];\n  const m = await Test.createTestingModule({ providers: [BookingsService] })\n    .useMocker((token) => { hoi.push(typeof token === 'function' ? token.name : String(token)); return {}; })\n    .compile();\n  console.log('useMocker được hỏi:', hoi.join(', '), '| svc:', m.get(BookingsService).constructor.name);\n});\n\n@Injectable({ scope: Scope.REQUEST }) class GioHang { id = Math.random().toString(36).slice(2, 6); }\nit('③ provider scope REQUEST: get() và resolve()', async () => {\n  const m = await Test.createTestingModule({ providers: [GioHang] }).compile();\n  try { m.get(GioHang); } catch (e) { console.log('get():', (e as Error).message); }\n  const a = await m.resolve(GioHang), b = await m.resolve(GioHang), id = { id: 1 };\n  const c = await m.resolve(GioHang, id), d = await m.resolve(GioHang, id);\n  console.log('resolve() hai lần:', a.id === b.id ? 'CÙNG' : 'KHÁC', '| cùng contextId:', c.id === d.id ? 'CÙNG' : 'KHÁC');\n});\n\nconst nhatKy: string[] = [];\n@Injectable() class KetNoi implements OnModuleInit, OnModuleDestroy {\n  onModuleInit() { nhatKy.push('onModuleInit'); }\n  onModuleDestroy() { nhatKy.push('onModuleDestroy'); }\n}\nit('④ compile() chưa gọi onModuleInit', async () => {\n  const m = await Test.createTestingModule({ providers: [KetNoi] }).compile();\n  nhatKy.push('— sau compile()'); await m.init(); nhatKy.push('— sau init()'); await m.close(); nhatKy.push('— sau close()');\n  console.log(nhatKy.join(' | '));\n});\n\nit('⑤ useValue không cần đủ kiểu — TypeScript không kêu, lỗi lúc chạy', async () => {\n  const m = await Test.createTestingModule({ providers: [BookingsService, { provide: PrismaService, useValue: { room: {} } }, { provide: Clock, useValue: { now: () => new Date() } }] }).compile();\n  const loi = await m.get(BookingsService).create({ roomId: 1, start: '2027-01-01T07:30:00+07:00', end: '2027-01-01T09:30:00+07:00', attendees: 1 }, { id: 4, role: 'STUDENT', studentCode: null }).catch((e) => e);\n  console.log(loi.constructor.name + ':', loi.message);\n});";
const OUT_BAY = " RUN  v4.1.12 /home/sv/app\nNest can't resolve dependencies of the BookingsService (?, Clock). Please make sure that the argument PrismaService at index [0] is available in the RootTestModule module.\nPotential solutions:\n- Is RootTestModule a valid NestJS module?\n- If PrismaService is a provider, is it part of the current RootTestModule?\n- If PrismaService is exported from a separate @Module, is that module imported within RootTestModule?\n  @Module({\n    imports: [ /* the Module containing PrismaService */ ]\n  })\nFor more common dependency resolution issues, see: https://docs.nestjs.com/faq/common-errors\nuseMocker được hỏi: PrismaService, Clock | svc: BookingsService\nget(): GioHang is marked as a scoped provider. Request and transient-scoped providers can't be used in combination with \"get()\" method. Please, use \"resolve()\" instead.\nresolve() hai lần: KHÁC | cùng contextId: CÙNG\n— sau compile() | onModuleInit | — sau init() | onModuleDestroy | — sau close()\nTypeError: this.db.room.findUnique is not a function\n ✓ src/thu/b81/bay.spec.ts > ① quên khai một phụ thuộc 9ms\n ✓ src/thu/b81/bay.spec.ts > ② useMocker: Nest hỏi gì thì đưa nấy 55ms\n ✓ src/thu/b81/bay.spec.ts > ③ provider scope REQUEST: get() và resolve() 2ms\n ✓ src/thu/b81/bay.spec.ts > ④ compile() chưa gọi onModuleInit 3ms\n ✓ src/thu/b81/bay.spec.ts > ⑤ useValue không cần đủ kiểu — TypeScript không kêu, lỗi lúc chạy 2ms\n Test Files  1 passed (1)\n      Tests  5 passed (5)\n   Start at  07:54:21\n   Duration  815ms (transform 200ms, setup 0ms, import 498ms, tests 73ms, environment 0ms)";
const MA_NOIDOI = "// b81/mock-noi-doi.spec.ts — một lỗi gõ ('CANCELED' thay 'CANCELLED'): test giả lập DB xanh, test DB thật đỏ\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from '../../generated/prisma/client.js';\nimport { BookingsService } from '../../bookings/bookings.service.js';\nimport type { PrismaService } from '../../prisma/prisma.service.js';\n\nclass BookingsServiceGoNham extends BookingsService {\n  // \"chỉ khác\" bản gốc đúng một chữ: CANCELED (Mỹ) — cột status lưu CANCELLED\n  override findByRoom(roomId: number) {\n    return (this as any).db.booking.findMany({ where: { roomId, status: { notIn: ['CANCELED', 'REJECTED'] } }, orderBy: { start: 'asc' } });\n  }\n}\nconst clock = { now: () => new Date('2026-12-01T00:00:00Z') };\n\ndescribe('findByRoom bỏ lịch đã huỷ — giả lập DB', () => {\n  it('trả đúng thứ DB giả trả', async () => {\n    const dangCho = { id: 1, roomId: 1, status: 'PENDING' };\n    const db = { booking: { findMany: vi.fn().mockResolvedValue([dangCho]) } };\n    const svc = new BookingsServiceGoNham(db as unknown as PrismaService, clock);\n    expect(await svc.findByRoom(1)).toEqual([dangCho]);\n    expect(db.booking.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ roomId: 1 }) }));\n  });\n});\n\ndescribe('findByRoom bỏ lịch đã huỷ — PostgreSQL thật', () => {\n  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_TEST }) });\n  afterAll(() => db.$disconnect());\n  it('lịch CANCELLED không còn trong danh sách bận', async () => {\n    await db.$executeRaw`TRUNCATE bookings, rooms RESTART IDENTITY CASCADE`;\n    const r = await db.room.create({ data: { code: 'AL-201', building: 'Alpha', capacity: 30 } });\n    const base = { roomId: r.id, attendees: 3, createdBy: 'test', end: new Date('2027-01-05T02:30:00Z') };\n    await db.booking.create({ data: { ...base, start: new Date('2027-01-05T00:30:00Z'), status: 'CANCELLED' } });\n    await db.booking.create({ data: { ...base, start: new Date('2027-01-05T01:30:00Z'), end: new Date('2027-01-05T03:30:00Z') } });\n    const svc = new BookingsServiceGoNham(db as unknown as PrismaService, clock);\n    expect((await svc.findByRoom(r.id)).map((b: { status: string }) => b.status)).toEqual(['PENDING']);\n  });\n});";
const OUT_NOIDOI = " RUN  v4.1.12 /home/sv/app\n ✓ src/thu/b81/mock-noi-doi.spec.ts > findByRoom bỏ lịch đã huỷ — giả lập DB > trả đúng thứ DB giả trả 5ms\n × src/thu/b81/mock-noi-doi.spec.ts > findByRoom bỏ lịch đã huỷ — PostgreSQL thật > lịch CANCELLED không còn trong danh sách bận 146ms\n   → expected [ 'CANCELLED', 'PENDING' ] to deeply equal [ 'PENDING' ]\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/thu/b81/mock-noi-doi.spec.ts > findByRoom bỏ lịch đã huỷ — PostgreSQL thật > lịch CANCELLED không còn trong danh sách bận\nAssertionError: expected [ 'CANCELLED', 'PENDING' ] to deeply equal [ 'PENDING' ]\n- Expected\n+ Received\n  [\n+   \"CANCELLED\",\n    \"PENDING\",\n  ]\n …\n Test Files  1 failed (1)\n      Tests  1 failed | 1 passed (2)\n   Start at  07:54:24\n   Duration  679ms (transform 86ms, setup 0ms, import 301ms, tests 155ms, environment 0ms)";
const MA_BT = "// b81/bt.spec.ts — bài tập 8.1: setStatus với DB giả (không PostgreSQL)\nimport { Test } from '@nestjs/testing';\nimport { BookingsService } from '../../bookings/bookings.service.js';\nimport { PrismaService } from '../../prisma/prisma.service.js';\nimport { Clock } from '../../common/clock.module.js';\n\nconst GV = { id: 2, role: 'LECTURER', studentCode: null } as const;\nconst GV2 = { id: 3, role: 'LECTURER', studentCode: null } as const;\nconst lich = (o = {}) => ({ id: 7, userId: 4, roomId: 1, status: 'PENDING', version: 1, room: { managerId: 2 }, ...o });\n\ndescribe('BookingsService.setStatus', () => {\n  const db = { booking: { findUnique: vi.fn(), updateMany: vi.fn() } };\n  let svc: BookingsService;\n  beforeEach(async () => {\n    vi.resetAllMocks();\n    svc = (await Test.createTestingModule({ providers: [BookingsService] })\n      .useMocker((t) => (t === PrismaService ? db : t === Clock ? { now: () => new Date() } : undefined)).compile()).get(BookingsService);\n  });\n  it('giảng viên quản lý phòng duyệt ⇒ APPROVED, version tăng, UPDATE có điều kiện version', async () => {\n    db.booking.findUnique.mockResolvedValue(lich()); db.booking.updateMany.mockResolvedValue({ count: 1 });\n    expect(await svc.setStatus(GV, 7, 'approve')).toMatchObject({ status: 'APPROVED', version: 2 });\n    expect(db.booking.updateMany).toHaveBeenCalledWith({ where: { id: 7, version: 1 }, data: { status: 'APPROVED', version: { increment: 1 } } });\n  });\n  it('người khác vừa đổi (count 0) ⇒ 409 BOOKING_CHANGED', async () => {\n    db.booking.findUnique.mockResolvedValue(lich()); db.booking.updateMany.mockResolvedValue({ count: 0 });\n    await expect(svc.setStatus(GV, 7, 'approve')).rejects.toMatchObject({ status: 409, errorCode: 'BOOKING_CHANGED' });\n  });\n  it('giảng viên không quản lý phòng ⇒ 404, không UPDATE', async () => {\n    db.booking.findUnique.mockResolvedValue(lich());\n    await expect(svc.setStatus(GV2, 7, 'approve')).rejects.toMatchObject({ status: 404 });\n    expect(db.booking.updateMany).not.toHaveBeenCalled();\n  });\n  it('lịch đã huỷ ⇒ 403 \"Lịch đã kết thúc\"', async () => {\n    db.booking.findUnique.mockResolvedValue(lich({ status: 'CANCELLED' }));\n    await expect(svc.setStatus(GV, 7, 'approve')).rejects.toMatchObject({ status: 403, message: 'Lịch đã kết thúc' });\n  });\n});";
const OUT_BT = " RUN  v4.1.12 /home/sv/app\n ✓ src/thu/b81/bt.spec.ts > BookingsService.setStatus > giảng viên quản lý phòng duyệt ⇒ APPROVED, version tăng, UPDATE có điều kiện version 95ms\n ✓ src/thu/b81/bt.spec.ts > BookingsService.setStatus > người khác vừa đổi (count 0) ⇒ 409 BOOKING_CHANGED 3ms\n ✓ src/thu/b81/bt.spec.ts > BookingsService.setStatus > giảng viên không quản lý phòng ⇒ 404, không UPDATE 2ms\n ✓ src/thu/b81/bt.spec.ts > BookingsService.setStatus > lịch đã huỷ ⇒ 403 \"Lịch đã kết thúc\" 2ms\n Test Files  1 passed (1)\n      Tests  4 passed (4)\n   Start at  07:54:37\n   Duration  756ms (transform 169ms, setup 0ms, import 432ms, tests 104ms, environment 0ms)";

export default {
  title: '8.1 — Unit tests with Test.createTestingModule, overrideProvider and mocks|||8.1 — Test đơn vị với Test.createTestingModule, overrideProvider và mock',
  slug: 'nst-8-1-unit',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Test BookingsService của dự án mà không cần PostgreSQL: so new trực tiếp với Test.createTestingModule + overrideProvider, đọc đúng lỗi "Nest can\'t resolve dependencies" khi quên một phụ thuộc, useMocker, get() và resolve() với provider scope REQUEST, compile() chưa gọi onModuleInit. Kèm thí nghiệm chạy thật: gõ nhầm CANCELED một chữ — test có mock xanh, test với DB thật đỏ — để biết test đơn vị dừng ở đâu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>8.1 — Unit tests in Nest: swap the dependencies, keep the rules</h2>
<p class="lead">Since Chapter 2 every service in the project receives its dependencies through the constructor. That decision pays off now: <code>BookingsService</code> needs a <code>PrismaService</code> and a <code>Clock</code>, so a test can hand it a fake database and a frozen clock and check every rule — past start, over capacity, conflict code — in milliseconds, without PostgreSQL. This lesson covers the Nest-specific part: the testing module. The general theory of test doubles is in the Testing course (links below).</p>

<h3>Everyday analogy: a flight simulator</h3>
<p>Pilots train the emergency procedure in a simulator: the cockpit is real, the engine fire is fake and can be started on demand. A unit test is the same: the class under test is real, its surroundings are fakes you control — "the room exists", "the database reports 23P01" — so you can rehearse the rare cases that are hard to produce for real.</p>

<h3>1. Two ways to build the service under test</h3>
<pre><code class="language-ts">${esc(MA_DONVI)}</code></pre>
<div class="out">${esc(OUT_DONVI)}</div>
<ul>
<li><strong>Way 1 — <code>new</code></strong>: plain TypeScript, 4 ms. Enough when the class has two or three dependencies and no Nest features (no lifecycle hooks, no <code>@Inject(token)</code>).</li>
<li><strong>Way 2 — <code>Test.createTestingModule</code></strong>: Nest builds the class exactly as in production, reading the constructor metadata. The first compile took ~60 ms, later ones a few ms. Use it when the class uses injection tokens, <code>@Optional()</code>, lifecycle hooks, or when you want the test to fail if the DI wiring breaks.</li>
<li><code>{ provide: PrismaService, useValue: db }</code> is the same <code>useValue</code> provider from lesson 2.2 — the testing module is just a small module you assemble by hand.</li>
<li>The third test does not assert "we called create" for its own sake; it asserts <em>who becomes the owner</em> (<code>userId: 4</code>, from the token, never from the body — lesson 7.7). Assert the business fact, not the call sequence.</li>
</ul>

<h3>2. Four traps of the testing module (real output)</h3>
<pre><code class="language-ts">${esc(MA_BAY)}</code></pre>
<div class="out">${esc(OUT_BAY)}</div>
<ol>
<li><strong>A forgotten dependency</strong> gives the same message as in a real app — read <code>(?, Clock)</code>: the <code>?</code> marks the missing argument, here index 0, <code>PrismaService</code>. "RootTestModule" is the module the builder created for you.</li>
<li><strong><code>useMocker</code></strong> is called for every token the module cannot resolve — here exactly <code>PrismaService</code> and <code>Clock</code>. Good for classes with many dependencies you do not care about in a given test; dangerous if it hides that a class has grown eight dependencies.</li>
<li><strong>Scoped providers</strong> (<code>Scope.REQUEST</code>, lesson 2.4) cannot be fetched with <code>get()</code>. <code>resolve()</code> creates a new instance per call unless you pass the same context id — the same rule as one instance per request.</li>
<li><strong><code>compile()</code> does not run lifecycle hooks.</strong> <code>onModuleInit</code> runs on <code>init()</code>, <code>onModuleDestroy</code> on <code>close()</code>. A <code>PrismaService</code> that checks the connection in <code>onModuleInit</code> (mốc 6) therefore connects only after <code>init()</code>.</li>
<li><strong><code>useValue</code> is not type-checked</strong> against the class it replaces. An incomplete fake compiles and fails at runtime with <code>TypeError: … is not a function</code> — read that message as "my fake is missing a method", not as a bug in the service.</li>
</ol>

<h3>3. Where a unit test stops: a mock that agrees with your bug</h3>
<p>One letter is changed in <code>findByRoom</code>: <code>'CANCELED'</code> (American spelling) instead of <code>'CANCELLED'</code>, the value stored in the column. Same test intent, two kinds of test:</p>
<pre><code class="language-ts">${esc(MA_NOIDOI)}</code></pre>
<div class="out">${esc(OUT_NOIDOI)}</div>
<p>The mock test is green because the fake returns whatever we told it to; it never evaluates the <code>where</code>. The query is the logic here, and only something that runs the query — PostgreSQL — can judge it. Rule of thumb for Nest projects:</p>
<table>
<tr><th>Logic lives in…</th><th>Test with…</th></tr>
<tr><td>TypeScript branches (time, capacity, who owns it, which error)</td><td>Unit test, fake repository, fixed clock</td></tr>
<tr><td>The query, a constraint, a transaction</td><td>Real database (lesson 8.3, Testing course ch. 4)</td></tr>
<tr><td>Wiring: guards, pipes, filters, status codes</td><td>e2e through HTTP (lesson 8.3)</td></tr>
</table>

<h3>🧪 Exercise (15 min) — test setStatus without a database</h3>
<p>Write unit tests for <code>BookingsService.setStatus</code>: (a) the room's lecturer approves ⇒ <code>APPROVED</code>, version + 1, and the <code>UPDATE</code> has the version condition; (b) <code>updateMany</code> returns <code>count: 0</code> ⇒ 409 <code>BOOKING_CHANGED</code>; (c) a lecturer who does not manage the room ⇒ 404 and no update; (d) a cancelled booking ⇒ 403 "Lịch đã kết thúc". Use <code>useMocker</code> for the two dependencies.</p>
<details><summary>Show the solution</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Case (b) is the one you cannot easily produce through HTTP: two people must press the button in the same millisecond. With a fake it is one line, <code>mockResolvedValue({ count: 0 })</code>.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>How do you unit-test a Nest service that uses Prisma?</strong> Build it with <code>Test.createTestingModule</code> and replace <code>PrismaService</code> with <code>overrideProvider(...).useValue(fake)</code> (or list a <code>useValue</code> provider). Assert outcomes and errors; keep query correctness for tests against a real database.</li>
<li><strong>What does "Nest can't resolve dependencies of X (?, Y)" mean in a test?</strong> The testing module lacks a provider for the argument at the <code>?</code> position; add it, import the module that exports it, or use <code>useMocker</code>.</li>
<li><strong>get() or resolve()?</strong> <code>get()</code> for singletons; <code>resolve()</code> for request- or transient-scoped providers.</li>
<li><strong>Why is my onModuleInit not running in the test?</strong> <code>compile()</code> only builds the graph; call <code>module.init()</code> (or <code>app.init()</code>) and close it afterwards.</li>
</ol>

<h3>💼 On the job</h3>
<p>On outsourcing projects the customer often demands "80% unit-test coverage" in the contract. Teams then mock Prisma for every query and assert <code>toHaveBeenCalledWith</code> on the exact object — the coverage number rises and the tests break on every refactor while catching nothing (section 3). When you join such a project, propose the split in the table above: unit tests for rules, a few dozen DB/e2e tests for queries and wiring. Lesson 8.6 shows numbers you can bring to that meeting.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Testing module</span><span class="v">A Nest module assembled in the test with Test.createTestingModule({ providers, imports }).</span></div>
  <div class="kv"><span class="k">overrideProvider</span><span class="v">Replace one provider of the graph with useValue/useClass/useFactory before compile().</span></div>
  <div class="kv"><span class="k">useMocker</span><span class="v">Factory called for each unresolved token — automatic fakes.</span></div>
  <div class="kv"><span class="k">compile / init / close</span><span class="v">Build the graph / run onModuleInit… / run onModuleDestroy….</span></div>
  <div class="kv"><span class="k">resolve()</span><span class="v">Get an instance of a request- or transient-scoped provider.</span></div>
  <div class="kv"><span class="k">vi.fn / mockResolvedValue</span><span class="v">A fake function that records calls; make it return a resolved promise.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Constructor injection makes Nest services unit-testable: fake the database and the clock, check rules in milliseconds.</li>
<li><code>new</code> for simple classes; <code>Test.createTestingModule</code> when tokens, hooks or wiring matter.</li>
<li>Know the four traps: missing provider message, <code>useMocker</code>, <code>resolve()</code> for scoped providers, <code>init()</code> for hooks — plus untyped <code>useValue</code>.</li>
<li>A mock cannot judge a query: one wrong letter was green with a fake and red against PostgreSQL.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>8.1 — Test đơn vị trong Nest: thay phụ thuộc, giữ nguyên luật</h2>
<p class="lead">Từ Chương 2, mọi service trong dự án nhận phụ thuộc qua constructor. Giờ là lúc quyết định đó trả lãi: <code>BookingsService</code> cần <code>PrismaService</code> và <code>Clock</code>, nên test đưa cho nó một DB giả và một đồng hồ đứng yên rồi kiểm từng luật — giờ bắt đầu đã qua, quá sức chứa, mã lỗi trùng lịch — trong vài mili giây, không cần PostgreSQL. Bài này dạy phần riêng của Nest: testing module. Lý thuyết chung về đồ giả (test double) nằm ở khoá Testing (liên kết cuối bài).</p>

<h3>Liên hệ đời thường: buồng lái giả lập</h3>
<p>Phi công tập xử lý sự cố trong buồng lái giả lập: buồng lái là thật, đám cháy động cơ là giả và bật được lúc nào cũng được. Test đơn vị y như vậy: lớp cần test là thật, mọi thứ xung quanh là đồ giả bạn điều khiển — "phòng có tồn tại", "DB báo 23P01" — để tập những ca hiếm mà khó tạo ra thật.</p>

<h3>1. Hai cách dựng service cần test</h3>
<pre><code class="language-ts">${esc(MA_DONVI)}</code></pre>
<div class="out">${esc(OUT_DONVI)}</div>
<ul>
<li><strong>Cách 1 — <code>new</code></strong>: TypeScript thuần, 4 ms. Đủ khi lớp có hai, ba phụ thuộc và không dùng tính năng của Nest (không hook vòng đời, không <code>@Inject(token)</code>).</li>
<li><strong>Cách 2 — <code>Test.createTestingModule</code></strong>: Nest dựng lớp đúng như production, đọc metadata của constructor. Lần compile đầu mất ~60 ms, các lần sau vài ms. Dùng khi lớp có token tiêm, <code>@Optional()</code>, hook vòng đời, hoặc khi bạn muốn test đỏ nếu dây DI bị đứt.</li>
<li><code>{ provide: PrismaService, useValue: db }</code> chính là provider <code>useValue</code> của bài 2.2 — testing module chỉ là một module nhỏ bạn tự lắp tay.</li>
<li>Test thứ ba không khẳng định "đã gọi create" cho có; nó khẳng định <em>ai thành chủ lịch</em> (<code>userId: 4</code>, lấy từ token, không bao giờ từ body — bài 7.7). Khẳng định sự thật nghiệp vụ, đừng khẳng định trình tự lời gọi.</li>
</ul>

<h3>2. Bốn cái bẫy của testing module (output thật)</h3>
<pre><code class="language-ts">${esc(MA_BAY)}</code></pre>
<div class="out">${esc(OUT_BAY)}</div>
<ol>
<li><strong>Quên một phụ thuộc</strong> cho đúng câu báo lỗi như ứng dụng thật — đọc <code>(?, Clock)</code>: dấu <code>?</code> đánh dấu tham số thiếu, ở đây vị trí 0 là <code>PrismaService</code>. "RootTestModule" là module mà builder tạo giúp bạn.</li>
<li><strong><code>useMocker</code></strong> được gọi cho mọi token module không tự giải được — ở đây đúng <code>PrismaService</code> và <code>Clock</code>. Tiện cho lớp có nhiều phụ thuộc mà test đang viết không quan tâm; nguy hiểm nếu nó che việc một lớp đã phình tới tám phụ thuộc.</li>
<li><strong>Provider có scope</strong> (<code>Scope.REQUEST</code>, bài 2.4) không lấy được bằng <code>get()</code>. <code>resolve()</code> tạo bản mới mỗi lần gọi, trừ khi truyền cùng một context id — đúng luật "mỗi request một bản".</li>
<li><strong><code>compile()</code> không chạy hook vòng đời.</strong> <code>onModuleInit</code> chạy ở <code>init()</code>, <code>onModuleDestroy</code> ở <code>close()</code>. Vì vậy <code>PrismaService</code> kiểm kết nối trong <code>onModuleInit</code> (mốc 6) chỉ kết nối sau <code>init()</code>.</li>
<li><strong><code>useValue</code> không được kiểm kiểu</strong> theo lớp nó thay. Đồ giả thiếu hàm vẫn biên dịch được và hỏng lúc chạy với <code>TypeError: … is not a function</code> — đọc câu đó là "đồ giả của mình thiếu hàm", đừng tưởng service có lỗi.</li>
</ol>

<h3>3. Test đơn vị dừng ở đâu: mock đồng ý với lỗi của bạn</h3>
<p>Đổi đúng một chữ trong <code>findByRoom</code>: <code>'CANCELED'</code> (cách viết Mỹ) thay cho <code>'CANCELLED'</code> — giá trị đang lưu trong cột. Cùng một ý định test, hai loại test:</p>
<pre><code class="language-ts">${esc(MA_NOIDOI)}</code></pre>
<div class="out">${esc(OUT_NOIDOI)}</div>
<p>Test có mock xanh vì DB giả trả đúng thứ ta bảo nó trả; nó không bao giờ tính cái <code>where</code>. Ở đây truy vấn mới là logic, và chỉ thứ chạy được truy vấn — PostgreSQL — mới phán được nó đúng hay sai. Quy tắc cho dự án Nest:</p>
<table>
<tr><th>Logic nằm ở…</th><th>Test bằng…</th></tr>
<tr><td>Nhánh TypeScript (thời gian, sức chứa, ai là chủ, lỗi nào)</td><td>Test đơn vị, repository giả, đồng hồ cố định</td></tr>
<tr><td>Câu truy vấn, ràng buộc, transaction</td><td>DB thật (bài 8.3, khoá Testing chương 4)</td></tr>
<tr><td>Dây nối: guard, pipe, filter, mã trạng thái</td><td>e2e qua HTTP (bài 8.3)</td></tr>
</table>

<h3>🧪 Thực hành (15 phút) — test setStatus không cần DB</h3>
<p>Viết test đơn vị cho <code>BookingsService.setStatus</code>: (a) giảng viên quản lý phòng duyệt ⇒ <code>APPROVED</code>, version + 1, và câu <code>UPDATE</code> có điều kiện version; (b) <code>updateMany</code> trả <code>count: 0</code> ⇒ 409 <code>BOOKING_CHANGED</code>; (c) giảng viên không quản lý phòng ⇒ 404 và không UPDATE; (d) lịch đã huỷ ⇒ 403 "Lịch đã kết thúc". Dùng <code>useMocker</code> cho hai phụ thuộc.</p>
<details><summary>Xem lời giải</summary>
<pre><code class="language-ts">${esc(MA_BT)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Ca (b) là ca khó tạo qua HTTP: hai người phải bấm nút trong cùng một mili giây. Với đồ giả, nó là một dòng <code>mockResolvedValue({ count: 0 })</code>.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Test đơn vị một service Nest dùng Prisma thế nào?</strong> Dựng bằng <code>Test.createTestingModule</code>, thay <code>PrismaService</code> bằng <code>overrideProvider(...).useValue(giả)</code> (hoặc khai thẳng provider <code>useValue</code>). Khẳng định kết quả và lỗi; để việc đúng/sai của truy vấn cho test với DB thật.</li>
<li><strong>"Nest can't resolve dependencies of X (?, Y)" trong test nghĩa là gì?</strong> Testing module thiếu provider cho tham số ở vị trí <code>?</code>; thêm nó, import module export nó, hoặc dùng <code>useMocker</code>.</li>
<li><strong>get() hay resolve()?</strong> <code>get()</code> cho singleton; <code>resolve()</code> cho provider scope request hoặc transient.</li>
<li><strong>Sao onModuleInit không chạy trong test?</strong> <code>compile()</code> chỉ dựng đồ thị; gọi <code>module.init()</code> (hoặc <code>app.init()</code>) và nhớ đóng sau đó.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Ở dự án outsourcing, hợp đồng hay ghi "độ phủ test đơn vị 80%". Nhóm liền mock Prisma cho từng truy vấn rồi <code>toHaveBeenCalledWith</code> đúng từng object — con số độ phủ tăng, test vỡ mỗi lần refactor mà không bắt được gì (phần 3). Khi vào một dự án như vậy, hãy đề xuất cách chia ở bảng trên: test đơn vị cho luật, vài chục test DB/e2e cho truy vấn và dây nối. Bài 8.6 có số liệu để bạn mang vào buổi họp đó.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Testing module</span><span class="v">Module Nest lắp trong test bằng Test.createTestingModule({ providers, imports }).</span></div>
  <div class="kv"><span class="k">overrideProvider</span><span class="v">Thay một provider của đồ thị bằng useValue/useClass/useFactory trước compile().</span></div>
  <div class="kv"><span class="k">useMocker</span><span class="v">Hàm được gọi cho mỗi token chưa giải được — đồ giả tự động.</span></div>
  <div class="kv"><span class="k">compile / init / close</span><span class="v">Dựng đồ thị / chạy onModuleInit… / chạy onModuleDestroy….</span></div>
  <div class="kv"><span class="k">resolve()</span><span class="v">Lấy bản của provider scope request hoặc transient.</span></div>
  <div class="kv"><span class="k">vi.fn / mockResolvedValue</span><span class="v">Hàm giả ghi lại lời gọi; cho nó trả một promise đã xong.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tiêm qua constructor làm service Nest test đơn vị được: giả DB và đồng hồ, kiểm luật trong vài mili giây.</li>
<li><code>new</code> cho lớp đơn giản; <code>Test.createTestingModule</code> khi token, hook hoặc dây DI quan trọng.</li>
<li>Nhớ bốn bẫy: câu báo thiếu provider, <code>useMocker</code>, <code>resolve()</code> cho provider có scope, <code>init()</code> cho hook — cộng thêm <code>useValue</code> không kiểm kiểu.</li>
<li>Mock không phán được truy vấn: sai một chữ vẫn xanh với đồ giả và đỏ với PostgreSQL.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
