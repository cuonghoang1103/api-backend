/**
 * 6.7 — Mốc dự án 6: cơ sở dữ liệu thật cho dự án (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: scratchpad/nst/lab/c6/moc6 (lab-booking, nối tiếp c5/moc5): Prisma 7.10.1 + PostgreSQL 16.16 (DB moc6, moc6_test);
 * migrate dev init + migration viết tay (EXCLUDE + 2 CHECK); seed đầu đặt ở prisma/seed.ts chạy bằng --experimental-strip-types ⇒
 * ERR_MODULE_NOT_FOUND enums.js (client sinh ra import .js) ⇒ chuyển src/seed.ts, chạy dist/seed.js, chạy 2 lần vẫn 3 phòng;
 * Vitest 21/21 xanh (globalSetup migrate deploy, setupFiles TRUNCATE + 2 phòng, fileParallelism false); bẫy thật: rm -rf dist mà để
 * tsconfig.build.tsbuildinfo ⇒ tsc không phát tệp, "Cannot find module dist/main.js"; xem.sh: booking sống qua lần khởi động lại.
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-5-6-moc-du-an', title: 'NestJS 5.6 — Mốc dự án 5', sub: 'Điểm xuất phát của mốc này: cấu hình có schema, log JSON.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: 'NestJS 0.2 — Dự án xuyên suốt', sub: 'Đề tài, 11 mốc và thang điểm 100.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-4-1-thay-doi', title: 'API Design 4.1 — Thay đổi phá vỡ và không phá vỡ', sub: 'start/end đổi từ "+07:00" sang "Z" là loại thay đổi nào?', cta: 'Mở bài →' }),
].join('\n');
const MA_SCHEMA = "// schema.prisma — lab-booking mốc 6\ngenerator client {\n  provider     = \"prisma-client\"\n  output       = \"../src/generated/prisma\"\n  moduleFormat = \"esm\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel Room {\n  id       Int       @id @default(autoincrement())\n  code     String    @unique @db.VarChar(6)\n  building String    @db.VarChar(10)\n  capacity Int\n  bookings Booking[]\n\n  @@map(\"rooms\")\n}\n\nmodel Booking {\n  id        Int      @id @default(autoincrement())\n  roomId    Int      @map(\"room_id\")\n  room      Room     @relation(fields: [roomId], references: [id], onDelete: Restrict)\n  studentId String   @map(\"student_id\") @db.VarChar(20)\n  start     DateTime @db.Timestamptz(0)\n  end       DateTime @db.Timestamptz(0)\n  attendees Int\n  note      String?  @db.VarChar(200)\n  status    String   @default(\"PENDING\") @db.VarChar(10)\n  createdBy String   @map(\"created_by\") @db.VarChar(40)\n  version   Int      @default(1)\n  createdAt DateTime @default(now()) @map(\"created_at\") @db.Timestamptz(3)\n\n  @@index([roomId, start])\n  @@map(\"bookings\")\n}";
const MA_MIG = "-- Viết tay (Prisma Schema không diễn tả được EXCLUDE / CHECK): luật \"không đặt trùng\" do PostgreSQL giữ\nCREATE EXTENSION IF NOT EXISTS btree_gist;\n\nALTER TABLE \"bookings\" ADD CONSTRAINT \"bookings_khong_trung\"\n  EXCLUDE USING gist (room_id WITH =, tstzrange(\"start\", \"end\", '[)') WITH &&)\n  WHERE (status <> 'REJECTED');\n\nALTER TABLE \"bookings\" ADD CONSTRAINT \"bookings_start_truoc_end\" CHECK (\"start\" < \"end\");\nALTER TABLE \"bookings\" ADD CONSTRAINT \"bookings_attendees_duong\" CHECK (attendees > 0);";
const OUT_MIG = "$ npx prisma migrate dev --name init\n\n\nApplying migration `20261123235019_init`\n\nThe following migration(s) have been created and applied from new schema changes:\n\n$ npx prisma migrate dev            # áp migration viết tay\nApplying migration `20261123235029_khong_dat_trung`\nYour database is now in sync with your schema.\n$ npx prisma generate && npx prisma db seed\n✔ Generated Prisma Client (7.10.1) to ./src/generated/prisma\nRunning seed command `node --experimental-strip-types prisma/seed.ts` ...\nError [ERR_MODULE_NOT_FOUND]: Cannot find module '/home/sv/moc6/src/generated/prisma/enums.js' imported from /home/sv/moc6/src/generated/prisma/client.ts\nAn error occurred while running the seed command:\nError: Command failed with exit code 1: node --experimental-strip-types prisma/seed.ts\n$ npx prisma migrate status\n2 migrations found in prisma/migrations\nDatabase schema is up to date!\n…\n$ sửa: seed vào src/seed.ts, prisma.config.ts → seed: \"node dist/seed.js\"\n$ npx nest build && npx prisma db seed\nRunning seed command `node dist/seed.js` ...\nseed: phòng = 3\n🌱  The seed command has been executed.\n$ npx prisma db seed     # chạy lần hai\nseed: phòng = 3";
const MA_SEED = "// src/seed.ts — build cùng ứng dụng (client sinh ra import đuôi .js nên không chạy thẳng tệp .ts được) · dữ liệu mẫu cho dev: chạy lại bao nhiêu lần cũng ra cùng trạng thái (upsert theo mã phòng)\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from './generated/prisma/client.js';\n\nconst db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });\nconst PHONG = [\n  { code: 'AL-201', building: 'Alpha', capacity: 30 },\n  { code: 'BE-105', building: 'Beta', capacity: 24 },\n  { code: 'GA-310', building: 'Gamma', capacity: 40 },\n];\nfor (const p of PHONG) await db.room.upsert({ where: { code: p.code }, update: p, create: p });\nconsole.log('seed: phòng =', await db.room.count());\nawait db.$disconnect();";
const MA_SVC = "// prisma.service.ts — một PrismaClient cho cả ứng dụng; URL và cỡ pool lấy từ cấu hình đã kiểm (mốc 5)\nimport { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';\nimport { ConfigService } from '@nestjs/config';\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from '../generated/prisma/client.js';\nimport type { Env } from '../config/env.schema.js';\n\n@Injectable()\nexport class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {\n  private readonly log = new Logger(PrismaService.name);\n  constructor(c: ConfigService<Env, true>) {\n    super({ adapter: new PrismaPg({ connectionString: c.get('DATABASE_URL', { infer: true }), max: c.get('DB_POOL', { infer: true }) }) });\n  }\n  async onModuleInit() { await this.$queryRaw`SELECT 1`; this.log.log('PostgreSQL sẵn sàng'); }   // hỏng ⇒ không khởi động\n  async onModuleDestroy() { await this.$disconnect(); }\n}";
const MA_ERR = "// db-errors.ts — đọc mã lỗi gốc của PostgreSQL sau lớp Prisma 7 (adapter-pg)\nimport { Prisma } from '../generated/prisma/client.js';\n\nexport const maPg = (e: unknown): string | undefined =>\n  (e as any)?.meta?.driverAdapterError?.cause?.originalCode ?? (e as any)?.cause?.originalCode;\nexport const laPrisma = (e: unknown, code: string) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === code;";
const MA_ROOMS = "import { ConflictException, Injectable } from '@nestjs/common';\nimport { PrismaService } from '../prisma/prisma.service.js';\nimport { laPrisma } from '../prisma/db-errors.js';\nimport { CreateRoomDto } from './dto/create-room.dto.js';\nimport { UpdateRoomDto } from './dto/update-room.dto.js';\n\nconst trungMa = (e: unknown, code?: string) => {\n  if (laPrisma(e, 'P2002')) throw new ConflictException(`mã phòng ${code ?? ''} đã có`.trim(), { errorCode: 'ROOM_CODE_TAKEN' });\n  throw e;\n};\n\n@Injectable()\nexport class RoomsService {\n  constructor(private readonly db: PrismaService) {}\n\n  create(dto: CreateRoomDto) {\n    return this.db.room.create({ data: { code: dto.code, building: dto.building, capacity: dto.capacity } }).catch((e) => trungMa(e, dto.code));\n  }\n  findAll(building?: string) {\n    return this.db.room.findMany({ where: building ? { building } : {}, orderBy: { id: 'asc' } });\n  }\n  findOne(id: number) {\n    return this.db.room.findUnique({ where: { id } });                 // null ⇒ controller trả 404\n  }\n  async update(id: number, dto: UpdateRoomDto) {\n    // ánh xạ tường minh: chỉ trường client gửi (undefined ⇒ Prisma bỏ qua trường đó)\n    const data = { code: dto.code, building: dto.building, capacity: dto.capacity };\n    try { return await this.db.room.update({ where: { id }, data }); }\n    catch (e) { if (laPrisma(e, 'P2025')) return null; return trungMa(e, dto.code); }\n  }\n  async remove(id: number): Promise<boolean> {\n    try { await this.db.room.delete({ where: { id } }); return true; }\n    catch (e) {\n      if (laPrisma(e, 'P2025')) return false;\n      if (laPrisma(e, 'P2003')) throw new ConflictException(`phòng ${id} còn lịch đặt`, { errorCode: 'ROOM_HAS_BOOKINGS' });\n      throw e;\n    }\n  }\n}";
const MA_BK = "  async create(b: CreateBookingDto, createdBy = 'unknown') {\n    const room = await this.db.room.findUnique({ where: { id: b.roomId } });\n    if (!room) throw new NotFoundException(`không có phòng ${b.roomId}`, { errorCode: 'ROOM_NOT_FOUND' });\n    const s = new Date(b.start), e = new Date(b.end);\n    if (!(s < e)) throw new BadRequestException('start phải trước end');\n    if (s <= this.clock.now()) throw new BadRequestException('không đặt lịch trong quá khứ', { errorCode: 'BOOKING_IN_PAST' });\n    if (b.attendees > room.capacity) throw new BadRequestException(`phòng ${room.code} chỉ chứa ${room.capacity}`);\n    try {\n      // KHÔNG kiểm trùng bằng findFirst rồi mới ghi: ràng buộc EXCLUDE trong DB là người gác duy nhất (bài 6.5)\n      return await this.db.booking.create({ data: {\n        roomId: b.roomId, studentId: b.studentId, start: s, end: e, attendees: b.attendees, note: b.note, createdBy,\n      } });\n    } catch (err) {\n      if (maPg(err) === '23P01') throw new ConflictException('khung giờ đã có người đặt', { errorCode: 'BOOKING_CONFLICT' });\n      throw err;\n    }\n  }\n  findByRoom(roomId: number) {\n    return this.db.booking.findMany({ where: { roomId }, orderBy: { start: 'asc' } });\n  }\n}";
const MA_VITEST = "import { defineConfig } from 'vitest/config';\n\nexport default defineConfig({\n  // Resolves the path aliases declared in tsconfig.json, including the ones\n  // added by `nest g library`. Requires Vite 8, which ships this option.\n  resolve: { tsconfigPaths: true },\n  test: {\n    globals: true,\n    root: './',\n    include: ['**/*.spec.ts'],\n    // mốc 6: DB test RIÊNG (không bao giờ trỏ DB dev); các tệp test dùng chung một DB ⇒ chạy lần lượt\n    env: { LOG_LEVEL: 'silent', API_KEYS: 'test-key', DATABASE_URL: process.env.DATABASE_URL_TEST ?? '', DB_POOL: '10' },\n    globalSetup: ['src/test/global-setup.ts'],\n    setupFiles: ['src/test/db-reset.ts'],\n    fileParallelism: false,\n  },\n});";
const MA_GS = "// global-setup.ts — chạy MỘT lần trước mọi tệp test: đưa DB test lên migration mới nhất\nimport { execSync } from 'node:child_process';\nexport default function setup() {\n  execSync('npx prisma migrate deploy', { stdio: 'ignore', env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL_TEST } });\n}";
const MA_RESET = "// db-reset.ts — trước MỖI tệp test: bảng trống + 2 phòng mẫu (id 1, 2) như dữ liệu trong bộ nhớ của mốc 5\nimport { PrismaPg } from '@prisma/adapter-pg';\nimport { PrismaClient } from '../generated/prisma/client.js';\n\nbeforeAll(async () => {\n  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });\n  await db.$executeRaw`TRUNCATE bookings, rooms RESTART IDENTITY CASCADE`;\n  await db.room.createMany({ data: [{ code: 'AL-201', building: 'Alpha', capacity: 30 }, { code: 'BE-105', building: 'Beta', capacity: 24 }] });\n  await db.$disconnect();\n});";
const MA_E2E = "describe('Mốc 6 — dữ liệu thật trong PostgreSQL', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] })\n      .overrideProvider(Clock).useValue({ now: () => new Date('2026-12-01T00:00:00Z') }).compile();\n    app = m.createNestApplication({ logger: false });\n    await app.init();\n  });\n  afterAll(() => app.close());\n  const http = () => request(app.getHttpServer());\n  const K = 'test-key';\n  const B = { roomId: 1, studentId: 'SE170001', start: '2027-01-07T07:30:00+07:00', end: '2027-01-07T09:30:00+07:00', attendees: 10 };\n\n  it('trùng mã phòng ⇒ 409 ROOM_CODE_TAKEN (P2002), không phải 500', async () => {\n    const r = await http().post('/rooms').set('x-api-key', K).send({ code: 'AL-201', building: 'Alpha', capacity: 10 }).expect(409);\n    expect(r.body.type).toMatch(/ROOM_CODE_TAKEN$/);\n  });\n  it('xoá phòng còn lịch ⇒ 409 ROOM_HAS_BOOKINGS (P2003); phòng trống ⇒ 204; xoá lại ⇒ 404', async () => {\n    await http().post('/bookings').set('x-api-key', K).send(B).expect(201);\n    expect((await http().delete('/rooms/1').set('x-api-key', K).expect(409)).body.type).toMatch(/ROOM_HAS_BOOKINGS$/);\n    await http().delete('/rooms/2').set('x-api-key', K).expect(204);\n    await http().delete('/rooms/2').set('x-api-key', K).expect(404);\n  });\n  it('30 request HTTP đồng thời cùng khung giờ ⇒ 1 × 201, 29 × 409', async () => {\n    const C = { ...B, start: '2027-01-08T07:30:00+07:00', end: '2027-01-08T09:30:00+07:00' };\n    const ma = await Promise.all(Array.from({ length: 30 }, () => http().post('/bookings').set('x-api-key', K).send(C).then((r) => r.status)));\n    expect(ma.sort()).toEqual([201, ...Array(29).fill(409)]);\n  });\n});";
const OUT_TEST = "$ DATABASE_URL_TEST=postgresql://…/moc6_test npx vitest run\n RUN  v4.1.12 /home/sv/lab-booking\n ✓ src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > tự đặt status ⇒ 400, lỗi theo dạng problem+json có errors[]\n ✓ src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > ngày 30/02 và giờ không múi ⇒ 400 đúng trường\n ✓ src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > hợp lệ ⇒ 201, status do server đặt, không lộ createdBy\n ✓ src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > PATCH phòng: không ghi đè id, trường không gửi giữ nguyên\n ✓ src/common/moc4.e2e.spec.ts > Mốc 4 — DTO, kiểm dữ liệu, phản hồi không lộ > tạo phòng sai luật ⇒ 400\n ✓ src/common/moc6.e2e.spec.ts > Mốc 6 — dữ liệu thật trong PostgreSQL > trùng mã phòng ⇒ 409 ROOM_CODE_TAKEN (P2002), không phải 500\n ✓ src/common/moc6.e2e.spec.ts > Mốc 6 — dữ liệu thật trong PostgreSQL > xoá phòng còn lịch ⇒ 409 ROOM_HAS_BOOKINGS (P2003); phòng trống ⇒ 204; xoá lại ⇒ 404\n ✓ src/common/moc6.e2e.spec.ts > Mốc 6 — dữ liệu thật trong PostgreSQL > 30 request HTTP đồng thời cùng khung giờ ⇒ 1 × 201, 29 × 409\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > xem phòng không cần khoá (@Public)\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > id không phải số ⇒ 400 problem+json, không còn 404 \"Room abc\"\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt lịch thiếu khoá ⇒ 401\n ✓ src/common/pipeline.e2e.spec.ts > Mốc 3 — dây chuyền request của lab-booking > đặt trùng ⇒ 409 với mã BOOKING_CONFLICT\n ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định, PostgreSQL thật) > 8:00 \"bây giờ\" ⇒ 7:30 là quá khứ\n ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định, PostgreSQL thật) > hai lịch chạm mép không trùng (9:00 kết thúc, 9:00 bắt đầu)\n ✓ src/bookings/bookings.service.spec.ts > BookingsService (đồng hồ cố định, PostgreSQL thật) > 20 lượt đặt đồng thời cùng khung giờ ⇒ 1 thành công, 19 BOOKING_CONFLICT\n ✓ src/common/moc5.e2e.spec.ts > Mốc 5 — request id do pino-http cấp > giữ id hợp lệ client gửi, trả lại ở header và trong lỗi\n ✓ src/common/moc5.e2e.spec.ts > Mốc 5 — request id do pino-http cấp > id bẩn ⇒ thay bằng UUID\n ✓ src/config/env.schema.spec.ts > Mốc 5 — EnvSchema của lab-booking > dev: khoá ngắn được, mặc định đủ\n ✓ src/config/env.schema.spec.ts > Mốc 5 — EnvSchema của lab-booking > API_KEYS rỗng ⇒ từ chối (thay cho câu kiểm trong ApiKeyGuard của mốc 3)\n ✓ src/config/env.schema.spec.ts > Mốc 5 — EnvSchema của lab-booking > mốc 6: thiếu DATABASE_URL hoặc sai giao thức ⇒ từ chối\n ✓ src/config/env.schema.spec.ts > Mốc 5 — EnvSchema của lab-booking > production: khoá mốc 4 quá ngắn, cấm /docs\n Test Files  6 passed (6)\n      Tests  21 passed (21)";
const OUT_XEM = "$ POST /bookings AL-201 7:30–9:30 → 201\n$ POST lại đúng khung đó → {\"status\":409,\"type\":\"https://lab-booking.example/errors/BOOKING_CONFLICT\",\"detail\":\"khung giờ đã có người đặt\"}\n$ (dừng tiến trình, khởi động lại)\n$ GET /bookings/room/1 → [{\"id\":1,\"start\":\"2027-01-05T00:30:00.000Z\",\"status\":\"PENDING\"}]\n$ DELETE /rooms/1 → {\"status\":409,\"type\":\"https://lab-booking.example/errors/ROOM_HAS_BOOKINGS\"}";
const OUT_DIFF = "$ diff -r moc5/src moc6/src --brief   (bỏ src/generated)\nFiles moc5/src/app.module.ts and moc6/src/app.module.ts differ\nFiles moc5/src/bookings/bookings.controller.ts and moc6/src/bookings/bookings.controller.ts differ\nFiles moc5/src/bookings/bookings.service.spec.ts and moc6/src/bookings/bookings.service.spec.ts differ\nFiles moc5/src/bookings/bookings.service.ts and moc6/src/bookings/bookings.service.ts differ\nFiles moc5/src/bookings/dto/booking.response.ts and moc6/src/bookings/dto/booking.response.ts differ\nFiles moc5/src/common/moc4.e2e.spec.ts and moc6/src/common/moc4.e2e.spec.ts differ\nOnly in moc6/src/common: moc6.e2e.spec.ts\nFiles moc5/src/config/env.schema.spec.ts and moc6/src/config/env.schema.spec.ts differ\nFiles moc5/src/config/env.schema.ts and moc6/src/config/env.schema.ts differ\nOnly in moc6/src: prisma\nFiles moc5/src/rooms/rooms.controller.ts and moc6/src/rooms/rooms.controller.ts differ\nFiles moc5/src/rooms/rooms.service.ts and moc6/src/rooms/rooms.service.ts differ\nOnly in moc6/src: seed.ts\nOnly in moc6/src: test\n$ thêm: prisma/schema.prisma, 2 migration, prisma.config.ts, .env (DATABASE_URL)";

