/**
 * 8.4 — Jest trên dự án Nest 10/11 đang chạy, và chuyển qua lại Jest–Vitest (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22): Nest 12 CJS + Jest 30 hỏng ("Use Node v24.9+", lab/nst-dau); dự án Nest 11.1.6 CommonJS dựng tay ở
 * scratchpad/nst/lab/c8/nst11 (nest new của CLI 11.0.24 vẫn sinh mẫu Nest 12 ESM + Vitest; npm 10.9.7 "edgesOut") — Jest 30.5.2, ts-jest 29.4,
 * TypeScript 5.9.3: xanh 3 + 2; supertest thiếu esModuleInterop ⇒ "is not a function"; quên app.close() ⇒ "Jest did not exit", treo tới timeout,
 * --detectOpenHandles không in gì trong 40 s, --forceExit che lỗi; jest.mock factory ⇒ TDZ; @swc/jest thiếu .swcrc không parse decorator,
 * có .swcrc thì bỏ qua lỗi kiểu, nhanh ~2×; Vitest 4.1.12 chạy được dự án CJS (6 xanh); vi.hoisted; Vitest coi done là test context ⇒ khẳng định
 * sai vẫn xanh. Bản Jest gốc chép ở lab/c8/nst11-ban-jest.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-3-2-mock-module', title: 'Testing 3.2 — Mock module: vi.mock, vi.hoisted, MSW', sub: 'Hoisting của mock module giải thích kỹ — bài này chỉ chỉ ra chỗ Jest và Vitest khác nhau.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-8-4-toc-do', title: 'Testing 8.4 — Tốc độ bộ test', sub: 'Đo trước khi tối ưu: transform, cô lập, song song.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-1-2-nest-new', title: 'NestJS 1.2 — Giải phẫu ứng dụng', sub: 'SWC biên dịch không kiểm kiểu — cùng chuyện với @swc/jest ở bài này.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'Jest docs — ECMAScript Modules (require of ESM)', 'Jest 30 chỉ nạp được gói ESM qua require(esm) từ Node 24.9 — lý do dự án Nest 12 trên Node 22 hỏng.', 'https://jestjs.io/docs/ecmascript-modules'),
  nguon('📘', 'Jest CLI — --detectOpenHandles, --forceExit', 'Hai cờ hay bị dùng sai khi Jest không thoát.', 'https://jestjs.io/docs/cli'),
  nguon('📘', 'Vitest — Migrating from Jest', 'jest.* ⇒ vi.*, globals, done callback, và các khác biệt chính thức.', 'https://vitest.dev/guide/migration#jest'),
  nguon('📘', 'NestJS 12 release notes', 'Nest 12: mẫu dự án mới mặc định ESM + Vitest.', 'https://github.com/nestjs/nest/releases'),
].join('\n');
const OUT_J12 = "FAIL src/app.controller.spec.ts\n  ● Test suite failed to run\n\n    Must use import to load ES Module: /home/sv/app/node_modules/@nestjs/testing/index.js\n\n    The file contains ESM syntax (import/export) that could not be executed as CommonJS. Either:\n      - Configure a transform (e.g. babel-jest) that compiles this file to CommonJS (see https://jestjs.io/docs/code-transformation)\n      - If the file is in \"node_modules\", allow it to be transformed by adjusting \"transformIgnorePatterns\" (see https://jestjs.io/docs/configuration#transformignorepatterns-arraystring)\n      - Use Node v24.9+ where Jest supports require(esm) natively (see https://jestjs.io/docs/ecmascript-modules#require-of-esm)\n\n    > 1 | import { Test, TestingModule } from '@nestjs/testing';\n        | ^\n      2 | import { AppController } from './app.controller';\n…\nTest Suites: 1 failed, 1 total";
const MA_PKG = "{\n  \"scripts\": {\n    \"test\": \"jest\",\n    \"test:e2e\": \"jest --config ./test/jest-e2e.json\"\n  },\n  \"dependencies\": {\n    \"@nestjs/core\": \"11.1.6\"\n  },\n  \"devDependencies\": {\n    \"jest\": \"^30.1.3\",\n    \"ts-jest\": \"^29.4.1\",\n    \"@nestjs/testing\": \"11.1.6\",\n    \"typescript\": \"^5.9.2\"\n  },\n  \"jest\": {\n    \"moduleFileExtensions\": [\n      \"js\",\n      \"json\",\n      \"ts\"\n    ],\n    \"rootDir\": \"src\",\n    \"testRegex\": \".*\\\\.spec\\\\.ts$\",\n    \"transform\": {\n      \"^.+\\\\.(t|j)s$\": \"ts-jest\"\n    },\n    \"collectCoverageFrom\": [\n      \"**/*.(t|j)s\"\n    ],\n    \"coverageDirectory\": \"../coverage\",\n    \"testEnvironment\": \"node\"\n  }\n}";
const MA_SVC = "import { ConflictException, Injectable } from '@nestjs/common';\nimport { guiThongBao } from './thong-bao';\n\nexport class CreateRoomDto { code: string; capacity: number; }\nexport type Room = CreateRoomDto & { id: number };\n\n@Injectable()\nexport class RoomsService {\n  private readonly rooms: Room[] = [];\n  async create(dto: CreateRoomDto): Promise<Room> {\n    if (this.rooms.some((r) => r.code === dto.code)) throw new ConflictException(`mã phòng ${dto.code} đã có`);\n    const room = { id: this.rooms.length + 1, ...dto };\n    this.rooms.push(room);\n    if (dto.capacity > 100) await guiThongBao(`Phòng lớn mới: ${dto.code} (${dto.capacity} chỗ)`);\n    return room;\n  }\n  findAll() { return this.rooms; }\n}";
const MA_TB = "// thong-bao.ts — gửi tin cho admin qua một webhook nội bộ (hàm module, KHÔNG phải provider — kiểu mã cũ hay gặp)\nexport async function guiThongBao(noiDung: string): Promise<void> {\n  const r = await fetch(process.env.WEBHOOK_URL ?? 'http://chat.noi-bo.invalid/hook', { method: 'POST', body: JSON.stringify({ text: noiDung }) });\n  if (!r.ok) throw new Error(`webhook ${r.status}`);\n}";
const MA_SPEC = "import { Test } from '@nestjs/testing';\nimport { RoomsService } from './rooms.service';\nimport { guiThongBao } from './thong-bao';\n\njest.mock('./thong-bao');                       // Jest đưa dòng này lên ĐẦU tệp (hoisting) — trước cả import ở trên\nconst gui = jest.mocked(guiThongBao);\n\ndescribe('RoomsService', () => {\n  let svc: RoomsService;\n  beforeEach(async () => {\n    jest.clearAllMocks();\n    svc = (await Test.createTestingModule({ providers: [RoomsService] }).compile()).get(RoomsService);\n  });\n  it('phòng ≤ 100 chỗ: không báo admin', async () => {\n    await svc.create({ code: 'AL-201', capacity: 30 });\n    expect(gui).not.toHaveBeenCalled();\n  });\n  it('phòng > 100 chỗ: báo admin đúng nội dung', async () => {\n    await svc.create({ code: 'HA-101', capacity: 120 });\n    expect(gui).toHaveBeenCalledWith('Phòng lớn mới: HA-101 (120 chỗ)');\n  });\n  it('trùng mã ⇒ 409', async () => {\n    await svc.create({ code: 'AL-201', capacity: 30 });\n    await expect(svc.create({ code: 'AL-201', capacity: 40 })).rejects.toThrow('đã có');\n  });\n});";
const MA_E2E = "import { INestApplication, ValidationPipe } from '@nestjs/common';\nimport { Test } from '@nestjs/testing';\nimport request from 'supertest';\nimport { AppModule } from '../src/app.module';\n\ndescribe('Rooms (e2e)', () => {\n  let app: INestApplication;\n  beforeAll(async () => {\n    const m = await Test.createTestingModule({ imports: [AppModule] }).compile();\n    app = m.createNestApplication();\n    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));   // chép từ main.ts\n    await app.init();\n  });\n  afterAll(() => app.close());\n  it('POST /rooms hợp lệ ⇒ 201', () => request(app.getHttpServer()).post('/rooms').send({ code: 'AL-201', capacity: 30 }).expect(201));\n  it('thêm trường lạ ⇒ 400', () => request(app.getHttpServer()).post('/rooms').send({ code: 'AL-202', capacity: 30, admin: true }).expect(400));\n});";
const MA_DD = "import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';\n\n/** Mỗi phút dọn lịch quá hạn — một setInterval sống cùng ứng dụng (giống pool DB, Redis, hàng đợi) */\n@Injectable()\nexport class DonDepService implements OnModuleInit, OnModuleDestroy {\n  private t?: NodeJS.Timeout;\n  onModuleInit() { this.t = setInterval(() => {}, 60_000); }\n  onModuleDestroy() { clearInterval(this.t); }\n}";
const OUT_XANH = "$ npx jest\nTest Suites: 1 passed, 1 total\nTests:       3 passed, 3 total\nSnapshots:   0 total\nTime:        2.057 s\nRan all test suites.\n$ npm run test:e2e\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        1.913 s, estimated 2 s\nRan all test suites.";
const OUT_ST = "$ npm run test:e2e\nFAIL test/rooms.e2e-spec.ts\n  ● Rooms (e2e) › POST /rooms hợp lệ ⇒ 201\n    TypeError: (0 , supertest_1.default) is not a function\n      13 |   });\n      14 |   afterAll(() => app.close());\n    > 15 |   it('POST /rooms hợp lệ ⇒ 201', () => request(app.getHttpServer()).post('/rooms').send({ code: 'AL-201', capacity: 30 }).expect(201));\n         |                                               ^\n      16 |   it('thêm trường lạ ⇒ 400', () => request(app.getHttpServer()).post('/rooms').send({ code: 'AL-202', capacity: 30, admin: true }).expect(400));\n      17 | });\n      18 |\n      at Object.<anonymous> (rooms.e2e-spec.ts:15:47)\n  ● Rooms (e2e) › thêm trường lạ ⇒ 400\nTests:       2 failed, 2 total";
const OUT_QUEN = "$ npx jest -c test/jest-e2e.json quen\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        2.597 s, estimated 3 s\nRan all test suites matching quen.\nJest did not exit one second after the test run has completed.\n'This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.\n[15 giây sau vẫn chưa thoát — timeout giết tiến trình, mã 124]\n\n$ npx jest -c test/jest-e2e.json quen --detectOpenHandles\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        2.348 s, estimated 3 s\nRan all test suites matching quen.\n[40 giây: không in handle nào, vẫn treo — mã 124]\n\n$ npx jest -c test/jest-e2e.json quen --forceExit\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        1.773 s, estimated 3 s\nRan all test suites matching quen.\nForce exiting Jest: Have you considered using `--detectOpenHandles` to detect async operations that kept running after all tests finished?\n[mã thoát 0]";
const MA_HOIST = "// hoist.spec.ts — jest.mock(…, factory) bị đưa lên đầu tệp: factory dùng biến khai ở dưới thì sao?\nimport { RoomsService } from './rooms.service';\n\nconst guiGia = jest.fn().mockResolvedValue(undefined);\njest.mock('./thong-bao', () => ({ guiThongBao: (...a: unknown[]) => guiGia(...a) }));   // gọi LƯỜI: lúc chạy guiGia đã có\n\nit('phòng 120 chỗ gọi guiGia', async () => {\n  await new RoomsService().create({ code: 'HA-101', capacity: 120 });\n  expect(guiGia).toHaveBeenCalledTimes(1);\n});";
const OUT_HOIST = "$ npx jest hoist\nFAIL src/rooms/hoist.spec.ts\n  ● Test suite failed to run\n    ReferenceError: Cannot access 'guiGia' before initialization\n      3 |\n      4 | const guiGia = jest.fn().mockResolvedValue(undefined);\n    > 5 | jest.mock('./thong-bao', () => ({ guiThongBao: guiGia }));\n        |                                                ^\n      6 |\n      7 | it('phòng 120 chỗ gọi guiGia', async () => {\n      8 |   await new RoomsService().create({ code: 'HA-101', capacity: 120 });\n      at rooms/hoist.spec.ts:5:48\n      at Object.<anonymous> (rooms/rooms.service.ts:2:1)\n      at Object.<anonymous> (rooms/hoist.spec.ts:2:1)\nTest Suites: 1 failed, 1 total\nTests:       0 total\nSnapshots:   0 total\nTime:        1.502 s\nRan all test suites matching hoist.";
const OUT_HOIST2 = "$ npx jest hoist   # sau khi bọc hàm lười\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        1.535 s\nRan all test suites matching hoist.";
const OUT_KIEU = "$ npx jest kieu          # transform: ts-jest\nFAIL src/rooms/kieu.spec.ts\n  ● Test suite failed to run\n    src/rooms/kieu.spec.ts:4:63 - error TS2322: Type 'string' is not assignable to type 'number'.\n    4   const r = await new RoomsService().create({ code: 'AL-209', capacity: '30' });   // lỗi kiểu: string thay number\n\n$ npx jest kieu          # transform: @swc/jest, CHƯA có .swcrc\nFAIL src/rooms/kieu.spec.ts\n  ● Test suite failed to run\n      x Expression expected\n        ,-[/home/sv/app/src/rooms/rooms.service.ts:7:1]\n      4 | export class CreateRoomDto { code: string; capacity: number; }\n      5 | export type Room = CreateRoomDto & { id: number };\n      6 | \n      7 | @Injectable()\n        : ^\n      8 | export class RoomsService {\n      9 |   private readonly rooms: Room[] = [];\n     10 |   async create(dto: CreateRoomDto): Promise<Room> {\n\n$ cat .swcrc\n{ \"jsc\": { \"parser\": { \"syntax\": \"typescript\", \"decorators\": true }, \"transform\": { \"legacyDecorator\": true, \"decoratorMetadata\": true }, \"target\": \"es2022\" }, \"module\": { \"type\": \"commonjs\" } }\n$ npx jest kieu          # transform: @swc/jest + .swcrc\nTest Suites: 1 passed, 1 total\nTests:       1 passed, 1 total\nSnapshots:   0 total\nTime:        0.384 s\nRan all test suites matching kieu.";
const OUT_TOC = "ts-jest lần 1: 4026 ms, mã thoát 0, Tests:       4 passed, 4 total\nts-jest lần 2: 3455 ms, mã thoát 0, Tests:       4 passed, 4 total\nts-jest lần 3: 4026 ms, mã thoát 0, Tests:       4 passed, 4 total\n@swc/jest lần 1: 1905 ms, mã thoát 0, Tests:       4 passed, 4 total\n@swc/jest lần 2: 1626 ms, mã thoát 0, Tests:       4 passed, 4 total\n@swc/jest lần 3: 2287 ms, mã thoát 0, Tests:       4 passed, 4 total";
const MA_VCONF = "import { defineConfig } from 'vitest/config';\nexport default defineConfig({\n  test: { globals: true, include: ['src/**/*.spec.ts', 'test/**/*.e2e-spec.ts'], exclude: ['test/quen.e2e-spec.ts'] },\n});";
const MA_BT_TB = "import { Injectable } from '@nestjs/common';\nimport { guiThongBao } from './thong-bao';\n\n/** Bọc hàm cũ thành provider — test thay bằng overrideProvider/useValue, không cần jest.mock */\n@Injectable()\nexport class ThongBaoService { gui(noiDung: string) { return guiThongBao(noiDung); } }";
const MA_BT_SPEC = "import { Test } from '@nestjs/testing';\nimport { RoomsService } from './rooms.service';\nimport { ThongBaoService } from './thong-bao.service';\n\ndescribe('RoomsService (ThongBaoService tiêm được)', () => {\n  const thongBao = { gui: jest.fn() };\n  let svc: RoomsService;\n  beforeEach(async () => {\n    thongBao.gui.mockReset();\n    svc = (await Test.createTestingModule({ providers: [RoomsService, { provide: ThongBaoService, useValue: thongBao }] }).compile()).get(RoomsService);\n  });\n  it('phòng ≤ 100 chỗ: không báo admin', async () => {\n    await svc.create({ code: 'AL-201', capacity: 30 });\n    expect(thongBao.gui).not.toHaveBeenCalled();\n  });\n  it('phòng > 100 chỗ: báo admin đúng nội dung', async () => {\n    await svc.create({ code: 'HA-101', capacity: 120 });\n    expect(thongBao.gui).toHaveBeenCalledWith('Phòng lớn mới: HA-101 (120 chỗ)');\n  });\n});";
const OUT_BT = "$ npx jest\nTest Suites: 1 passed, 1 total\nTests:       2 passed, 2 total\nSnapshots:   0 total\nTime:        2.527 s\nRan all test suites.\n\n$ npx vitest run      # chỉ đổi jest.fn ⇒ vi.fn\n Test Files  1 passed (1)\n      Tests  2 passed (2)";
const OUT_VITEST = "$ npx vitest run\n RUN  v4.1.12 /home/sv/app\n ✓ src/rooms/rooms.service.spec.ts > RoomsService > phòng ≤ 100 chỗ: không báo admin 10ms\n ✓ src/rooms/rooms.service.spec.ts > RoomsService > phòng > 100 chỗ: báo admin đúng nội dung 3ms\n ✓ src/rooms/rooms.service.spec.ts > RoomsService > trùng mã ⇒ 409 2ms\n ✓ src/rooms/hoist.spec.ts > phòng 120 chỗ gọi guiGia 3ms\n ✓ test/rooms.e2e-spec.ts > Rooms (e2e) > POST /rooms hợp lệ ⇒ 201 42ms\n ✓ test/rooms.e2e-spec.ts > Rooms (e2e) > thêm trường lạ ⇒ 400 6ms\n Test Files  3 passed (3)\n      Tests  6 passed (6)\n   Start at  08:08:54\n   Duration  856ms (transform 160ms, setup 0ms, import 1.08s, tests 143ms, environment 0ms)";
const OUT_VIHOIST = "$ npx vitest run hoist2      # factory dùng biến ngoài, như bản Jest hỏng\n ❯ src/rooms/hoist2.spec.ts (0 test)\n⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯\n FAIL  src/rooms/hoist2.spec.ts [ src/rooms/hoist2.spec.ts ]\nError: [vitest] There was an error when mocking a module. If you are using \"vi.mock\" factory, make sure there are no top level variables inside, since this call is hoisted to top of the file. Read more: https://vitest.dev/api/vi.html#vi-mock\n ❯ src/rooms/rooms.service.ts:2:1\n      1| import { ConflictException, Injectable } from '@nestjs/common';\n      2| import { guiThongBao } from './thong-bao';\n       | ^\n      3|\n      4| export class CreateRoomDto { code: string; capacity: number; }\nCaused by: ReferenceError: Cannot access 'guiGia' before initialization\n\n$ npx vitest run hoist2      # sau khi dùng vi.hoisted\n Test Files  1 passed (1)\n      Tests  1 passed (1)\n   Start at  08:09:08";
const OUT_DONE = "$ npx vitest run done\n Test Files  1 passed (1)\n      Tests  1 passed (1)\n   Start at  08:09:26\n   Duration  203ms (transform 14ms, setup 0ms, import 21ms, tests 2ms, environment 0ms)\n\n$ npx jest done\nFAIL src/rooms/done.spec.ts (6.085 s)\n  ● kiểu Jest cũ: done callback — khẳng định SAI bên trong setTimeout\n    expect(received).toBe(expected) // Object.is equality\n    Expected: 2\n    Received: 1\n      1 | it('kiểu Jest cũ: done callback — khẳng định SAI bên trong setTimeout', (done) => {\n    > 2 |   setTimeout(() => { expect(1).toBe(2); done(); }, 10);\n        |                                ^\n      3 | });\n      4 |\n      at Timeout._onTimeout (rooms/done.spec.ts:2:32)\n  ● kiểu Jest cũ: done callback — khẳng định SAI bên trong setTimeout";

