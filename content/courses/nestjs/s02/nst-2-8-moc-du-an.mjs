/**
 * 2.8 — Mốc dự án 2: tách module tính năng (khoá nestjs, soạn 24/11/2026).
 * Ví dụ THẬT cho đề cuối khoá (phòng lab): scratchpad/nst/lab/c2/moc2 (chép từ moc1) — thêm ClockModule (@Global, Clock abstract),
 * BookingsModule (import RoomsModule; kiểm phòng tồn tại, sức chứa, quá khứ, trùng giờ), RoomsModule export RoomsService.
 * do-thi.ts in đồ thị module thật từ ModulesContainer; t28.sh curl trong container nst-run-* (Node v22.23.5, Nest 12.6.0);
 * bookings.service.spec.ts 2 test xanh với đồng hồ cố định (Vitest 4.1.12 máy nhà).
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: '0.2 — Dự án xuyên suốt', sub: 'Bảng mốc từng chương và rubric dự án cuối.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-1-6-moc-du-an', title: '1.6 — Mốc dự án 1', sub: 'Điểm xuất phát của mốc này: một tài nguyên trong bộ nhớ.', cta: 'Mở bài →' }),
].join('\n');

const CAY = `src/
├── app.module.ts             chỉ import, không provider
├── common/
│   └── clock.module.ts       @Global — Clock (abstract) ⇒ SystemClock
├── rooms/
│   ├── rooms.module.ts       exports: [RoomsService]
│   ├── rooms.controller.ts
│   └── rooms.service.ts
└── bookings/
    ├── bookings.module.ts    imports: [RoomsModule]
    ├── bookings.controller.ts
    ├── bookings.service.ts   cần RoomsService + Clock
    └── booking.entity.ts`;

const README = `## Module và phụ thuộc (mốc 2)

AppModule ─┬─► ClockModule (global)   Clock
           ├─► RoomsModule            RoomsService  (export)
           └─► BookingsModule ──────► RoomsModule
                                      BookingsService ← RoomsService, Clock

Luật: mỗi provider khai ở MỘT module; module khác chỉ dùng thứ được export.
Không vòng phụ thuộc (kiểm: node dist/do-thi.js).`;
const MA_CLOCK = "import { Global, Module } from '@nestjs/common';\n\n// Đồng hồ là một phụ thuộc: test sẽ thay bằng giờ cố định\nexport abstract class Clock { abstract now(): Date; }\nclass SystemClock extends Clock { now() { return new Date(); } }\n\n@Global()   // hạ tầng dùng khắp nơi — trường hợp hiếm đáng dùng @Global\n@Module({ providers: [{ provide: Clock, useClass: SystemClock }], exports: [Clock] })\nexport class ClockModule {}";
const MA_BSVC = "import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';\nimport { Clock } from '../common/clock.module.js';\nimport { RoomsService } from '../rooms/rooms.service.js';\nimport { Booking } from './booking.entity.js';\n\n@Injectable()\nexport class BookingsService {\n  private bookings: Booking[] = [];\n  private nextId = 1;\n  constructor(private readonly rooms: RoomsService, private readonly clock: Clock) {}\n\n  create(b: Omit<Booking, 'id'>): Booking {\n    const room = this.rooms.findOne(b.roomId);\n    if (!room) throw new NotFoundException(`không có phòng ${b.roomId}`);\n    const s = new Date(b.start), e = new Date(b.end);\n    if (!(s < e)) throw new BadRequestException('start phải trước end');\n    if (s <= this.clock.now()) throw new BadRequestException('không đặt lịch trong quá khứ');\n    if (b.attendees > room.capacity) throw new BadRequestException(`phòng ${room.code} chỉ chứa ${room.capacity}`);\n    const trung = this.bookings.find((x) => x.roomId === b.roomId && new Date(x.start) < e && s < new Date(x.end));\n    if (trung) throw new ConflictException(`trùng lịch #${trung.id}`);      // ⚠ chương 6: race khi 2 request cùng lúc\n    const moi = { id: this.nextId++, ...b };\n    this.bookings.push(moi);\n    return moi;\n  }\n  findByRoom(roomId: number) { return this.bookings.filter((x) => x.roomId === roomId); }\n}";
const MA_BMOD = "import { Module } from '@nestjs/common';\nimport { RoomsModule } from '../rooms/rooms.module.js';\nimport { BookingsController } from './bookings.controller.js';\nimport { BookingsService } from './bookings.service.js';\n\n@Module({\n  imports: [RoomsModule],                 // cần RoomsService ⇒ import module chứa nó\n  controllers: [BookingsController],\n  providers: [BookingsService],\n})\nexport class BookingsModule {}";
const MA_RMOD = "import { Module } from '@nestjs/common';\nimport { RoomsService } from './rooms.service.js';\nimport { RoomsController } from './rooms.controller.js';\n\n@Module({\n  controllers: [RoomsController],\n  providers: [RoomsService],\n  exports: [RoomsService],                // cửa ra duy nhất: chỉ service, không lộ gì khác\n})\nexport class RoomsModule {}";
const MA_APP = "import { Module } from '@nestjs/common';\nimport { ClockModule } from './common/clock.module.js';\nimport { RoomsModule } from './rooms/rooms.module.js';\nimport { BookingsModule } from './bookings/bookings.module.js';\n\n@Module({\n  imports: [ClockModule, RoomsModule, BookingsModule],\n})\nexport class AppModule {}";
const MA_DOTHI = "// In đồ thị module THẬT từ container của Nest — dán vào README\nimport 'reflect-metadata';\nimport { NestFactory } from '@nestjs/core';\nimport { ModulesContainer } from '@nestjs/core';\nimport { AppModule } from './app.module.js';\nconst app = await NestFactory.createApplicationContext(AppModule, { logger: false });\nconst an = new Set(['InternalCoreModule']);\nfor (const m of app.get(ModulesContainer).values()) {\n  if (an.has(m.name)) continue;\n  const imp = [...m.imports].map((x) => x.name).filter((n) => !an.has(n));\n  const pro = [...m.providers.keys()].map((k) => (typeof k === 'function' ? k.name : String(k)))\n    .filter((n) => ![m.name, 'ModuleRef', 'ApplicationConfig'].includes(n));\n  const exp = [...m.exports].map((k) => (typeof k === 'function' ? k.name : String(k)));\n  console.log(`${m.name}${m.isGlobal ? ' (global)' : ''}\\n  imports: ${imp.join(', ') || '—'}\\n  providers: ${pro.join(', ')}\\n  exports: ${exp.join(', ') || '—'}`);\n}\nawait app.close();";
const OUT_DOTHI = "AppModule\n  imports: ClockModule, RoomsModule, BookingsModule\n  providers: \n  exports: —\nClockModule (global)\n  imports: —\n  providers: Clock\n  exports: Clock\nRoomsModule\n  imports: ClockModule\n  providers: RoomsService\n  exports: RoomsService\nBookingsModule\n  imports: RoomsModule, ClockModule\n  providers: BookingsService\n  exports: —";
const OUT_CURL = "$ curl -X POST /bookings -H 'Content-Type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE180001\",\"start\":\"2026-12-01T07:30:00+07:00\",\"end\":\"2026-12-01T09:00:00+07:00\",\"attendees\":12}'\n{\"id\":1,\"roomId\":1,\"studentId\":\"SE180001\",\"start\":\"2026-12-01T07:30:00+07:00\",\"end\":\"2026-12-01T09:00:00+07:00\",\"attendees\":12}   [201]\n$ curl -X POST /bookings -H 'Content-Type: application/json' -d '{\"roomId\":1,\"studentId\":\"SE180002\",\"start\":\"2026-12-01T08:30:00+07:00\",\"end\":\"2026-12-01T10:00:00+07:00\",\"attendees\":5}'\n{\"message\":\"trùng lịch #1\",\"error\":\"Conflict\",\"statusCode\":409}   [409]\n$ curl -X POST /bookings -H 'Content-Type: application/json' -d '{\"roomId\":2,\"studentId\":\"SE180002\",\"start\":\"2026-12-01T08:30:00+07:00\",\"end\":\"2026-12-01T10:00:00+07:00\",\"attendees\":40}'\n{\"message\":\"phòng BE-105 chỉ chứa 24\",\"error\":\"Bad Request\",\"statusCode\":400}   [400]\n$ curl -X POST /bookings -H 'Content-Type: application/json' -d '{\"roomId\":7,\"studentId\":\"SE180003\",\"start\":\"2026-12-01T08:30:00+07:00\",\"end\":\"2026-12-01T10:00:00+07:00\",\"attendees\":5}'\n{\"message\":\"không có phòng 7\",\"error\":\"Not Found\",\"statusCode\":404}   [404]\n$ curl -X POST /bookings -H 'Content-Type: application/json' -d '{\"roomId\":2,\"studentId\":\"SE180003\",\"start\":\"2025-01-01T08:30:00+07:00\",\"end\":\"2025-01-01T10:00:00+07:00\",\"attendees\":5}'\n{\"message\":\"không đặt lịch trong quá khứ\",\"error\":\"Bad Request\",\"statusCode\":400}   [400]\n$ curl /bookings/room/1\n[{\"id\":1,\"roomId\":1,\"studentId\":\"SE180001\",\"start\":\"2026-12-01T07:30:00+07:00\",\"end\":\"2026-12-01T09:00:00+07:00\",\"attendees\":12}]   [200]";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport { AppModule } from '../app.module.js';\nimport { Clock } from '../common/clock.module.js';\nimport { BookingsService } from './bookings.service.js';\n\ndescribe('BookingsService (đồng hồ cố định)', () => {\n  let svc: BookingsService;\n  beforeEach(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] })\n      .overrideProvider(Clock).useValue({ now: () => new Date('2026-12-01T08:00:00+07:00') })\n      .compile();\n    svc = m.get(BookingsService);\n  });\n  const dat = (start: string, end: string) =>\n    svc.create({ roomId: 1, studentId: 'SE1', start, end, attendees: 3 });\n\n  it('8:00 \"bây giờ\" ⇒ 7:30 là quá khứ', () => {\n    expect(() => dat('2026-12-01T07:30:00+07:00', '2026-12-01T09:00:00+07:00')).toThrow('quá khứ');\n  });\n  it('hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu)', () => {\n    dat('2026-12-01T08:30:00+07:00', '2026-12-01T09:00:00+07:00');\n    expect(dat('2026-12-01T09:00:00+07:00', '2026-12-01T10:00:00+07:00').id).toBe(2);\n  });\n});";
const OUT_SPEC = " ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > 8:00 \"bây giờ\" ⇒ 7:30 là quá khứ 59ms\n ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định) > hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu) 3ms\n      Tests  2 passed (2)";

export default {
  title: '2.8 — Project milestone 2: split your topic into feature modules|||2.8 — Mốc dự án 2: tách đề tài thành module tính năng',
  slug: 'nst-2-8-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc 2 của đề tài: mỗi tính năng một module, chỉ export thứ module khác cần, một module hạ tầng @Global có lý do, không vòng phụ thuộc, sơ đồ module trong README in ra từ chính container của Nest. Ví dụ chạy thật cho đề cuối khoá: thêm BookingsModule (kiểm phòng, sức chứa, quá khứ, trùng giờ ⇒ 404/400/409) dùng RoomsService được export, Clock tiêm được để test với giờ cố định.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Project</span>
<h2>2.8 — Milestone 2: walls inside your project</h2>
<p class="lead">At milestone 1 you had one resource. Now give your topic a second one that <em>depends on</em> the first, and put each in its own module with a deliberate door. The deliverable is not more endpoints; it is a structure a teammate can read from the README.</p>

<h3>Steps</h3>
<ol>
<li>One module per feature (<code>nest g module</code>, <code>nest g service</code>, <code>nest g controller</code>). The second resource must use the first's service.</li>
<li>Export only what another module calls. Repositories and helpers stay private.</li>
<li>Anything time-, randomness- or environment-dependent becomes an injectable provider (a <code>Clock</code> at least), so tests can fix it.</li>
<li>At most one <code>@Global</code> module, for infrastructure, and say why in the README.</li>
<li>Print the module graph from the running container (script below) and paste it into the README with the rules.</li>
<li>One unit test for the new service using <code>overrideProvider</code>. Commit: <code>feat: tách module tính năng (mốc 2)</code>.</li>
</ol>

<h3>Worked example: <code>BookingsModule</code> for the lab-booking project</h3>
<pre><code>${esc(CAY)}</code></pre>
<pre><code class="language-ts">${esc(MA_CLOCK)}</code></pre>
<pre><code class="language-ts">${esc(MA_RMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_BMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_BSVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<p>The graph, printed from Nest's own <code>ModulesContainer</code> — no hand-drawn diagram can drift from the code:</p>
<pre><code class="language-ts">${esc(MA_DOTHI)}</code></pre>
<div class="out">${esc(OUT_DOTHI)}</div>
<p>Notice <code>RoomsModule imports: ClockModule</code> although nobody wrote that: this is how <code>@Global</code> works internally — Nest links the global module into every module.</p>
<pre><code class="language-bash">${esc(OUT_CURL)}</code></pre>
<p>201, then 409 for the overlap, 400 for capacity, 404 for an unknown room, 400 for the past. The <code>⚠</code> in the service marks a race condition: two requests checking at the same time can both pass — Chapter 6 fixes it in the database.</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p>Because <code>Clock</code> is a provider, "now" is 08:00 on 1 December 2026 in every run — the test will still pass next year.</p>

<h3>README section</h3>
<pre><code>${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Self-check before committing:</strong> the app starts; the graph has no cycle; no provider appears in two modules; removing an export breaks startup with "can't resolve" (try it once, then revert); the new test passes with a fixed clock.</p>
</div>
${THE}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Dự án</span>
<h2>2.8 — Mốc 2: dựng tường bên trong dự án</h2>
<p class="lead">Ở mốc 1 bạn có một tài nguyên. Giờ cho đề tài thêm tài nguyên thứ hai <em>phụ thuộc</em> tài nguyên đầu, và đặt mỗi cái vào module riêng với một cửa có chủ ý. Sản phẩm của mốc này không phải thêm endpoint; mà là một cấu trúc bạn cùng nhóm đọc được ngay từ README.</p>

<h3>Các bước</h3>
<ol>
<li>Mỗi tính năng một module (<code>nest g module</code>, <code>nest g service</code>, <code>nest g controller</code>). Tài nguyên thứ hai phải dùng service của tài nguyên đầu.</li>
<li>Chỉ export thứ module khác gọi tới. Repository và hàm phụ trợ giữ kín.</li>
<li>Thứ gì phụ thuộc thời gian, ngẫu nhiên hay môi trường thì thành provider tiêm được (ít nhất một <code>Clock</code>), để test cố định được.</li>
<li>Tối đa một module <code>@Global</code>, dành cho hạ tầng, và ghi lý do trong README.</li>
<li>In đồ thị module từ chính container đang chạy (đoạn mã bên dưới) và dán vào README kèm các luật.</li>
<li>Một test đơn vị cho service mới dùng <code>overrideProvider</code>. Commit: <code>feat: tách module tính năng (mốc 2)</code>.</li>
</ol>

<h3>Ví dụ làm sẵn: <code>BookingsModule</code> cho dự án đặt phòng lab</h3>
<pre><code>${esc(CAY)}</code></pre>
<pre><code class="language-ts">${esc(MA_CLOCK)}</code></pre>
<pre><code class="language-ts">${esc(MA_RMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_BMOD)}</code></pre>
<pre><code class="language-ts">${esc(MA_BSVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_APP)}</code></pre>
<p>Đồ thị, in ra từ chính <code>ModulesContainer</code> của Nest — không sơ đồ vẽ tay nào lệch được với mã:</p>
<pre><code class="language-ts">${esc(MA_DOTHI)}</code></pre>
<div class="out">${esc(OUT_DOTHI)}</div>
<p>Để ý <code>RoomsModule imports: ClockModule</code> dù không ai viết dòng đó: đây là cách <code>@Global</code> chạy bên trong — Nest nối module global vào mọi module.</p>
<pre><code class="language-bash">${esc(OUT_CURL)}</code></pre>
<p>201, rồi 409 vì trùng giờ, 400 vì quá sức chứa, 404 vì phòng không tồn tại, 400 vì đặt vào quá khứ. Dấu <code>⚠</code> trong service đánh dấu một race condition: hai request kiểm cùng lúc có thể cùng lọt — Chương 6 sửa nó ở tầng cơ sở dữ liệu.</p>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<div class="out">${esc(OUT_SPEC)}</div>
<p>Vì <code>Clock</code> là provider, "bây giờ" luôn là 08:00 ngày 1/12/2026 ở mọi lần chạy — sang năm test vẫn xanh.</p>

<h3>Mục README</h3>
<pre><code>${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Tự kiểm trước khi commit:</strong> ứng dụng khởi động được; đồ thị không có vòng; không provider nào nằm ở hai module; bỏ một export thì khởi động lỗi "can't resolve" (thử một lần rồi hoàn lại); test mới xanh với đồng hồ cố định.</p>
</div>
${THE}
</div>
`,
};
