/**
 * 1.6 — Mốc dự án 1 (khoá nestjs, soạn 24/11/2026).
 * Ví dụ THẬT cho đề cuối khoá (phòng lab): scratchpad/nst/lab/c1/moc1 — nest g resource rooms + service trong bộ nhớ,
 * curl trong container nst-run-* (Node v22.23.5, Nest 12.6.0) qua t16.sh. PATCH {"id":99,…} ghi đè id ⇒ phòng 1 "biến mất"
 * (để dành cho chương 4 — whitelist).
 */
import { lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MA_SVC = "import { Injectable } from '@nestjs/common';\nimport { CreateRoomDto } from './dto/create-room.dto.js';\nimport { UpdateRoomDto } from './dto/update-room.dto.js';\nimport { Room } from './entities/room.entity.js';\n\n@Injectable()\nexport class RoomsService {\n  private rooms: Room[] = [\n    { id: 1, code: 'AL-201', building: 'Alpha', capacity: 30 },\n    { id: 2, code: 'BE-105', building: 'Beta', capacity: 24 },\n  ];\n  private nextId = 3;\n\n  create(dto: CreateRoomDto): Room {\n    const room = { id: this.nextId++, ...dto };\n    this.rooms.push(room);\n    return room;\n  }\n  findAll(building?: string): Room[] {\n    return building ? this.rooms.filter((r) => r.building === building) : this.rooms;\n  }\n  findOne(id: number): Room | undefined {\n    return this.rooms.find((r) => r.id === id);\n  }\n  update(id: number, dto: UpdateRoomDto): Room | undefined {\n    const room = this.findOne(id);\n    if (room) Object.assign(room, dto);      // ⚠ chương 4: DTO + whitelist, kẻo ghi đè cả id\n    return room;\n  }\n  remove(id: number): boolean {\n    const i = this.rooms.findIndex((r) => r.id === id);\n    if (i === -1) return false;\n    this.rooms.splice(i, 1);\n    return true;\n  }\n}";
const MA_CTL = "import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, NotFoundException, Query } from '@nestjs/common';\nimport { RoomsService } from './rooms.service.js';\nimport { CreateRoomDto } from './dto/create-room.dto.js';\nimport { UpdateRoomDto } from './dto/update-room.dto.js';\n\n@Controller('rooms')\nexport class RoomsController {\n  constructor(private readonly roomsService: RoomsService) {}\n\n  @Post()\n  create(@Body() dto: CreateRoomDto) {\n    return this.roomsService.create(dto);\n  }\n\n  @Get()\n  findAll(@Query('building') building?: string) {\n    return this.roomsService.findAll(building);\n  }\n\n  @Get(':id')\n  findOne(@Param('id') id: string) {\n    const room = this.roomsService.findOne(+id);\n    if (!room) throw new NotFoundException(`Room ${id} not found`);\n    return room;\n  }\n\n  @Patch(':id')\n  update(@Param('id') id: string, @Body() dto: UpdateRoomDto) {\n    const room = this.roomsService.update(+id, dto);\n    if (!room) throw new NotFoundException(`Room ${id} not found`);\n    return room;\n  }\n\n  @Delete(':id')\n  @HttpCode(204)\n  remove(@Param('id') id: string) {\n    if (!this.roomsService.remove(+id)) throw new NotFoundException(`Room ${id} not found`);\n  }\n}";
const OUT_16 = "$ curl localhost:3000/rooms\n[{\"id\":1,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":30},{\"id\":2,\"code\":\"BE-105\",\"building\":\"Beta\",\"capacity\":24}]   [200]\n$ curl localhost:3000/rooms?building=Beta\n[{\"id\":2,\"code\":\"BE-105\",\"building\":\"Beta\",\"capacity\":24}]   [200]\n$ curl -X POST localhost:3000/rooms -H Content-Type: application/json -d {\"code\":\"AL-305\",\"building\":\"Alpha\",\"capacity\":40}\n{\"id\":3,\"code\":\"AL-305\",\"building\":\"Alpha\",\"capacity\":40}   [201]\n$ curl -X PATCH localhost:3000/rooms/3 -H Content-Type: application/json -d {\"capacity\":36}\n{\"id\":3,\"code\":\"AL-305\",\"building\":\"Alpha\",\"capacity\":36}   [200]\n$ curl -X DELETE localhost:3000/rooms/2\n   [204]\n$ curl localhost:3000/rooms/2\n{\"message\":\"Room 2 not found\",\"error\":\"Not Found\",\"statusCode\":404}   [404]\n# và lỗ hổng để dành cho chương 4:\n$ curl -X PATCH localhost:3000/rooms/1 -H Content-Type: application/json -d {\"id\":99,\"capacity\":\"rất nhiều\"}\n{\"id\":99,\"code\":\"AL-201\",\"building\":\"Alpha\",\"capacity\":\"rất nhiều\"}   [200]\n$ curl localhost:3000/rooms/1\n{\"message\":\"Room 1 not found\",\"error\":\"Not Found\",\"statusCode\":404}   [404]";

const THE = [
  lienKet({ khoa: 'nestjs', bai: 'nst-0-2-du-an', title: '0.2 — Dự án xuyên suốt', sub: 'Năm đề tài gợi ý, bảng mốc từng chương, rubric dự án cuối.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-0-4-du-an', title: 'Node.js 0.4 — Dự án xuyên suốt', sub: 'Đã có đề tài bằng Express? Viết lại nó bằng Nest ngay từ mốc này.', cta: 'Mở bài →' }),
].join('\n');

const README = `# Lab Booking API (NestJS)

Đặt lịch phòng lab: sinh viên đặt, giảng viên duyệt, admin quản lý phòng.

## Chạy
npm install
npm run start:dev        # http://localhost:3000
npm test                 # test đơn vị (Vitest)

## Tài nguyên hiện có (mốc 1)
GET    /rooms?building=   danh sách phòng
GET    /rooms/:id         một phòng (404 nếu không có)
POST   /rooms             tạo phòng (201)
PATCH  /rooms/:id         sửa phòng
DELETE /rooms/:id         xoá phòng (204)

## Môi trường
xem MOI-TRUONG.md (output của npx nest info)`;

export default {
  title: '1.6 — Project milestone 1: skeleton and first resource of your topic|||1.6 — Mốc dự án 1: khung và tài nguyên đầu tiên của đề tài',
  slug: 'nst-1-6-moc-du-an',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mốc 1 của đề tài bạn chọn ở bài 0.2: dự án Nest 12 chạy được, một tài nguyên CRUD lưu trong bộ nhớ với mã trạng thái đúng, README chạy được, MOI-TRUONG.md, commit đầu. Ví dụ chạy thật cho đề cuối khoá (tài nguyên rooms) — kèm lỗ hổng cố ý để lại cho chương 4.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Project milestone 1</span>
<h2>1.6 — Milestone 1: a skeleton that runs, and your first resource</h2>
<p class="lead">Take the topic you registered in lesson 0.2 and give it a running Nest skeleton with one resource. Everything stays in memory; the database arrives in chapter 6. Below is a worked example for the capstone topic (lab booking): the <code>rooms</code> resource.</p>

<h3>Steps</h3>
<ol>
<li><code>nest new &lt;topic&gt; --type esm</code> (upgrade npm first — lesson 0.1). Delete <code>AppController</code>/<code>AppService</code> if you do not need them.</li>
<li>Pick the <strong>one entity everything else hangs on</strong> (doctor, event, device, job posting, project — for the capstone: room). <code>nest g resource &lt;name&gt;</code>.</li>
<li>Replace the generated strings with a real in-memory service: seed two items, implement the five operations, return <code>undefined</code>/<code>false</code> when not found (no HTTP in the service).</li>
<li>Controller: 404 via <code>NotFoundException</code>, 204 on delete, one useful query filter.</li>
<li>README (how to run, endpoint list), <code>MOI-TRUONG.md</code> (output of <code>npx nest info</code>), first commit: <code>milestone 1: skeleton + rooms in memory</code>.</li>
</ol>

<h3>Worked example: <code>rooms</code></h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<div class="out">${esc(OUT_16)}</div>
<p>The last two calls are a deliberate hole: <code>Object.assign(room, dto)</code> accepted <code>id: 99</code> and a string capacity, and room 1 "vanished". This is the mass assignment of lesson 0.9 in your own code. Leave it for now — write it down in your README under "Known issues". Chapter 4 closes it with DTOs and a whitelist, and you will be able to show the before/after in an interview.</p>

<h3>README template</h3>
<pre><code class="language-markdown">${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Done when</strong> (check each):</p>
<ul>
<li>☐ <code>npm run start:dev</code> starts; the startup log shows every route of your resource (<code>Mapped</code> lines).</li>
<li>☐ curl output saved for: list, filter, create (201), update, delete (204), get after delete (404).</li>
<li>☐ The service imports nothing from <code>@nestjs/common</code> except <code>Injectable</code>.</li>
<li>☐ README + MOI-TRUONG.md + a "Known issues" line about the PATCH hole.</li>
<li>☐ One commit with the milestone message.</li>
</ul>
</div>
${THE}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Mốc dự án 1</span>
<h2>1.6 — Mốc 1: một bộ khung chạy được, và tài nguyên đầu tiên</h2>
<p class="lead">Lấy đề tài bạn đã đăng ký ở bài 0.2, dựng cho nó một bộ khung Nest chạy được với một tài nguyên. Mọi thứ còn lưu trong bộ nhớ; cơ sở dữ liệu tới ở chương 6. Bên dưới là ví dụ làm sẵn cho đề cuối khoá (đặt lịch phòng lab): tài nguyên <code>rooms</code>.</p>

<h3>Các bước</h3>
<ol>
<li><code>nest new &lt;đề-tài&gt; --type esm</code> (nâng npm trước — bài 0.1). Xoá <code>AppController</code>/<code>AppService</code> nếu không cần.</li>
<li>Chọn <strong>một thực thể mà mọi thứ khác bám vào</strong> (bác sĩ, sự kiện, thiết bị, tin tuyển dụng, dự án — với đề cuối khoá: phòng). Chạy <code>nest g resource &lt;tên&gt;</code>.</li>
<li>Thay các chuỗi mẫu bằng một service thật lưu trong bộ nhớ: gieo sẵn hai phần tử, làm đủ năm thao tác, trả <code>undefined</code>/<code>false</code> khi không thấy (service không dính HTTP).</li>
<li>Controller: 404 bằng <code>NotFoundException</code>, 204 khi xoá, thêm một bộ lọc query có ích.</li>
<li>README (cách chạy, danh sách endpoint), <code>MOI-TRUONG.md</code> (output của <code>npx nest info</code>), commit đầu: <code>milestone 1: skeleton + rooms in memory</code>.</li>
</ol>

<h3>Ví dụ làm sẵn: <code>rooms</code></h3>
<pre><code class="language-ts">${esc(MA_SVC)}</code></pre>
<pre><code class="language-ts">${esc(MA_CTL)}</code></pre>
<div class="out">${esc(OUT_16)}</div>
<p>Hai lệnh cuối là lỗ hổng cố ý để lại: <code>Object.assign(room, dto)</code> nhận cả <code>id: 99</code> lẫn sức chứa là chuỗi, và phòng 1 "biến mất". Đây chính là mass assignment của bài 0.9, nằm trong mã của bạn. Cứ để đó — ghi vào README mục "Lỗi đã biết". Chương 4 bịt nó bằng DTO và whitelist, và bạn sẽ có trước/sau để kể khi phỏng vấn.</p>

<h3>Mẫu README</h3>
<pre><code class="language-markdown">${esc(README)}</code></pre>

<div class="callout ok">
<p><strong>Đạt khi</strong> (đánh dấu từng mục):</p>
<ul>
<li>☐ <code>npm run start:dev</code> chạy; log khởi động có đủ mọi route của tài nguyên (các dòng <code>Mapped</code>).</li>
<li>☐ Lưu output curl cho: danh sách, lọc, tạo (201), sửa, xoá (204), đọc sau khi xoá (404).</li>
<li>☐ Service không import gì từ <code>@nestjs/common</code> ngoài <code>Injectable</code>.</li>
<li>☐ Có README + MOI-TRUONG.md + một dòng "Lỗi đã biết" về lỗ hổng PATCH.</li>
<li>☐ Một commit với thông điệp của mốc.</li>
</ul>
</div>
${THE}
</div>
`,
};