export default {
  title: '8.4 — Jest on a running Nest 10/11 project, and moving between Jest and Vitest|||8.4 — Jest trên dự án Nest 10/11 đang chạy, và chuyển qua lại Jest–Vitest',
  slug: 'nst-8-4-jest-du-an-cu',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dự án công ty bạn vào làm nhiều khả năng là Nest 10/11 CommonJS + Jest. Dựng đúng dạng đó (Nest 11.1, Jest 30, ts-jest) và chạy thật: supertest "is not a function" khi thiếu esModuleInterop, quên app.close() thì Jest treo, jest.mock dùng biến ngoài thì lỗi TDZ, @swc/jest nhanh gấp đôi nhưng bỏ qua lỗi kiểu. Rồi chuyển sang Vitest trong vài dòng — và cái bẫy nặng nhất: test viết kiểu done() của Jest chạy trên Vitest thì khẳng định sai vẫn xanh.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.4</span>
<h2>8.4 — The Jest project you will actually inherit</h2>
<p class="lead">This course uses Nest 12, whose new projects default to ESM + Vitest. Most projects you will join at an internship were created with Nest 8–11: CommonJS, Jest, ts-jest. Both worlds share <code>@nestjs/testing</code>, so everything from lessons 8.1–8.3 carries over — what differs is the runner. This lesson builds that "company" setup for real, runs into its known traps, and then moves it to Vitest, because sooner or later someone will ask you to.</p>

<h3>Everyday analogy: driving a manual car</h3>
<p>You learned on an automatic; the company car is a manual. The road rules (testing module, overrides, e2e) are identical. What you must learn is the clutch: where Jest needs a hand that Vitest does by itself, and the other way round.</p>

<h3>0. Why not just Jest on Nest 12?</h3>
<p>Tried first, on a fresh Nest 12 project switched to CommonJS + Jest 30, Node 22:</p>
<div class="out">${esc(OUT_J12)}</div>
<p>Nest 12 packages are ESM-only; Jest 30 can load them through <code>require(esm)</code> only from Node 24.9 <em>and</em> with <code>NODE_OPTIONS=--experimental-vm-modules</code> (Jest checks <code>vm.SourceTextModule</code>, which exists only behind that flag — measured in 11.4: Node 24.22 without the flag still fails, with it 4/4 pass). On Node 22 the options are: stay on Nest 11 with Jest, or use Vitest. Another real surprise while building the old setup: <code>npx @nestjs/cli@11 new</code> still produced a Nest 12 ESM + Vitest template (it pulls the latest schematics), so the Nest 11 project below was written by hand from the Nest 11 starter layout.</p>

<h3>1. The setup you will find</h3>
<pre><code class="language-json">${esc(MA_PKG)}</code></pre>
<p>A small rooms module with one legacy habit kept on purpose: the notification is a <strong>module function</strong>, not a provider — so it cannot be replaced with <code>overrideProvider</code>, only with <code>jest.mock</code>:</p>
<pre><code class="language-ts">${esc(MA_TB)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>

<h3>2. Trap 1 — supertest "is not a function"</h3>
<p>The first <code>npm run test:e2e</code>, with a <code>tsconfig.json</code> copied from a Nest 10 project:</p>
<div class="out">${esc(OUT_ST)}</div>
<p>In CommonJS, <code>import request from 'supertest'</code> compiles to <code>supertest_1.default(...)</code>, and supertest has no <code>default</code> export. Nest 10 projects wrote <code>import * as request from 'supertest'</code>; Nest 11 starters write the default import and add <code>"esModuleInterop": true</code>. Copy test code between projects of different ages and you get this. After adding the flag:</p>
<div class="out">${esc(OUT_XANH)}</div>

<h3>3. Trap 2 — Jest does not exit</h3>
<p>The rooms module also has a service with a <code>setInterval</code> started in <code>onModuleInit</code> — like a database pool, a Redis client or a queue worker:</p>
<pre><code class="language-ts">${esc(MA_DD)}</code></pre>
<p>Remove <code>afterAll(() =&gt; app.close())</code> from the e2e file:</p>
<div class="out">${esc(OUT_QUEN)}</div>
<ul>
<li>Jest reports the tests as passed, then waits for the event loop to empty — forever. In CI the job runs until its time limit.</li>
<li><code>--detectOpenHandles</code> printed nothing in 40 s in this case: the timer was created during Nest bootstrap, outside what Jest tracks. Do not rely on it to find the culprit.</li>
<li><code>--forceExit</code> makes the job green and hides the leak. Many legacy <code>package.json</code> files contain it; treat it as a smell, look for the missing <code>close()</code>.</li>
</ul>

<h3>4. Trap 3 — jest.mock is hoisted above your variables</h3>
<p>A common attempt to keep a handle on the mock:</p>
<div class="out">${esc(OUT_HOIST)}</div>
<p>ts-jest moves <code>jest.mock(...)</code> to the top of the file, above the <code>const</code>. When <code>rooms.service.ts</code> is imported, the factory runs and reads <code>guiGia</code> in its temporal dead zone. Two fixes: <code>jest.mocked(guiThongBao)</code> after importing (as in section 1), or make the factory lazy:</p>
<pre><code class="language-ts">${esc(MA_HOIST)}</code></pre>
<div class="out">${esc(OUT_HOIST2)}</div>

<h3>5. Speed: ts-jest or @swc/jest</h3>
<p>Measured with <code>--no-cache</code>, 3 runs each, 4 tests:</p>
<div class="out">${esc(OUT_TOC)}</div>
<p>About twice as fast — but read the trade-off, measured on a test with a type error (<code>capacity: '30'</code>):</p>
<div class="out">${esc(OUT_KIEU)}</div>
<ul>
<li>Without <code>.swcrc</code>, SWC does not even parse decorators. <em>Our own first speed measurement was taken in that broken state</em> — every run had failed and the timings were meaningless. Check the exit code and the "Tests:" line before trusting a benchmark.</li>
<li>With <code>.swcrc</code> the test passes despite the type error: SWC strips types without checking them (same as <code>nest build -b swc</code>, lesson 1.2). If you switch, run <code>tsc --noEmit</code> in CI.</li>
</ul>

<h3>6. Moving the project to Vitest</h3>
<p>Add <code>vitest</code>, one config file, and rename <code>jest.*</code> to <code>vi.*</code>:</p>
<pre><code class="language-ts">${esc(MA_VCONF)}</code></pre>
<div class="out">${esc(OUT_VITEST)}</div>
<p>Vitest 4 ran the CommonJS Nest 11 project unchanged — its transformer honours <code>emitDecoratorMetadata</code> from <code>tsconfig.json</code>, so DI works. It also reports the hoisting mistake from section 4 more clearly and offers <code>vi.hoisted</code>:</p>
<div class="out">${esc(OUT_VIHOIST)}</div>

<h3>7. The migration trap that turns red into green</h3>
<p>Old Jest suites contain callback-style async tests. The same test, with a <strong>wrong</strong> assertion, under both runners:</p>
<div class="out">${esc(OUT_DONE)}</div>
<p>Jest fails it correctly. Vitest passes it in 2 ms: Vitest gives the test function a <em>test context</em> object as first argument, not a <code>done</code> callback. The function returns immediately, the test is green, and the failing assertion runs after the test has finished. Before migrating, search the suite for <code>(done)</code> and rewrite those tests with <code>async</code>/<code>await</code> or a promise. A migration that keeps every test "green" may have switched some of them off.</p>

<h3>Jest ⇄ Vitest cheat sheet (only what was verified here)</h3>
<table>
<tr><th>Jest</th><th>Vitest</th><th>Note</th></tr>
<tr><td><code>jest.fn / jest.mock / jest.mocked</code></td><td><code>vi.fn / vi.mock / vi.mocked</code></td><td>Both hoist <code>mock</code>; use <code>vi.hoisted</code> for shared fakes</td></tr>
<tr><td>globals by default</td><td><code>test.globals: true</code></td><td>Or import <code>describe/it/expect</code> from vitest</td></tr>
<tr><td><code>it('…', (done) =&gt; …)</code></td><td>not supported — becomes test context</td><td>Rewrite with async/await first</td></tr>
<tr><td>ts-jest type-checks</td><td>no type check</td><td>Add <code>tsc --noEmit</code> to CI</td></tr>
<tr><td>hangs on open handles</td><td>exits, leak stays hidden</td><td>Close the app in both</td></tr>
</table>

<h3>🧪 Exercise (15 min)</h3>
<p>In the Nest 11 project, change <code>RoomsService</code> so the notification goes through an injectable <code>ThongBaoService</code> instead of the module function, then rewrite the unit test without <code>jest.mock</code>, using <code>overrideProvider</code>. Which test became shorter, and which mocking problem from this lesson disappeared?</p>
<details><summary>Show the answer</summary>
<pre><code class="language-ts">${esc(MA_BT_TB)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>With a provider, the test lists <code>{ provide: ThongBaoService, useValue: { gui: jest.fn() } }</code> and asserts on that object — no module mocking, no hoisting, nothing to get wrong in section 4, and the same test runs unchanged under Vitest except for <code>jest.fn</code> ⇒ <code>vi.fn</code>. That is the reason Nest projects inject even small helpers.</p>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Jest or Vitest for a Nest project?</strong> Existing Nest ≤ 11 CommonJS: Jest is fine. New Nest 12 (ESM) on Node 22: Vitest — Jest needs Node 24.9+ plus <code>--experimental-vm-modules</code> for ESM-only packages.</li>
<li><strong>"Jest did not exit one second after the test run" — what do you do?</strong> Find the resource not closed (usually <code>app.close()</code> or a DB/Redis client), not <code>--forceExit</code>.</li>
<li><strong>Why does jest.mock factory complain about a variable?</strong> The call is hoisted above it; use <code>jest.mocked</code> after import, a lazy wrapper, or (Vitest) <code>vi.hoisted</code>.</li>
<li><strong>What can go wrong migrating Jest to Vitest?</strong> <code>done</code>-callback tests become silently green; type checking disappears with the transformer; module mocks behave slightly differently. Grep, rewrite, and add a planted failure to prove the suite still fails.</li>
</ol>

<h3>💼 On the job</h3>
<p>Your OJT lead says "we are upgrading to Nest 12, please move the tests to Vitest". Do it in two PRs: first rewrite all <code>done</code>-style tests and remove <code>--forceExit</code> while still on Jest (the suite must stay green and exit by itself); then switch runners. Paste the before/after test counts in the PR description. If the count drops or a test you deliberately broke stays green, the migration is not done.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ts-jest / @swc/jest</span><span class="v">Jest transformers: TypeScript compiler with type check / SWC, faster, no type check.</span></div>
  <div class="kv"><span class="k">esModuleInterop</span><span class="v">Makes default imports of CommonJS packages work (import request from 'supertest').</span></div>
  <div class="kv"><span class="k">Hoisting</span><span class="v">jest.mock / vi.mock are moved above imports and variables.</span></div>
  <div class="kv"><span class="k">vi.hoisted</span><span class="v">Declare values that hoisted vi.mock factories may use.</span></div>
  <div class="kv"><span class="k">Open handle</span><span class="v">Timer, socket or pool still open after tests — keeps Jest alive.</span></div>
  <div class="kv"><span class="k">Test context</span><span class="v">The object Vitest passes as the first argument of a test function.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Nest 12 + Jest needs Node 24.9+ and <code>--experimental-vm-modules</code>; on Node 22 use Nest 11 + Jest or Vitest. <code>@nestjs/testing</code> is the same in both.</li>
<li>Legacy traps, all reproduced: missing <code>esModuleInterop</code>, missing <code>close()</code> (hang), hoisted <code>jest.mock</code>, SWC without <code>.swcrc</code> or without type check.</li>
<li>Vitest runs a CommonJS Nest project after renaming <code>jest.*</code> to <code>vi.*</code>.</li>
<li><code>done</code>-callback tests turn green on Vitest even when wrong — rewrite them before migrating.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.4</span>
<h2>8.4 — Dự án Jest mà bạn sẽ thực sự tiếp quản</h2>
<p class="lead">Khoá này dùng Nest 12, dự án mới mặc định ESM + Vitest. Phần lớn dự án bạn vào lúc thực tập được tạo bằng Nest 8–11: CommonJS, Jest, ts-jest. Hai thế giới dùng chung <code>@nestjs/testing</code>, nên mọi thứ ở bài 8.1–8.3 mang sang được — khác nhau ở trình chạy test. Bài này dựng đúng bộ "công ty" đó, chạy thật, vấp các bẫy quen thuộc của nó, rồi chuyển nó sang Vitest, vì sớm muộn cũng có người nhờ bạn làm việc đó.</p>

<h3>Liên hệ đời thường: lái xe số sàn</h3>
<p>Bạn học lái xe số tự động; xe công ty là số sàn. Luật giao thông (testing module, override, e2e) y hệt. Cái phải học là chân côn: chỗ nào Jest cần bạn ra tay còn Vitest tự lo, và ngược lại.</p>

<h3>0. Sao không dùng luôn Jest trên Nest 12?</h3>
<p>Đã thử trước, trên một dự án Nest 12 mới chuyển sang CommonJS + Jest 30, Node 22:</p>
<div class="out">${esc(OUT_J12)}</div>
<p>Các gói Nest 12 chỉ có ESM; Jest 30 chỉ nạp được chúng qua <code>require(esm)</code> từ Node 24.9 <em>và</em> khi có <code>NODE_OPTIONS=--experimental-vm-modules</code> (Jest kiểm <code>vm.SourceTextModule</code>, thứ chỉ có sau cờ đó — đo ở bài 11.4: Node 24.22 không cờ vẫn đỏ, có cờ 4/4 xanh). Trên Node 22, chọn một: ở lại Nest 11 với Jest, hoặc dùng Vitest. Một bất ngờ thật nữa khi dựng bộ cũ: <code>npx @nestjs/cli@11 new</code> vẫn sinh mẫu Nest 12 ESM + Vitest (nó kéo schematics mới nhất), nên dự án Nest 11 dưới đây được viết tay theo bố cục mẫu khởi đầu của Nest 11.</p>

<h3>1. Bộ cấu hình bạn sẽ gặp</h3>
<pre><code class="language-json">${esc(MA_PKG)}</code></pre>
<p>Một module phòng nhỏ, cố tình giữ một thói quen cũ: hàm gửi thông báo là <strong>hàm của module</strong>, không phải provider — nên không thay được bằng <code>overrideProvider</code>, chỉ thay được bằng <code>jest.mock</code>:</p>
<pre><code class="language-ts">${esc(MA_TB)}</code></pre>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_SPEC)}</code></pre>
<pre><code class="language-ts">${esc(MA_E2E)}</code></pre>

<h3>2. Bẫy 1 — supertest "is not a function"</h3>
<p>Lần <code>npm run test:e2e</code> đầu tiên, với <code>tsconfig.json</code> chép từ một dự án Nest 10:</p>
<div class="out">${esc(OUT_ST)}</div>
<p>Trong CommonJS, <code>import request from 'supertest'</code> biên dịch thành <code>supertest_1.default(...)</code>, mà supertest không có export <code>default</code>. Dự án Nest 10 viết <code>import * as request from 'supertest'</code>; mẫu Nest 11 viết import mặc định và thêm <code>"esModuleInterop": true</code>. Chép mã test giữa hai dự án khác "đời" là gặp lỗi này. Thêm cờ đó vào:</p>
<div class="out">${esc(OUT_XANH)}</div>

<h3>3. Bẫy 2 — Jest không chịu thoát</h3>
<p>Module phòng còn một service bật <code>setInterval</code> trong <code>onModuleInit</code> — giống pool DB, client Redis hay worker hàng đợi:</p>
<pre><code class="language-ts">${esc(MA_DD)}</code></pre>
<p>Bỏ <code>afterAll(() =&gt; app.close())</code> khỏi tệp e2e:</p>
<div class="out">${esc(OUT_QUEN)}</div>
<ul>
<li>Jest báo test đã qua, rồi chờ vòng lặp sự kiện trống — mãi mãi. Trên CI, job chạy tới hết giới hạn thời gian.</li>
<li><code>--detectOpenHandles</code> không in gì trong 40 giây ở ca này: bộ hẹn giờ được tạo trong lúc Nest khởi động, ngoài vùng Jest theo dõi. Đừng trông vào nó để tìm thủ phạm.</li>
<li><code>--forceExit</code> làm job xanh và che chỗ rò. Nhiều <code>package.json</code> cũ có sẵn cờ này; coi nó là dấu hiệu xấu, đi tìm <code>close()</code> bị thiếu.</li>
</ul>

<h3>4. Bẫy 3 — jest.mock bị kéo lên trên biến của bạn</h3>
<p>Một cách hay thử để giữ được tay cầm của đồ giả:</p>
<div class="out">${esc(OUT_HOIST)}</div>
<p>ts-jest dời <code>jest.mock(...)</code> lên đầu tệp, trên cả dòng <code>const</code>. Khi <code>rooms.service.ts</code> được import, factory chạy và đọc <code>guiGia</code> lúc nó còn trong vùng chết tạm thời (TDZ). Hai cách sửa: <code>jest.mocked(guiThongBao)</code> sau khi import (như mục 1), hoặc cho factory gọi lười:</p>
<pre><code class="language-ts">${esc(MA_HOIST)}</code></pre>
<div class="out">${esc(OUT_HOIST2)}</div>

<h3>5. Tốc độ: ts-jest hay @swc/jest</h3>
<p>Đo với <code>--no-cache</code>, mỗi loại 3 lần, 4 test:</p>
<div class="out">${esc(OUT_TOC)}</div>
<p>Nhanh gần gấp đôi — nhưng hãy đọc cái giá, đo trên một test có lỗi kiểu (<code>capacity: '30'</code>):</p>
<div class="out">${esc(OUT_KIEU)}</div>
<ul>
<li>Không có <code>.swcrc</code>, SWC còn không parse được decorator. <em>Lần đo tốc độ đầu tiên của chính bài này đã đo trong trạng thái hỏng đó</em> — mọi lượt chạy đều thất bại và con số vô nghĩa. Xem mã thoát và dòng "Tests:" trước khi tin một phép đo.</li>
<li>Có <code>.swcrc</code> thì test qua dù có lỗi kiểu: SWC bỏ kiểu đi mà không kiểm (giống <code>nest build -b swc</code>, bài 1.2). Nếu chuyển sang nó, hãy chạy <code>tsc --noEmit</code> trên CI.</li>
</ul>

<h3>6. Chuyển dự án sang Vitest</h3>
<p>Thêm <code>vitest</code>, một tệp cấu hình, đổi <code>jest.*</code> thành <code>vi.*</code>:</p>
<pre><code class="language-ts">${esc(MA_VCONF)}</code></pre>
<div class="out">${esc(OUT_VITEST)}</div>
<p>Vitest 4 chạy nguyên dự án Nest 11 CommonJS — bộ biên dịch của nó tôn trọng <code>emitDecoratorMetadata</code> trong <code>tsconfig.json</code>, nên DI chạy được. Nó còn báo lỗi hoisting ở mục 4 rõ hơn và có sẵn <code>vi.hoisted</code>:</p>
<div class="out">${esc(OUT_VIHOIST)}</div>

<h3>7. Bẫy chuyển đổi biến đỏ thành xanh</h3>
<p>Bộ test Jest cũ có các test bất đồng bộ kiểu callback. Cùng một test, khẳng định <strong>sai</strong>, chạy dưới cả hai trình:</p>
<div class="out">${esc(OUT_DONE)}</div>
<p>Jest đánh trượt đúng. Vitest cho qua trong 2 ms: Vitest truyền cho hàm test một đối tượng <em>test context</em> ở tham số đầu, không phải callback <code>done</code>. Hàm trả về ngay, test xanh, còn khẳng định sai chạy sau khi test đã kết thúc. Trước khi chuyển, hãy tìm <code>(done)</code> trong bộ test và viết lại bằng <code>async</code>/<code>await</code> hoặc promise. Một lần chuyển đổi giữ mọi test "xanh" có thể đã tắt mất vài test.</p>

<h3>Bảng đổi Jest ⇄ Vitest (chỉ những gì đã kiểm ở đây)</h3>
<table>
<tr><th>Jest</th><th>Vitest</th><th>Ghi chú</th></tr>
<tr><td><code>jest.fn / jest.mock / jest.mocked</code></td><td><code>vi.fn / vi.mock / vi.mocked</code></td><td>Cả hai đều kéo <code>mock</code> lên đầu; đồ giả dùng chung thì dùng <code>vi.hoisted</code></td></tr>
<tr><td>globals có sẵn</td><td><code>test.globals: true</code></td><td>Hoặc import <code>describe/it/expect</code> từ vitest</td></tr>
<tr><td><code>it('…', (done) =&gt; …)</code></td><td>không hỗ trợ — thành test context</td><td>Viết lại bằng async/await trước</td></tr>
<tr><td>ts-jest kiểm kiểu</td><td>không kiểm kiểu</td><td>Thêm <code>tsc --noEmit</code> vào CI</td></tr>
<tr><td>treo khi còn handle mở</td><td>thoát, chỗ rò bị giấu</td><td>Đóng app ở cả hai</td></tr>
</table>

<h3>🧪 Thực hành (15 phút)</h3>
<p>Trong dự án Nest 11, sửa <code>RoomsService</code> để gửi thông báo qua một <code>ThongBaoService</code> tiêm được thay cho hàm của module, rồi viết lại test đơn vị không dùng <code>jest.mock</code>, chỉ dùng <code>overrideProvider</code>. Test nào ngắn đi, và vấn đề mock nào trong bài biến mất?</p>
<details><summary>Xem đáp án</summary>
<pre><code class="language-ts">${esc(MA_BT_TB)}</code></pre>
<pre><code class="language-ts">${esc(MA_BT_SPEC)}</code></pre>
<div class="out">${esc(OUT_BT)}</div>
<p>Có provider thì test chỉ khai <code>{ provide: ThongBaoService, useValue: { gui: jest.fn() } }</code> rồi khẳng định trên đối tượng đó — không mock module, không hoisting, không còn gì để sai như mục 4, và cùng test đó chạy nguyên trên Vitest, chỉ đổi <code>jest.fn</code> ⇒ <code>vi.fn</code>. Đó là lý do dự án Nest tiêm cả những hàm phụ nhỏ.</p>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Dự án Nest nên dùng Jest hay Vitest?</strong> Dự án Nest ≤ 11 CommonJS đang có: Jest vẫn ổn. Dự án Nest 12 (ESM) mới trên Node 22: Vitest — Jest cần Node 24.9+ kèm cờ <code>--experimental-vm-modules</code> cho gói chỉ có ESM.</li>
<li><strong>"Jest did not exit one second after the test run" — bạn làm gì?</strong> Tìm tài nguyên chưa đóng (thường là <code>app.close()</code> hoặc client DB/Redis), không dùng <code>--forceExit</code>.</li>
<li><strong>Vì sao factory của jest.mock kêu về một biến?</strong> Lời gọi bị kéo lên trên biến đó; dùng <code>jest.mocked</code> sau import, bọc lười, hoặc (Vitest) <code>vi.hoisted</code>.</li>
<li><strong>Chuyển Jest sang Vitest có thể hỏng gì?</strong> Test kiểu <code>done</code> lặng lẽ xanh; mất kiểm kiểu theo bộ biên dịch; mock module hơi khác nhau. Tìm, viết lại, và cài một lỗi thử để chứng minh bộ test vẫn đỏ được.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Trưởng nhóm OJT nói "mình lên Nest 12, em chuyển test sang Vitest nhé". Làm trong hai PR: PR đầu viết lại mọi test kiểu <code>done</code> và gỡ <code>--forceExit</code> khi vẫn còn Jest (bộ test phải xanh và tự thoát); PR sau mới đổi trình chạy. Dán số test trước/sau vào mô tả PR. Nếu số test giảm, hoặc một test bạn cố tình làm sai vẫn xanh, thì việc chuyển chưa xong.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ts-jest / @swc/jest</span><span class="v">Bộ biên dịch cho Jest: trình biên dịch TypeScript có kiểm kiểu / SWC, nhanh hơn, không kiểm kiểu.</span></div>
  <div class="kv"><span class="k">esModuleInterop</span><span class="v">Cho import mặc định gói CommonJS chạy được (import request from 'supertest').</span></div>
  <div class="kv"><span class="k">Hoisting</span><span class="v">jest.mock / vi.mock bị dời lên trên các import và biến.</span></div>
  <div class="kv"><span class="k">vi.hoisted</span><span class="v">Khai giá trị mà factory vi.mock (đã bị dời lên) được dùng.</span></div>
  <div class="kv"><span class="k">Open handle</span><span class="v">Bộ hẹn giờ, socket, pool còn mở sau khi test xong — giữ Jest sống.</span></div>
  <div class="kv"><span class="k">Test context</span><span class="v">Đối tượng Vitest truyền vào tham số đầu của hàm test.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Nest 12 + Jest cần Node 24.9+ và cờ <code>--experimental-vm-modules</code>; trên Node 22 dùng Nest 11 + Jest hoặc Vitest. <code>@nestjs/testing</code> ở hai bên như nhau.</li>
<li>Bẫy của dự án cũ, đều đã tái hiện: thiếu <code>esModuleInterop</code>, thiếu <code>close()</code> (treo), <code>jest.mock</code> bị dời lên, SWC thiếu <code>.swcrc</code> hoặc không kiểm kiểu.</li>
<li>Vitest chạy được dự án Nest CommonJS sau khi đổi <code>jest.*</code> thành <code>vi.*</code>.</li>
<li>Test kiểu <code>done</code> chạy trên Vitest xanh cả khi sai — viết lại trước khi chuyển.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
