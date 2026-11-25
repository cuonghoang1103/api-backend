/**
 * 12.3 — Lõi: giờ mở cửa, hạn mức lịch chờ duyệt khi đồng thời, luồng trạng thái, quyền sở hữu (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, Prisma 7.10.1, PostgreSQL 16.16, Vitest 4.1.12): lab/c12/moc12 — bản ngây thơ lưu ở
 * lab/c12/o/123-service-ngay-tho.ts; bộ chấm ../chay-cham.sh; ép tải cham/ep.mjs; test ../o12db.sh ⇒ lab/c12/o/123-*.txt.
 * Ghép: gen.mjs rồi ghep.sh 123 nst-12-3-dat-lich.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-6-5-chong-dat-trung', title: 'NestJS 6.5 — Chống đặt trùng', sub: 'EXCLUDE constraint và khoá lạc quan — nền của mục 4.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-7-4-so-huu', title: 'NestJS 7.4 — Quyền theo chủ sở hữu (CASL)', sub: 'Vì sao ẩn thì 404, thấy mà không được làm thì 403.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-12-4-nguyen-tu-rate-limit-lock', title: 'Node.js 12.4 — Thao tác nguyên tử, khoá Redis', sub: 'Cùng bài toán "đếm rồi ghi", giải ở tầng Redis.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-9-2-schedule', title: 'NestJS 9.2 — Lịch cron và múi giờ', sub: 'TZ=UTC làm 7 giờ thành 14 giờ; sự cố Azure 29/02/2012.', cta: 'Mở bài →' }),
].join('\n');
const NGUON = [
  nguon('📘', 'PostgreSQL 16 — B.5 POSIX Time Zone Specifications', '"The positive sign is used for zones west of Greenwich" — ngược ISO-8601.', 'https://www.postgresql.org/docs/16/datetime-posix-timezone-specs.html'),
  nguon('📘', 'PostgreSQL 16 — Advisory Locks', 'pg_advisory_xact_lock: khoá theo số, tự nhả khi transaction kết thúc.', 'https://www.postgresql.org/docs/16/explicit-locking.html#ADVISORY-LOCKS'),
].join('\n');
const MA_GIO = "// gio-mo-cua.ts — mốc 12: lịch phải nằm trọn trong giờ mở cửa của phòng, tính theo giờ VIỆT NAM. Hàm thuần: test không cần DB.\n// Vì sao lệch cố định +07:00 mà không dùng Intl/tz database: Việt Nam không đổi giờ mùa hè từ 1975, và ảnh node:alpine\n// không mang đủ dữ liệu múi giờ (ADR-004, bài 12.2). Nếu một ngày phòng lab mở ở nước có giờ mùa hè ⇒ đổi sang Temporal/Intl.\nexport const LECH_VN_PHUT = 7 * 60;\n\n/** Ngày (đếm từ 1970-01-01 theo giờ VN) và phút trong ngày của một thời điểm */\nexport function gioVN(d: Date) {\n  const t = Math.floor(d.getTime() / 60_000) + LECH_VN_PHUT;\n  return { ngay: Math.floor(t / 1440), phut: ((t % 1440) + 1440) % 1440 };\n}\nexport const hhmm = (phut: number) => `${String(Math.floor(phut / 60)).padStart(2, '0')}:${String(phut % 60).padStart(2, '0')}`;\nexport const docHhmm = (s: string) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));\n\n/** null = hợp lệ; chuỗi = lý do từ chối (đưa thẳng vào thông báo lỗi 400) */\nexport function ngoaiGioMoCua(start: Date, end: Date, openMin: number, closeMin: number): string | null {\n  const a = gioVN(start), b = gioVN(end);\n  const cuoi = b.ngay === a.ngay + 1 && b.phut === 0 ? 1440 : b.phut;          // kết thúc đúng 24:00 vẫn là \"trong ngày\"\n  if (b.ngay !== a.ngay && cuoi !== 1440) return 'lịch phải bắt đầu và kết thúc trong cùng một ngày (giờ Việt Nam)';\n  if (a.phut < openMin || cuoi > closeMin) return `phòng mở ${hhmm(openMin)}–${hhmm(closeMin)} (giờ Việt Nam), lịch xin ${hhmm(a.phut)}–${hhmm(cuoi)}`;\n  return null;\n}";
const MA_NGAY_THO = "    const ngoai = ngoaiGioMoCua(s, e, room.openMin, room.closeMin);                                  // mốc 12\n    if (ngoai) throw new BadRequestException(ngoai, { errorCode: 'OUTSIDE_OPENING_HOURS' });\n    if (u.role !== 'ADMIN') {\n      // mốc 12 — BẢN NGÂY THƠ: đếm rồi mới ghi, hai câu lệnh rời nhau\n      const dangCho = await this.db.booking.count({ where: { userId: u.id, status: 'PENDING', start: { gt: this.clock.now() } } });\n      if (dangCho >= TOI_DA_CHO_DUYET) throw new ConflictException(`bạn đã có ${dangCho} lịch chờ duyệt (tối đa ${TOI_DA_CHO_DUYET})`, { errorCode: 'PENDING_LIMIT' });\n    }";
const OUT_NGAY_THO = "✓ L6 [Lõi] một SV giữ 6 khung chờ duyệt liên tiếp ⇒ chỉ 3 được nhận — 201 201 201 409 409 409\n✗ L7 [Lõi] một SV bắn 10 khung khác nhau CÙNG LÚC ⇒ chỉ 3 được nhận — {\"201\":8,\"409\":2}\nKẾT QUẢ: 14/15 đạt — trượt: L7";
const MA_KHOA = "    try {\n      // mốc 12: \"đếm lịch chờ rồi mới ghi\" phải là MỘT đơn vị — hai request cùng người chạy song song thì cả hai cùng đếm thấy 2.\n      // Khoá tư vấn theo người dùng trong transaction: request thứ hai của CÙNG người đứng chờ tới khi cái đầu commit/rollback;\n      // người khác không bị chặn. (Số 1 = không gian khoá \"quota lịch chờ\"; khoá tự nhả khi transaction kết thúc.)\n      const moi = await this.db.$transaction(async (tx) => {\n        if (u.role !== 'ADMIN') {\n          await tx.$executeRaw`SELECT pg_advisory_xact_lock(1, ${u.id}::int)`;\n          const dangCho = await tx.booking.count({ where: { userId: u.id, status: 'PENDING', start: { gt: this.clock.now() } } });\n          if (dangCho >= TOI_DA_CHO_DUYET) throw new ConflictException(`bạn đã có ${dangCho} lịch chờ duyệt (tối đa ${TOI_DA_CHO_DUYET})`, { errorCode: 'PENDING_LIMIT' });\n        }\n        // KHÔNG kiểm trùng bằng findFirst rồi mới ghi: ràng buộc EXCLUDE trong DB là người gác duy nhất (bài 6.5)\n        return tx.booking.create({ data: {\n          roomId: b.roomId, userId: u.id, studentId: u.studentCode, start: s, end: e, attendees: b.attendees, note: b.note, createdBy: `user:${u.id}`,\n        } });\n      });";
const OUT_KHOA = "✓ L1 [Lõi] 50 request đồng thời cùng khung ⇒ đúng một 201 — {\"201\":1,\"409\":49}\n✓ L6 [Lõi] một SV giữ 6 khung chờ duyệt liên tiếp ⇒ chỉ 3 được nhận — 201 201 201 409 409 409\n✓ L7 [Lõi] một SV bắn 10 khung khác nhau CÙNG LÚC ⇒ chỉ 3 được nhận — {\"201\":3,\"409\":7}\nKẾT QUẢ: 15/15 đạt";
const OUT_EP = "N=10 một tài khoản ⇒ {\"201\":3,\"409\":7} · request chậm nhất 361 ms\nN=60 một tài khoản ⇒ {\"201\":3,\"409\":57} · request chậm nhất 551 ms\nN=200 một tài khoản ⇒ {\"201\":3,\"409\":197} · request chậm nhất 1368 ms";
const OUT_TZ = "     chuoi '+07'     |  interval '+07:00'  |  Asia/Ho_Chi_Minh   \n---------------------+---------------------+---------------------\n 2027-02-28 17:00:00 | 2027-03-01 07:00:00 | 2027-03-01 07:00:00\n(1 row)";
const MA_SETHOURS = "  /** mốc 12: đổi giờ mở cửa. KHÔNG tự huỷ lịch đã có ngoài giờ mới — trả về danh sách để admin báo người đặt (ADR-005) */\n  async setHours(id: number, d: RoomHoursDto) {\n    const openMin = docHhmm(d.open), closeMin = docHhmm(d.close);\n    if (openMin >= closeMin) throw new BadRequestException(`open (${d.open}) phải trước close (${d.close})`, { errorCode: 'ROOM_HOURS_INVALID' });\n    const room = await this.db.room.update({ where: { id }, data: { openMin, closeMin } }).catch((e) => {\n      if (laPrisma(e, 'P2025')) throw new NotFoundException(`Room ${id} not found`, { errorCode: 'ROOM_NOT_FOUND' });\n      throw e;\n    });\n    // lịch còn hiệu lực, chưa diễn ra, nằm ngoài giờ mới — so bằng giờ VN ngay trong SQL.\n    // BẪY: AT TIME ZONE '+07' (chuỗi) theo quy ước POSIX = UTC−7! Phải là INTERVAL '+07:00' (hoặc 'Asia/Ho_Chi_Minh') — bài 12.3\n    const ngoai = await this.db.$queryRaw<{ id: number }[]>`\n      SELECT id FROM bookings\n      WHERE room_id = ${id} AND status IN ('PENDING', 'APPROVED') AND start > ${this.clock.now()}\n        AND ( extract(hour FROM start AT TIME ZONE INTERVAL '+07:00') * 60 + extract(minute FROM start AT TIME ZONE INTERVAL '+07:00') < ${openMin}\n           OR extract(hour FROM \"end\" AT TIME ZONE INTERVAL '+07:00') * 60 + extract(minute FROM \"end\" AT TIME ZONE INTERVAL '+07:00') > ${closeMin} )\n      ORDER BY start`;";
const OUT_LAN1 = "⎯⎯⎯⎯⎯⎯⎯ Failed Tests 4 ⎯⎯⎯⎯⎯⎯⎯\nFAIL src/bookings/bookings.service.db.spec.ts > BookingsService (đồng hồ cố định, PostgreSQL thật) > 20 lượt đặt đồng thời cùng khung giờ ⇒ 1 thành công, 19 BOOKING_CONFLICT\nAssertionError: expected [ 'PENDING_LIMIT', …(18) ] to deeply equal [ 'BOOKING_CONFLICT', …(18) ]\nFAIL src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > trước giờ bắt đầu ⇒ huỷ được\nError: expected 201 \"Created\", got 409 \"Conflict\"\nFAIL src/bookings/dac-ta.e2e.spec.ts > đề 0.2: \"người đặt được HUỶ trước giờ bắt đầu\" > đã bắt đầu (07:30, bây giờ 08:00) ⇒ không huỷ được\nError: expected 201 \"Created\", got 409 \"Conflict\"\nFAIL src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > PATCH phòng: không ghi đè id, trường không gửi giữ nguyên\nAssertionError: expected { id: 1, code: 'AL-201', …(5) } to deeply equal { id: 1, code: 'AL-201', …(3) }\n      Tests  4 failed | 53 passed (57)";
const OUT_POSIX = "AssertionError: expected { id: 1, code: 'AL-201', …(6) } to match object { id: 1, open: '08:00', …(2) }\n(4 matching properties omitted from actual)\n- Expected\n+ Received\n  {\n    \"close\": \"20:00\",\n    \"id\": 1,\n    \"ngoaiGioMoi\": [\n-     4,\n+     2,\n+     5,\n      6,\n    ],\n    \"open\": \"08:00\",";
const MA_TEST = "describe('US-06 — mỗi người tối đa 3 lịch CHỜ DUYỆT (chống giữ chỗ hàng loạt)', () => {\n  it('lịch thứ 4 ⇒ 409 PENDING_LIMIT; huỷ một cái thì đặt lại được', async () => {\n    const ids: number[] = [];\n    for (const [tu, den] of [['07:00', '08:00'], ['09:00', '10:00'], ['11:00', '12:00']]) ids.push((await dat('an', '10', tu, den).expect(201)).body.id);\n    const r = await dat('an', '10', '13:00', '14:00').expect(409);\n    expect(r.body).toMatchObject({ type: expect.stringMatching(/PENDING_LIMIT$/), detail: 'bạn đã có 3 lịch chờ duyệt (tối đa 3)' });\n    await http().delete(`/bookings/${ids[0]}`).set(bearer(app, 'an')).expect(200);\n    await dat('an', '10', '13:00', '14:00').expect(201);\n  });\n  it('lịch ĐÃ DUYỆT không tính vào hạn mức', async () => {\n    const id = (await dat('binh', '11', '07:00', '08:00').expect(201)).body.id;\n    await http().patch(`/bookings/${id}/approve`).set(bearer(app, 'gv')).expect(200);\n    for (const g of ['09', '11', '13']) await dat('binh', '11', `${g}:00`, `${g}:30`).expect(201);\n    await dat('binh', '11', '15:00', '15:30').expect(409);\n  });\n  it('10 request CÙNG LÚC của một người (khung khác nhau) ⇒ đúng 3 thành công', async () => {\n    const kq = await Promise.all(Array.from({ length: 10 }, (_, i) => dat('gv2', String(12 + i), '08:00', '09:00')));\n    expect(kq.map((r) => r.status).sort((x, y) => x - y)).toEqual([201, 201, 201, ...Array(7).fill(409)]);\n  });\n  it('admin không vướng hạn mức', async () => {\n    for (const g of ['07', '09', '11', '13', '15']) await dat('admin', '25', `${g}:00`, `${g}:30`).expect(201);\n  });\n});";
const OUT_XANH = " Test Files  13 passed (13)\n      Tests  65 passed (65)";
const MA_SER = "async function dat(i) {\n  for (let lan = 1; ; lan++) {\n    try {\n      return await db.$transaction(async (tx) => {\n        const n = await tx.booking.count({ where: { userId: u.id, status: 'PENDING', start: { gt: new Date() } } });\n        if (n >= 3) return 'PENDING_LIMIT';\n        await tx.booking.create({ data: { roomId: room.id, userId: u.id, start: new Date(Date.UTC(2028, 0, 1 + i, 2)), end: new Date(Date.UTC(2028, 0, 1 + i, 3)), attendees: 3, createdBy: 'thu' } });\n        return 'TAO';\n      }, { isolationLevel: 'Serializable' });\n    } catch (e) {\n      const ma = e instanceof Prisma.PrismaClientKnownRequestError ? e.code : e.constructor.name;\n      maLoi[ma] = (maLoi[ma] ?? 0) + 1;\n      if (ma === 'DriverAdapterError' && !globalThis.daIn) { globalThis.daIn = 1; console.log('DriverAdapterError:', JSON.stringify({ message: e.message, cause: e.cause })); }\n      // 40001 đến theo HAI đường: P2034 (lỗi khi chạy câu lệnh) hoặc DriverAdapterError có cause.originalCode (lỗi lúc COMMIT)\n      const tuanTu = ma === 'P2034' || e?.cause?.originalCode === '40001';\n      if (tuanTu && lan < (Number(process.env.SO_LAN) || 5)) { thuLai++; continue; }\n      return `LỖI ${ma}`;\n    }\n  }\n}";
const OUT_SER1 = "kết quả: {\"TAO\":3,\"PENDING_LIMIT\":6,\"LỖI DriverAdapterError\":1} · lượt thử lại: 5 · mã lỗi gặp: {\"P2034\":5,\"DriverAdapterError\":1}\nlịch PENDING trong DB: 3\nkết quả: {\"TAO\":3,\"PENDING_LIMIT\":5,\"LỖI DriverAdapterError\":2} · lượt thử lại: 5 · mã lỗi gặp: {\"DriverAdapterError\":2,\"P2034\":5}\nlịch PENDING trong DB: 3\nkết quả: {\"TAO\":3,\"PENDING_LIMIT\":6,\"LỖI DriverAdapterError\":1} · lượt thử lại: 5 · mã lỗi gặp: {\"P2034\":5,\"DriverAdapterError\":1}\nlịch PENDING trong DB: 3";
const OUT_SER2 = "kết quả: {\"TAO\":3,\"PENDING_LIMIT\":7} · lượt thử lại: 10 · mã lỗi gặp: {\"DriverAdapterError\":3,\"P2034\":7}\nlịch PENDING trong DB: 3\nkết quả: {\"TAO\":3,\"PENDING_LIMIT\":7} · lượt thử lại: 11 · mã lỗi gặp: {\"DriverAdapterError\":5,\"P2034\":6}\nlịch PENDING trong DB: 3\nkết quả: {\"TAO\":3,\"PENDING_LIMIT\":7} · lượt thử lại: 7 · mã lỗi gặp: {\"DriverAdapterError\":3,\"P2034\":4}\nlịch PENDING trong DB: 3";
const OUT_PHA = "# THỬ PHÁ 1: bỏ dòng pg_advisory_xact_lock\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected [ 201, 201, 201, 201, 201, 409, …(4) ] to deeply equal [ 201, 201, 201, 409, 409, 409, …(4) ]\n      Tests  1 failed | 7 passed (8)\n# THỬ PHÁ 2: AT TIME ZONE INTERVAL '+07:00' → '+07'\n⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯\nAssertionError: expected { id: 1, code: 'AL-201', …(6) } to match object { id: 1, open: '08:00', …(2) }\n      Tests  1 failed | 7 passed (8)";

const TT = [
  ['PENDING', 'APPROVED / REJECTED', 'lecturer of the room, admin', 'giảng viên phụ trách, admin', 'only while PENDING', 'chỉ khi đang PENDING'],
  ['PENDING / APPROVED', 'CANCELLED', 'owner (before start), admin (any time)', 'chủ lịch (trước giờ bắt đầu), admin (bất kỳ lúc nào)', 'releases the slot', 'trả lại khung giờ'],
  ['PENDING', 'EXPIRED', 'cron het-han every 5 min', 'cron het-han mỗi 5 phút', 'start time passed, nobody decided', 'tới giờ mà chưa ai quyết'],
];
const bangTT = (vi) => `<table>
<thead><tr><th>${vi ? 'Từ' : 'From'}</th><th>${vi ? 'Sang' : 'To'}</th><th>${vi ? 'Ai' : 'Who'}</th><th>${vi ? 'Điều kiện' : 'Condition'}</th></tr></thead>
<tbody>
${TT.map(([a, b, en, viA, cen, cvi]) => `<tr><td><code>${a}</code></td><td><code>${b}</code></td><td>${vi ? viA : en}</td><td>${vi ? cvi : cen}</td></tr>`).join('\n')}
</tbody>
</table>`;

export default {
  title: '12.3 — Core: booking without double booking, approval flow and ownership|||12.3 — Lõi: đặt lịch không trùng, luồng duyệt và quyền sở hữu',
  slug: 'nst-12-3-dat-lich',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Lấp hai khoảng trống bộ chấm tìm ra: giờ mở cửa theo giờ Việt Nam (hàm thuần + CHECK) và hạn mức 3 lịch chờ duyệt. Bản ngây thơ đếm rồi ghi: 10 request đồng thời lọt 8; khoá tư vấn trong transaction: đúng 3, 200 request vẫn 0 lỗi 5xx. Thêm bẫy thật: AT TIME ZONE "+07" trong PostgreSQL là UTC−7 — test bắt được. Bốn test cũ đỏ, mỗi cái một lý do; cuối 65/65.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 3</span>
<h2>12.3 — Two new rules, one race, one time-zone trap</h2>
<p class="lead">The grader in 12.1 failed on four checks: opening hours (L4, L5) and the pending limit (L6, L7). This lesson builds both, the naive way first where that teaches something, and measures every step. The overlap rule and ownership already hold since milestones 6–7; the state table below is the whole flow in one place.</p>

<h3>Everyday analogy: the clinic queue ticket</h3>
<p>A clinic hands out numbered tickets only during opening hours, and each patient may hold one ticket per department. If two receptionists each look at the list, see "Mr. Nam has no ticket", and both print one, he now has two. The fix is not a more careful look — it is one receptionist at a time for Mr. Nam. That is exactly the advisory lock in section 4.</p>

<h3>1. The booking flow</h3>
${bangTT(false)}
<p>The EXCLUDE constraint covers <code>PENDING</code> and <code>APPROVED</code> (ADR-002), so "first request holds the slot". Ownership is the CASL policy from 7.4: a booking you may not see is 404, one you may see but not change is 403 with the reason.</p>

<h3>2. Opening hours as a pure function</h3>
<pre><code class="language-ts">${esc(MA_GIO)}</code></pre>
<p>Five unit tests (no database) pin the edges: exactly 07:00 and 21:00 pass, a UTC input <code>00:00Z</code> is 07:00 in Vietnam, 06:30 and 21:30 fail, a booking across midnight fails, and an end of exactly 24:00 counts as the same day. In the service it is two lines, before the transaction:</p>
<pre><code class="language-ts">${esc(MA_NGAY_THO.split('\n').slice(0, 2).join('\n'))}</code></pre>

<h3>3. Changing hours — and a trap in PostgreSQL</h3>
<p>When an admin narrows the hours, the response lists upcoming bookings that now fall outside (ADR-005: tell people, do not silently cancel). The query compares local times in SQL. The first version used <code>AT TIME ZONE '+07'</code>. Check what PostgreSQL does with that:</p>
<pre><code class="language-text">${esc(OUT_TZ)}</code></pre>
<p>A string like <code>'+07'</code> is a POSIX time-zone specification, and in POSIX "the positive sign is used for zones west of Greenwich" — the opposite of ISO 8601. <code>'+07'</code> means UTC−7. The e2e test caught it before any reasoning did:</p>
<pre><code class="language-text">${esc(OUT_POSIX)}</code></pre>
<p>Booking 4 (07:30–09:30) should have been reported and was not; booking 5 (10:00–12:00, inside the new hours) was reported wrongly. The fixed query uses <code>INTERVAL '+07:00'</code>:</p>
<pre><code class="language-ts">${esc(MA_SETHOURS)}</code></pre>

<h3>4. The pending limit: count, then insert — the race</h3>
<p>First version, two separate statements:</p>
<pre><code class="language-ts">${esc(MA_NGAY_THO.split('\n').slice(2).join('\n'))}</code></pre>
<pre><code class="language-text">${esc(OUT_NGAY_THO)}</code></pre>
<p>Sequentially the rule works (L6: three 201, then 409). Ten requests at the same moment: eight accepted. Each request ran its <code>COUNT</code> before any other had inserted, so all saw a number below 3. The overlap rule never had this problem because the database itself checks overlap on insert; a quota is a rule about <em>other rows</em>, which no single-row constraint can see.</p>
<p>Fix: make "count + insert" one unit per user. A transaction alone is not enough (at READ COMMITTED both transactions still read the old count); something must make the second request <em>wait</em>. There is no row to <code>SELECT … FOR UPDATE</code> for "the set of my pending bookings", so lock a number instead:</p>
<pre><code class="language-ts">${esc(MA_KHOA)}</code></pre>
<pre><code class="language-text">${esc(OUT_KHOA)}</code></pre>
<p>Exactly three. The lock is per user — key <code>(1, userId)</code> — so other students are never blocked, and it is released automatically at commit or rollback (no "forgot to unlock"). What does the waiting cost? One account firing N concurrent requests (<code>cham/ep.mjs</code>, pool of 10 connections):</p>
<pre><code class="language-text">${esc(OUT_EP)}</code></pre>
<p>Still exactly three accepted, no 5xx; the slowest of 200 waited 1.4 s. Fine for a booking form — and the global rate limit (100/min/IP) stops a single client long before that. Alternatives worth naming in a defence: <code>SERIALIZABLE</code> isolation (correct, but the losers get serialization errors you must retry), a counter column on <code>users</code> updated with <code>FOR UPDATE</code> (works, one more column to keep in sync), a Redis lock (fast, but now correctness depends on a second system).</p>

<h3>🕵️ Hacker corner — the same shape you met in 6.5</h3>
<p>Lesson 6.5 told the Starbucks gift-card race (2015): two concurrent transfers both read the old balance. L7 is the same bug with a different noun — "check, then act" in two steps. The author's conclusion then applies here: rate limits and "careful" code do not fix it; a pessimistic lock does, and <code>pg_advisory_xact_lock</code> is one. Dates are the other classic: the Azure leap-day outage (lesson 9.2) is why our time code is small, boring and unit-tested at the edges.</p>

<h3>5. Four old tests went red — each for a reason</h3>
<pre><code class="language-text">${esc(OUT_LAN1)}</code></pre>
<ul>
<li>The 20-concurrent test and the cancel tests: the test user already held 2–3 pending bookings from earlier tests in the same file, so the new limit answered first. Correct behaviour, but the tests no longer measured what they were written for. The concurrency test now books as admin (no quota, only EXCLUDE decides); the cancel tests use another student.</li>
<li>The milestone-4 PATCH test: room responses gained <code>open</code>/<code>close</code>. A contract change — updated on purpose, and visible in <code>openapi.json</code> (12.2).</li>
</ul>
<p>New tests for US-06:</p>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<pre><code class="language-text">${esc(OUT_XANH)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA)}</code></pre>
<p>Both protections were removed once and the tests failed with the expected message. One caution: a concurrency test can pass by luck when the requests happen not to overlap; ten requests made the race show every time here, but run it a few times before trusting a green.</p>

<h3>🧪 Exercise (60 min)</h3>
<ol>
<li>Pick the "quota-like" rule in your project (seats per event, loans per student…). Implement count-then-insert, write the 10-concurrent test, see it fail.</li>
<li>Fix it with an advisory lock; then implement the <code>SERIALIZABLE</code> variant with a retry loop and compare: accepted count, 5xx count, slowest request.</li>
</ol>
<details><summary>Show the SERIALIZABLE variant (run for real: scripts/thu-serializable.mjs)</summary>
<p>First attempt retried only on Prisma's <code>P2034</code>:</p>
<pre><code class="language-text">${esc(OUT_SER1)}</code></pre>
<p>The quota held (3 in the database), but 1–2 requests per run ended as an unhandled <code>DriverAdapterError</code> — a 500 for the user. With the pg driver adapter, SQLSTATE <code>40001</code> arrives two ways: as <code>P2034</code> when a statement fails, and as a raw <code>DriverAdapterError</code> with <code>cause.originalCode</code> when the <code>COMMIT</code> fails. Retry on both:</p>
<pre><code class="language-js">${esc(MA_SER)}</code></pre>
<pre><code class="language-text">${esc(OUT_SER2)}</code></pre>
<p>Three runs: always 3 created, 0 errors, 7–11 retries for 10 requests. The advisory lock got the same result with zero retries — that is the trade-off to explain.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>"Why didn't a transaction alone fix the quota?"</strong> — At READ COMMITTED two transactions both read the old count; nothing makes one wait. You need a lock, a constraint, or SERIALIZABLE with retries.</li>
<li><strong>"Advisory lock vs SELECT FOR UPDATE?"</strong> — FOR UPDATE locks existing rows; for "the set of my pending bookings" there is no row, so lock a key derived from the user id.</li>
<li><strong>"How do you store times?"</strong> — Instants as timestamptz (UTC); local rules (opening hours) as local values with an explicit zone; never compare local strings across zones.</li>
<li><strong>"Your test went red after a change — did you just update it?"</strong> — Explain the reason first: the 4 reds above had 3 different causes, and only one was a deliberate contract change.</li>
</ol>

<h3>💼 On the job</h3>
<p>"Count then insert" hides in many tickets: vouchers per customer, free trials per device, seats per class. In code review, whenever you see a <code>count()</code> or <code>findFirst()</code> followed by a <code>create()</code>, ask "what if two of these run at once?" — and ask for a concurrency test. It is one of the most common bugs that unit tests with mocks can never find.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Check-then-act race</span><span class="v">Two requests check a condition before either acts, so both act.</span></div>
  <div class="kv"><span class="k">Advisory lock</span><span class="v">A lock on an application-chosen number; the database does not know what it protects.</span></div>
  <div class="kv"><span class="k">pg_advisory_xact_lock</span><span class="v">Advisory lock held until the transaction ends — no explicit unlock.</span></div>
  <div class="kv"><span class="k">POSIX time-zone string</span><span class="v">Format where '+07' means 7 hours <em>west</em> of UTC.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Opening hours: pure function on Vietnam local minutes + CHECK in the database.</li>
<li>AT TIME ZONE '+07' is UTC−7; use INTERVAL '+07:00' or a named zone. A test caught it.</li>
<li>Count-then-insert let 8 of 10 concurrent requests through; a per-user advisory lock in the transaction gives exactly 3, no 5xx at 200 requests.</li>
<li>Four old reds, three causes; 65/65 green; both protections proven by breaking them.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 3</span>
<h2>12.3 — Hai luật mới, một cuộc đua, một cái bẫy múi giờ</h2>
<p class="lead">Bộ chấm ở 12.1 trượt bốn mục: giờ mở cửa (L4, L5) và hạn mức lịch chờ (L6, L7). Bài này dựng cả hai — làm kiểu ngây thơ trước ở chỗ nào nó dạy được điều gì — và đo từng bước. Luật không chồng giờ và quyền sở hữu đã có từ mốc 6–7; bảng trạng thái dưới đây gom cả luồng vào một chỗ.</p>

<h3>Liên hệ đời thường: số thứ tự ở phòng khám</h3>
<p>Phòng khám chỉ phát số trong giờ làm việc, mỗi bệnh nhân giữ một số cho mỗi khoa. Nếu hai cô lễ tân cùng nhìn danh sách, cùng thấy "ông Nam chưa có số", và cùng in một số, ông Nam có hai số. Cách sửa không phải là nhìn kỹ hơn — mà là mỗi lúc chỉ một cô lễ tân được xử lý ông Nam. Đó chính là khoá tư vấn ở mục 4.</p>

<h3>1. Luồng của một lịch đặt</h3>
${bangTT(true)}
<p>Ràng buộc EXCLUDE tính cả <code>PENDING</code> và <code>APPROVED</code> (ADR-002), nên "ai xin trước giữ chỗ trước". Quyền sở hữu là chính sách CASL từ bài 7.4: lịch bạn không được thấy thì 404, lịch thấy được mà không được đổi thì 403 kèm lý do.</p>

<h3>2. Giờ mở cửa là một hàm thuần</h3>
<pre><code class="language-ts">${esc(MA_GIO)}</code></pre>
<p>Năm test đơn vị (không cần cơ sở dữ liệu) ghim các mép: đúng 07:00 và 21:00 thì qua, đầu vào UTC <code>00:00Z</code> là 07:00 giờ Việt Nam, 06:30 và 21:30 thì trượt, lịch vắt qua nửa đêm thì trượt, kết thúc đúng 24:00 vẫn tính là cùng ngày. Trong service chỉ là hai dòng, đặt trước transaction:</p>
<pre><code class="language-ts">${esc(MA_NGAY_THO.split('\n').slice(0, 2).join('\n'))}</code></pre>

<h3>3. Đổi giờ mở cửa — và một cái bẫy trong PostgreSQL</h3>
<p>Khi admin thu hẹp giờ, phản hồi liệt kê các lịch sắp tới giờ nằm ngoài giờ mới (ADR-005: báo cho người đặt, không âm thầm huỷ). Câu truy vấn so giờ địa phương ngay trong SQL. Bản đầu dùng <code>AT TIME ZONE '+07'</code>. Xem PostgreSQL làm gì với nó:</p>
<pre><code class="language-text">${esc(OUT_TZ)}</code></pre>
<p>Chuỗi kiểu <code>'+07'</code> là một đặc tả múi giờ POSIX, và trong POSIX "dấu dương dùng cho các múi phía tây Greenwich" — ngược với ISO 8601. <code>'+07'</code> nghĩa là UTC−7. Test e2e bắt được trước khi kịp suy luận:</p>
<pre><code class="language-text">${esc(OUT_POSIX)}</code></pre>
<p>Lịch 4 (07:30–09:30) đáng lẽ phải được báo mà không; lịch 5 (10:00–12:00, nằm trong giờ mới) lại bị báo nhầm. Câu truy vấn đã sửa dùng <code>INTERVAL '+07:00'</code>:</p>
<pre><code class="language-ts">${esc(MA_SETHOURS)}</code></pre>

<h3>4. Hạn mức lịch chờ: đếm rồi mới ghi — cuộc đua</h3>
<p>Bản đầu, hai câu lệnh rời nhau:</p>
<pre><code class="language-ts">${esc(MA_NGAY_THO.split('\n').slice(2).join('\n'))}</code></pre>
<pre><code class="language-text">${esc(OUT_NGAY_THO)}</code></pre>
<p>Gửi lần lượt thì luật chạy đúng (L6: ba 201, rồi 409). Mười request cùng lúc: tám cái được nhận. Request nào cũng chạy <code>COUNT</code> trước khi request khác kịp ghi, nên cái nào cũng thấy con số dưới 3. Luật không chồng giờ không bao giờ gặp chuyện này vì chính cơ sở dữ liệu kiểm chồng giờ lúc ghi; còn hạn mức là luật về <em>các dòng khác</em>, thứ mà ràng buộc trên một dòng không nhìn thấy.</p>
<p>Cách sửa: biến "đếm + ghi" thành một đơn vị cho mỗi người. Chỉ một transaction là chưa đủ (ở mức READ COMMITTED, hai transaction vẫn cùng đọc con số cũ); phải có thứ bắt request thứ hai <em>đứng chờ</em>. Không có dòng nào để <code>SELECT … FOR UPDATE</code> cho "tập lịch chờ của tôi", nên khoá một con số thay vì một dòng:</p>
<pre><code class="language-ts">${esc(MA_KHOA)}</code></pre>
<pre><code class="language-text">${esc(OUT_KHOA)}</code></pre>
<p>Đúng ba. Khoá theo từng người — khoá <code>(1, userId)</code> — nên sinh viên khác không bao giờ bị chặn, và nó tự nhả khi commit hoặc rollback (không có chuyện "quên mở khoá"). Việc đứng chờ tốn bao nhiêu? Một tài khoản bắn N request đồng thời (<code>cham/ep.mjs</code>, pool 10 kết nối):</p>
<pre><code class="language-text">${esc(OUT_EP)}</code></pre>
<p>Vẫn đúng ba được nhận, không có lỗi 5xx; request chậm nhất trong 200 cái chờ 1,4 giây. Với một biểu mẫu đặt lịch thì ổn — và giới hạn tốc độ chung (100/phút/IP) chặn một client từ lâu trước đó. Các phương án khác nên kể được khi bảo vệ: mức cô lập <code>SERIALIZABLE</code> (đúng, nhưng bên thua nhận lỗi tuần tự hoá và phải tự thử lại), một cột đếm trên <code>users</code> cập nhật bằng <code>FOR UPDATE</code> (chạy được, thêm một cột phải giữ khớp), khoá Redis (nhanh, nhưng sự đúng đắn giờ phụ thuộc thêm một hệ thống).</p>

<h3>🕵️ Góc hacker — đúng hình dạng bạn đã gặp ở 6.5</h3>
<p>Bài 6.5 đã kể vụ thẻ quà tặng Starbucks (2015): hai lần chuyển tiền đồng thời cùng đọc số dư cũ. L7 là cùng một lỗi, chỉ khác danh từ — "kiểm rồi mới làm" trong hai bước. Kết luận của tác giả khi đó áp dụng y nguyên ở đây: giới hạn tốc độ hay mã "cẩn thận" không sửa được; khoá bi quan thì sửa được, và <code>pg_advisory_xact_lock</code> là một loại như thế. Ngày giờ là kiểu lỗi kinh điển còn lại: sự cố ngày nhuận của Azure (bài 9.2) là lý do mã thời gian của ta nhỏ, nhàm và có test đơn vị ở các mép.</p>

<h3>5. Bốn test cũ đỏ — mỗi cái một lý do</h3>
<pre><code class="language-text">${esc(OUT_LAN1)}</code></pre>
<ul>
<li>Test 20 lượt đồng thời và các test huỷ: người dùng trong test đã giữ sẵn 2–3 lịch chờ từ các test phía trên cùng tệp, nên luật hạn mức trả lời trước. Hành vi đúng, nhưng test không còn đo điều nó được viết ra để đo. Test đồng thời giờ đặt bằng admin (không có hạn mức, chỉ EXCLUDE quyết định); các test huỷ dùng một sinh viên khác.</li>
<li>Test PATCH của mốc 4: phản hồi phòng có thêm <code>open</code>/<code>close</code>. Một thay đổi hợp đồng — cập nhật có chủ đích, và hiện rõ trong <code>openapi.json</code> (bài 12.2).</li>
</ul>
<p>Test mới cho US-06:</p>
<pre><code class="language-ts">${esc(MA_TEST)}</code></pre>
<pre><code class="language-text">${esc(OUT_XANH)}</code></pre>
<pre><code class="language-text">${esc(OUT_PHA)}</code></pre>
<p>Mỗi lớp bảo vệ bị gỡ một lần và test đỏ đúng thông báo mong đợi. Một lời dặn: test đồng thời có thể xanh nhờ may khi các request tình cờ không chen nhau; ở đây mười request lần nào cũng làm lộ cuộc đua, nhưng hãy chạy vài lần trước khi tin một màu xanh.</p>

<h3>🧪 Thực hành (60 phút)</h3>
<ol>
<li>Chọn luật "kiểu hạn mức" trong dự án của bạn (số chỗ mỗi sự kiện, số lượt mượn mỗi sinh viên…). Làm bản đếm-rồi-ghi, viết test 10 request đồng thời, xem nó đỏ.</li>
<li>Sửa bằng khoá tư vấn; rồi làm thêm bản <code>SERIALIZABLE</code> có vòng thử lại và so: số được nhận, số lỗi 5xx, request chậm nhất.</li>
</ol>
<details><summary>Xem bản SERIALIZABLE (đã chạy thật: scripts/thu-serializable.mjs)</summary>
<p>Lần đầu chỉ thử lại khi gặp <code>P2034</code> của Prisma:</p>
<pre><code class="language-text">${esc(OUT_SER1)}</code></pre>
<p>Hạn mức vẫn giữ (trong DB đúng 3), nhưng mỗi lượt có 1–2 request kết thúc bằng một <code>DriverAdapterError</code> không ai bắt — tức là 500 cho người dùng. Với driver adapter pg, SQLSTATE <code>40001</code> đến theo hai đường: thành <code>P2034</code> khi một câu lệnh hỏng, và thành <code>DriverAdapterError</code> thô có <code>cause.originalCode</code> khi chính lệnh <code>COMMIT</code> hỏng. Thử lại cho cả hai:</p>
<pre><code class="language-js">${esc(MA_SER)}</code></pre>
<pre><code class="language-text">${esc(OUT_SER2)}</code></pre>
<p>Ba lượt: lần nào cũng tạo đúng 3, 0 lỗi, 7–11 lượt thử lại cho 10 request. Khoá tư vấn cho cùng kết quả mà không phải thử lại lần nào — đó là sự đánh đổi cần giải thích được.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Sao chỉ bọc transaction không sửa được hạn mức?"</strong> — Ở READ COMMITTED hai transaction cùng đọc con số cũ; không có gì bắt một bên đứng chờ. Cần khoá, ràng buộc, hoặc SERIALIZABLE kèm thử lại.</li>
<li><strong>"Khoá tư vấn khác SELECT FOR UPDATE thế nào?"</strong> — FOR UPDATE khoá dòng đã có; "tập lịch chờ của tôi" không phải một dòng, nên khoá một khoá sinh từ id người dùng.</li>
<li><strong>"Bạn lưu thời gian thế nào?"</strong> — Thời điểm lưu bằng timestamptz (UTC); luật địa phương (giờ mở cửa) lưu giá trị địa phương kèm múi giờ ghi rõ; không bao giờ so chuỗi giờ địa phương giữa các múi.</li>
<li><strong>"Test đỏ sau khi bạn sửa — bạn chỉ việc cập nhật test à?"</strong> — Nói lý do trước: 4 test đỏ ở trên có 3 nguyên nhân khác nhau, và chỉ một cái là thay đổi hợp đồng có chủ đích.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>"Đếm rồi mới ghi" núp trong rất nhiều ticket: voucher mỗi khách, dùng thử mỗi thiết bị, chỗ ngồi mỗi lớp. Khi review mã, hễ thấy <code>count()</code> hay <code>findFirst()</code> rồi tới <code>create()</code>, hãy hỏi "nếu hai cái này chạy cùng lúc thì sao?" — và đòi một test đồng thời. Đây là một trong những lỗi phổ biến nhất mà test đơn vị dùng mock không bao giờ tìm ra.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Đua kiểm-rồi-làm</span><span class="v">Hai request cùng kiểm điều kiện trước khi bên nào kịp làm, nên cả hai cùng làm.</span></div>
  <div class="kv"><span class="k">Khoá tư vấn</span><span class="v">Khoá trên một con số do ứng dụng chọn; cơ sở dữ liệu không biết nó bảo vệ gì.</span></div>
  <div class="kv"><span class="k">pg_advisory_xact_lock</span><span class="v">Khoá tư vấn giữ tới khi transaction kết thúc — không cần tự mở khoá.</span></div>
  <div class="kv"><span class="k">Chuỗi múi giờ POSIX</span><span class="v">Định dạng mà '+07' nghĩa là lệch 7 giờ về phía <em>tây</em> UTC.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giờ mở cửa: hàm thuần trên số phút giờ Việt Nam + CHECK trong cơ sở dữ liệu.</li>
<li>AT TIME ZONE '+07' là UTC−7; dùng INTERVAL '+07:00' hoặc tên múi giờ. Test đã bắt được.</li>
<li>Đếm-rồi-ghi cho 8 trên 10 request đồng thời lọt; khoá tư vấn theo người trong transaction cho đúng 3, 200 request vẫn không có lỗi 5xx.</li>
<li>Bốn test cũ đỏ, ba nguyên nhân; 65/65 xanh; cả hai lớp bảo vệ đã chứng minh bằng cách cố tình phá.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