export default {
  title: '6.7 — Project milestone 6: a real database for your project|||6.7 — Mốc dự án 6: cơ sở dữ liệu thật cho dự án',
  slug: 'nst-6-7-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Áp Chương 6 vào đề tài của bạn (mẫu: lab-booking). Mảng trong bộ nhớ thành PostgreSQL qua Prisma 7: schema + migration viết tay (exclusion constraint, CHECK), seed chạy lại được, PrismaService đọc cấu hình đã kiểm, lỗi DB dịch thành mã nghiệp vụ (ROOM_CODE_TAKEN, ROOM_HAS_BOOKINGS, BOOKING_CONFLICT), test chạy trên DB test riêng. 21/21 test xanh, 30 request đồng thời chỉ 1 thành công, dữ liệu còn sau khi khởi động lại.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Project milestone 6</span>
<h2>6.7 — Milestone 6: your project remembers</h2>
<p class="lead">After milestone 5 lab-booking is configurable and observable, but it forgets everything on restart and — as Lesson 6.5 measured — its overlap check lets a rush of requests double-book a room. This milestone moves your project onto PostgreSQL with Prisma, puts the business rules that matter into the database, and keeps every earlier test green. Do the same for your own topic: swap the arrays for tables, and find the one rule of your domain that concurrency can break.</p>

<h3>What changes</h3>
<div class="out">${esc(OUT_DIFF)}</div>

<h3>Schema and migrations</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<p><code>@@map</code>/<code>@map</code> give the tables snake_case names a DBA expects, while the TypeScript side stays camelCase. Column sizes (<code>VarChar(6)</code> for <code>AL-201</code>) mirror the DTO rules. The second migration is hand-written — the part of the model Prisma's language cannot say:</p>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<div class="out">${esc(OUT_MIG)}</div>
<p>A real trap in the middle of that log: the seed first lived in <code>prisma/seed.ts</code> and ran with Node's type stripping. It failed with <code>ERR_MODULE_NOT_FOUND … enums.js</code> — the generated client imports its own files with a <code>.js</code> extension, which only exists after compilation. Moving the seed into <code>src/</code> (compiled with the app, run as <code>node dist/seed.js</code>) fixed it. The seed uses <code>upsert</code> by room code, so running it twice leaves the same 3 rooms.</p>
<pre><code class="language-ts">${esc(MA_SEED)}</code></pre>

<h3>Wiring: configuration, PrismaService, errors</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<p>The URL and pool size come from the schema of milestone 5 (two new variables, <code>DATABASE_URL</code> and <code>DB_POOL</code>, also added to <code>.env.example</code>). Errors are translated in the services into domain codes, so <code>ProblemFilter</code> from milestone 3 stays unchanged and never learns a table name:</p>
<pre><code class="language-ts">${esc(MA_ERR)}</code></pre>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
<p>The in-memory overlap check is gone: the exclusion constraint decides, and <code>23P01</code> becomes <code>BOOKING_CONFLICT</code>. The checks that stay (room exists, not in the past, capacity) are about input, not about concurrency.</p>

<h3>One visible contract change</h3>
<p>Milestone 4's test expected the response to echo <code>start: "2027-01-06T07:30:00+07:00"</code>. Now the database stores an instant and the API returns <code>"2027-01-06T00:30:00.000Z"</code> — the same moment, a different string. The test was updated deliberately, with a comment. In a real API that is a contract change clients may notice (a client comparing strings breaks); decide it consciously, document it, and if the API is already public treat it as Lesson 4.1 of API Design describes.</p>

<h3>Tests on a real database</h3>
<pre><code class="language-ts">${esc(MA_VITEST)}</code></pre>
<pre><code class="language-ts">${esc(MA_GS)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>
<ul>
<li>A <strong>separate test database</strong> from its own variable (<code>DATABASE_URL_TEST</code>) — a test suite that truncates tables must never be able to point at your dev data.</li>
<li><code>globalSetup</code> runs <code>prisma migrate deploy</code> once, so tests always run on the latest schema, including hand-written SQL.</li>
<li><code>fileParallelism: false</code> — all test files share one database; in parallel they would truncate each other's data. (Faster alternative later: one database or schema per worker.)</li>
</ul>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>All 16 tests from milestones 3–5 still pass (with the adapted timestamp), plus the new ones: <code>P2002</code> → 409 <code>ROOM_CODE_TAKEN</code>, <code>P2003</code> → 409 <code>ROOM_HAS_BOOKINGS</code>, 30 concurrent HTTP requests → exactly one 201, and 20 concurrent service calls → one success and 19 <code>BOOKING_CONFLICT</code>.</p>

<h3>It survives a restart</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>One more real trap while writing <code>xem.sh</code>: the first version did <code>rm -rf dist &amp;&amp; tsc</code> and the app failed with <code>Cannot find module …/dist/main.js</code>. The <code>tsconfig.build.tsbuildinfo</code> file (incremental build) still said "everything is up to date", so tsc emitted nothing. Delete the build-info file together with <code>dist</code>, or let <code>nest build</code> do it.</p>

<h3>Self-assessment (10 points toward the project rubric)</h3>
<table>
<thead><tr><th>Criterion</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Schema + migrations committed; the rule that concurrency can break is enforced by the database (constraint, conditional update or lock), and a test with ≥ 20 concurrent requests proves it</td><td>3</td></tr>
<tr><td>Exactly one PrismaService (check: <code>grep -rn "providers:.*PrismaService" src</code> prints exactly one line — <code>src/prisma/prisma.module.ts</code>), URL and pool from the validated configuration</td><td>2</td></tr>
<tr><td>Database errors become stable domain codes (409/404), no ORM or table names in any response</td><td>2</td></tr>
<tr><td>Tests run on a separate database that is migrated automatically; all earlier tests green</td><td>2</td></tr>
<tr><td>Re-runnable seed; README explains migrate, seed and test commands</td><td>1</td></tr>
</tbody>
</table>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Mốc dự án 6</span>
<h2>6.7 — Mốc 6: dự án của bạn biết nhớ</h2>
<p class="lead">Sau mốc 5, lab-booking đã cấu hình được và quan sát được, nhưng khởi động lại là quên sạch — và như Bài 6.5 đo được, lần kiểm chồng lịch của nó để một đợt request dồn dập đặt trùng phòng. Mốc này chuyển dự án sang PostgreSQL bằng Prisma, đưa những luật nghiệp vụ quan trọng vào DB, và giữ mọi test cũ xanh. Hãy làm y vậy cho đề tài của bạn: đổi mảng thành bảng, và tìm ra luật duy nhất trong miền của bạn mà đồng thời có thể phá vỡ.</p>

<h3>Những gì thay đổi</h3>
<div class="out">${esc(OUT_DIFF)}</div>

<h3>Schema và migration</h3>
<pre><code class="language-prisma">${esc(MA_SCHEMA)}</code></pre>
<p><code>@@map</code>/<code>@map</code> cho bảng tên kiểu snake_case như DBA mong đợi, còn phía TypeScript vẫn camelCase. Kích thước cột (<code>VarChar(6)</code> cho <code>AL-201</code>) phản chiếu luật trong DTO. Migration thứ hai viết tay — phần mô hình mà ngôn ngữ của Prisma không nói được:</p>
<pre><code class="language-sql">${esc(MA_MIG)}</code></pre>
<div class="out">${esc(OUT_MIG)}</div>
<p>Một cái bẫy thật nằm giữa log đó: seed lúc đầu đặt ở <code>prisma/seed.ts</code> và chạy bằng tính năng bỏ kiểu của Node. Nó hỏng với <code>ERR_MODULE_NOT_FOUND … enums.js</code> — client sinh ra import các tệp của chính nó với đuôi <code>.js</code>, thứ chỉ có sau khi biên dịch. Chuyển seed vào <code>src/</code> (biên dịch cùng ứng dụng, chạy bằng <code>node dist/seed.js</code>) là xong. Seed dùng <code>upsert</code> theo mã phòng, nên chạy hai lần vẫn đúng 3 phòng.</p>
<pre><code class="language-ts">${esc(MA_SEED)}</code></pre>

<h3>Nối dây: cấu hình, PrismaService, lỗi</h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<p>URL và cỡ pool lấy từ schema của mốc 5 (hai biến mới, <code>DATABASE_URL</code> và <code>DB_POOL</code>, cũng thêm vào <code>.env.example</code>). Lỗi được dịch ngay trong service thành mã nghiệp vụ, nên <code>ProblemFilter</code> của mốc 3 giữ nguyên và không bao giờ biết tên bảng:</p>
<pre><code class="language-ts">${esc(MA_ERR)}</code></pre>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
<p>Lần kiểm chồng lịch trong bộ nhớ đã bỏ: exclusion constraint quyết định, và <code>23P01</code> thành <code>BOOKING_CONFLICT</code>. Những lần kiểm còn giữ (phòng tồn tại, không ở quá khứ, sức chứa) là về dữ liệu vào, không phải về đồng thời.</p>

<h3>Một thay đổi hợp đồng nhìn thấy được</h3>
<p>Test của mốc 4 mong phản hồi lặp lại <code>start: "2027-01-06T07:30:00+07:00"</code>. Giờ DB lưu một thời điểm và API trả <code>"2027-01-06T00:30:00.000Z"</code> — cùng khoảnh khắc, khác chuỗi. Test được sửa có chủ đích, kèm chú thích. Ở API thật, đó là thay đổi hợp đồng mà client có thể nhận ra (client so chuỗi sẽ vỡ); hãy quyết định có ý thức, ghi vào tài liệu, và nếu API đã công khai thì xử lý như Bài 4.1 của khoá API Design.</p>

<h3>Test trên DB thật</h3>
<pre><code class="language-ts">${esc(MA_VITEST)}</code></pre>
<pre><code class="language-ts">${esc(MA_GS)}</code></pre>
<pre><code class="language-ts">${esc(MA_RESET)}</code></pre>
<ul>
<li>Một <strong>DB test riêng</strong> lấy từ biến riêng (<code>DATABASE_URL_TEST</code>) — bộ test có lệnh xoá sạch bảng thì không bao giờ được phép trỏ vào dữ liệu dev của bạn.</li>
<li><code>globalSetup</code> chạy <code>prisma migrate deploy</code> một lần, nên test luôn chạy trên lược đồ mới nhất, kể cả SQL viết tay.</li>
<li><code>fileParallelism: false</code> — mọi tệp test dùng chung một DB; chạy song song thì chúng xoá dữ liệu của nhau. (Cách nhanh hơn để sau: mỗi worker một DB hoặc một schema.)</li>
</ul>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>
<div class="out">${esc(OUT_TEST)}</div>
<p>Cả 16 test của mốc 3–5 vẫn xanh (với mốc thời gian đã chỉnh), cộng các test mới: <code>P2002</code> → 409 <code>ROOM_CODE_TAKEN</code>, <code>P2003</code> → 409 <code>ROOM_HAS_BOOKINGS</code>, 30 request HTTP đồng thời → đúng một 201, và 20 lời gọi service đồng thời → một thành công, 19 <code>BOOKING_CONFLICT</code>.</p>

<h3>Khởi động lại vẫn còn</h3>
<div class="out">${esc(OUT_XEM)}</div>
<p>Thêm một cái bẫy thật lúc viết <code>xem.sh</code>: bản đầu chạy <code>rm -rf dist &amp;&amp; tsc</code> và ứng dụng hỏng với <code>Cannot find module …/dist/main.js</code>. Tệp <code>tsconfig.build.tsbuildinfo</code> (build tăng dần) vẫn ghi "mọi thứ đã mới nhất", nên tsc không phát ra tệp nào. Xoá tệp build-info cùng với <code>dist</code>, hoặc để <code>nest build</code> lo.</p>

<h3>Tự chấm (10 điểm trong thang điểm dự án)</h3>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Schema + migration đã commit; luật mà đồng thời có thể phá được DB giữ (ràng buộc, cập nhật có điều kiện hoặc khoá), và có test ≥ 20 request đồng thời chứng minh</td><td>3</td></tr>
<tr><td>Đúng một PrismaService (kiểm: <code>grep -rn "providers:.*PrismaService" src</code> in đúng một dòng — <code>src/prisma/prisma.module.ts</code>), URL và pool lấy từ cấu hình đã kiểm</td><td>2</td></tr>
<tr><td>Lỗi DB thành mã nghiệp vụ ổn định (409/404), không phản hồi nào chứa tên ORM hay tên bảng</td><td>2</td></tr>
<tr><td>Test chạy trên DB riêng được migrate tự động; mọi test cũ xanh</td><td>2</td></tr>
<tr><td>Seed chạy lại được; README ghi lệnh migrate, seed và test</td><td>1</td></tr>
</tbody>
</table>
${THE}
</div>
`,
};
