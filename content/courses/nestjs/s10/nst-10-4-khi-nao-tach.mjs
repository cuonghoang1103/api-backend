/**
 * 10.4 — Khi nào chưa nên tách: khối nguyên theo module trước (khoá nestjs, soạn 24/11/2026).
 * Output THẬT (máy nhà, Node 22.22, Nest 12.6.0, @nestjs/microservices 12.6.0 TCP 127.0.0.1:41982; máy đang tải ~5):
 * scratchpad/nst/lab/c10/app/src/b104 (do.ts: 5000 lần BookingsService.dat, TACH=0/1, dịch vụ phòng = dist/b103 VAI=svc IM=1) ⇒ lab/c10/o/104-do.txt, 104-ba-lan.txt.
 * Nguồn đã GET 24/11/2026: Twilio/Segment "Goodbye Microservices" (10/07/2018), Shopify Engineering "Deconstructing the Monolith" (21/02/2019).
 * Ghép: gen.mjs rồi ghep.sh 104 nst-10-4-khi-nao-tach.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'nodejs', bai: 'nodejs-18-4-monolith-hay-tach', title: 'Node.js 18.4 — Monolith hay tách', sub: 'Lập luận chung, không gắn framework — bài này chỉ thêm phần Nest.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'system-design', bai: 'sysd-12-3-monolith-micro', title: 'System design 12.3 — Modular monolith và microservices, nói thật', sub: 'Góc nhìn kiến trúc ở quy mô lớn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'distributed-systems', bai: 'dist-8-3-saga', title: 'Hệ phân tán 8.3 — Saga: hỏng hóc và bù trừ', sub: 'Giá phải trả khi một giao dịch DB biến thành nhiều dịch vụ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nestjs', bai: 'nst-2-3-module', title: 'NestJS 2.3 — Module: imports, exports, đóng gói', sub: 'Provider không export thì module khác không tiêm được — ranh giới có sẵn.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📰', 'Twilio Segment Engineering (10/07/2018) — Goodbye Microservices: From 100s of problem children to 1 superstar', 'Hơn 140 dịch vụ gộp về một; trước đó 3 kỹ sư toàn thời gian chủ yếu chỉ để giữ hệ thống sống.', 'https://www.twilio.com/en-us/blog/developers/best-practices/goodbye-microservices'),
  nguon('📰', 'Shopify Engineering (21/02/2019) — Deconstructing the Monolith', 'Một trong những codebase Rails lớn nhất chọn modular monolith: chia thành component có ranh giới, không tách dịch vụ.', 'https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity'),
].join('\n');
const MA_API = "// Hợp đồng duy nhất module Lịch được biết về module Phòng\nexport type Phong = { id: string; ten: string; sucChua: number };\nexport abstract class PhongApi {\n  abstract lay(id: string): Promise<Phong>;\n}";
const MA_ROOMS = "import { Injectable, Module } from '@nestjs/common';\nimport { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';\nimport { Inject } from '@nestjs/common';\nimport { firstValueFrom, timeout } from 'rxjs';\nimport { PhongApi, type Phong } from './phong.api.js';\n\n@Injectable()\nclass PhongTaiCho extends PhongApi {                 // cùng tiến trình: gọi hàm\n  async lay(id: string): Promise<Phong> { return { id, ten: `Phòng ${id}`, sucChua: 30 }; }\n}\n\n@Injectable()\nclass PhongQuaMang extends PhongApi {                // đã tách: gọi qua TCP\n  constructor(@Inject('PHONG') private readonly c: ClientProxy) { super(); }\n  lay(id: string) { return firstValueFrom(this.c.send<Phong>('phong.lay', id).pipe(timeout(1000))); }\n}\n\nconst TACH = process.env.TACH === '1';\n@Module({\n  imports: TACH ? [ClientsModule.register([{ name: 'PHONG', transport: Transport.TCP, options: { host: '127.0.0.1', port: 41982 } }])] : [],\n  providers: [{ provide: PhongApi, useClass: TACH ? PhongQuaMang : PhongTaiCho }],\n  exports: [PhongApi],                               // chỉ lộ hợp đồng, không lộ lớp cài đặt\n})\nexport class RoomsModule {}";
const MA_BK = "import { Injectable, Module } from '@nestjs/common';\nimport { PhongApi } from './phong.api.js';\nimport { RoomsModule } from './rooms.module.js';\n\n@Injectable()\nexport class BookingsService {\n  constructor(private readonly phong: PhongApi) {}   // không biết phòng ở cùng tiến trình hay bên kia mạng\n  async dat(phongId: string, soNguoi: number) {\n    const p = await this.phong.lay(phongId);\n    return soNguoi <= p.sucChua ? 'OK' : 'QUA_SUC_CHUA';\n  }\n}\n\n@Module({ imports: [RoomsModule], providers: [BookingsService] })\nexport class BookingsModule {}";
const OUT_DO = "cùng tiến trình: 5000 lần dat(), p50 0.3 µs, p99 0.6 µs, tổng 0.00 s, lỗi 0\ntách (TCP)  : 5000 lần dat(), p50 92.2 µs, p99 293.7 µs, tổng 0.55 s, lỗi 0\n# tắt dịch vụ phòng, chạy lại bản tách\ntách (TCP)  : 5000 lần dat(), p50 8.0 µs, p99 34.2 µs, tổng 0.05 s, lỗi 5000";
const OUT_BA = "tách (TCP)  : 5000 lần dat(), p50 107.4 µs, p99 338.4 µs, tổng 0.63 s, lỗi 0\ncùng tiến trình: 5000 lần dat(), p50 0.3 µs, p99 0.7 µs, tổng 0.00 s, lỗi 0\ntách (TCP)  : 5000 lần dat(), p50 68.9 µs, p99 260.3 µs, tổng 0.44 s, lỗi 0\ncùng tiến trình: 5000 lần dat(), p50 0.4 µs, p99 0.7 µs, tổng 0.00 s, lỗi 0\ntách (TCP)  : 5000 lần dat(), p50 67.6 µs, p99 222.9 µs, tổng 0.41 s, lỗi 0\ncùng tiến trình: 5000 lần dat(), p50 0.3 µs, p99 1.5 µs, tổng 0.00 s, lỗi 0";
export default {
  title: '10.4 — When not to split: a modular monolith first|||10.4 — Khi nào chưa nên tách: khối nguyên theo module trước',
  slug: 'nst-10-4-khi-nao-tach',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Đo cùng một lời gọi BookingsService → phòng, 5000 lần: trong một tiến trình p50 0,3 µs; tách thành dịch vụ TCP ngay trên localhost p50 57–107 µs, và dịch vụ tắt thì 5000/5000 lỗi. Rồi dựng ranh giới bằng chính module Nest: hợp đồng PhongApi, module chỉ export hợp đồng, đổi một dòng useClass là "tách" xong mà service không sửa. Bảng tiêu chí khi nào đáng tách, và hai công ty thật đã đi ngược: Segment 2018, Shopify 2019.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>10.4 — The network hop is a cost: measure it, then draw boundaries without it</h2>
<p class="lead">Lesson 10.3 listed what a transport adds: timeouts, lost events, duplicate handling, errors that do not serialize. This lesson asks the earlier question — do you need the hop at all? The general argument is in Node.js 18.4 and System Design 12.3; here we measure it in Nest and show that Nest modules already give you the boundary that people usually split services to get.</p>

<h3>Everyday analogy: one flat with rooms, or many flats</h3>
<p>Three students can share one flat with lockable rooms: one kitchen, one electricity bill, one key for the front door. Or each can rent a separate flat: three kitchens, three bills, and a phone call every time you want to borrow salt. Separate flats make sense when someone keeps very different hours or needs a much bigger room — not because "rooms with doors" sounded untidy.</p>

<h3>1. The measurement</h3>
<p>The same <code>BookingsService.dat()</code> asks the rooms part for a room's capacity, 5000 times after a warm-up, once with the rooms code in the same process and once behind TCP (the 10.3 service, on the same machine — the best case a network can offer):</p>
<div class="out">${esc(OUT_DO)}</div>
<div class="out">$ # ba lượt nữa, xen kẽ
${esc(OUT_BA)}</div>
<ul>
<li>In-process: about 0.3 µs per call. Over localhost TCP: 57–107 µs p50, 220–340 µs p99 — two to three hundred times slower, and the run-to-run spread is larger than the in-process cost itself. Between two real machines the network round trip is added on top.</li>
<li>Stop the service and the split version fails every single call. In one process, "the rooms module is down" is not a state that exists.</li>
<li>A few hundred microseconds is nothing for one request. It matters because real requests make many such calls, in sequence, and every one of them can now fail on its own.</li>
</ul>

<h3>2. The boundary, without the network</h3>
<p>What people want from a split is usually a <em>boundary</em>: booking code must not reach into room internals. A Nest module gives you that inside one process. Define the contract, implement it in the rooms module, export only the contract:</p>
<pre><code class="language-ts">${esc(MA_API)}</code></pre>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
<ul>
<li><code>BookingsService</code> depends on the abstract <code>PhongApi</code>, the DI token. It cannot see <code>PhongTaiCho</code> (not exported from the file, not exported from the module).</li>
<li>The measurement above is exactly this code: <code>TACH=1</code> swaps one <code>useClass</code>. Splitting later is a provider change plus a deployment, not a rewrite — if you kept the boundary honest until then.</li>
<li>Keeping it honest is mostly about data: a module owns its tables; other modules go through its contract, never <code>prisma.room.findMany</code> from the bookings code. A shared database is the coupling that makes later splits impossible.</li>
</ul>

<h3>3. When splitting is worth it</h3>
<table>
<tr><th>Reason to split</th><th>Check it with</th></tr>
<tr><td>One part needs very different scale (e.g. image processing)</td><td>A measured load profile, not a guess. A queue worker (chapter 9) is often enough.</td></tr>
<tr><td>Separate teams need separate release schedules</td><td>Several teams actually blocked by one deploy pipeline.</td></tr>
<tr><td>Fault isolation: a crash in X must not stop Y</td><td>X has a failure mode a process boundary would contain (memory, native code).</td></tr>
<tr><td>Different runtime or language</td><td>A real requirement (ML in Python), not a preference.</td></tr>
</table>
<p>The price, from 10.3 and the distributed systems course: timeouts and retries on every call, events that can be lost or doubled, transactions that become sagas, one more thing to deploy, monitor and trace, and a local setup that needs every service running.</p>

<h3>4. Two companies that went back</h3>
<ul>
<li><strong>Segment, 2018.</strong> Each destination had become its own service and repo; shared libraries drifted apart across them. By the time they consolidated <em>over 140 services into one</em>, three full-time engineers were spending most of their time just keeping the system alive.</li>
<li><strong>Shopify, 2019.</strong> One of the largest Ruby on Rails codebases chose a <em>modular monolith</em>: carve the code into components with explicit boundaries and dependencies, keep one deployable.</li>
</ul>

<h3>🧪 Exercise (10 min) — split or not?</h3>
<p>For each situation, decide and give the one reason that decides it.</p>
<ol>
<li>The booking API (4 developers) wants to move the "rooms" module into a service "for clean architecture".</li>
<li>Generating monthly PDF reports blocks the event loop for 8 seconds and slows every request.</li>
<li>A second team, in another country, will own payments and release on its own schedule; payments needs PCI audits the rest of the app should not be in scope for.</li>
</ol>
<details><summary>Show answers</summary>
<ol>
<li>Not split: the boundary is already a module with an exported contract; nothing measured needs independent scaling or deploys.</li>
<li>Move the work, not the architecture: a BullMQ job processed by a separate worker process (9.1) — same codebase, separate process.</li>
<li>Split is justified: separate ownership and release cadence, and a compliance boundary that a process and network boundary actually provides.</li>
</ol>
</details>

<h3>🎤 Interviewers will ask</h3>
<ol>
<li><strong>Monolith or microservices for a new project?</strong> Modular monolith first; split a module when a measured need (scale, team, isolation, runtime) appears.</li>
<li><strong>How do you keep a monolith splittable?</strong> Modules depend on exported contracts, each module owns its tables, no cross-module queries.</li>
<li><strong>What does a network call cost compared to a function call?</strong> Hundreds of times more latency even on localhost, plus new failure modes.</li>
<li><strong>What replaces a database transaction across services?</strong> A saga with compensating steps, or an outbox — more code and eventual consistency.</li>
</ol>

<h3>💼 On the job</h3>
<p>On OJT you will more likely maintain a large monolith than design microservices. The useful skill is finding the seams: which modules talk to which tables, which calls cross boundaries. When a customer asks to "convert to microservices", the first deliverable that pays off is a module map with dependencies — it often shows the split they want would cut through a shared table.</p>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Modular monolith</span><span class="v">One deployable, split into modules with explicit contracts.</span></div>
  <div class="kv"><span class="k">Contract (port)</span><span class="v">An abstract class/token other modules depend on instead of the implementation.</span></div>
  <div class="kv"><span class="k">Data ownership</span><span class="v">Each module alone reads/writes its tables.</span></div>
  <div class="kv"><span class="k">Strangler pattern</span><span class="v">Replace a part behind its contract step by step.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Measured: 0.3 µs in process vs 57–107 µs over localhost TCP; split + service down = every call fails.</li>
<li>Nest modules + an exported abstract contract give the boundary without the hop.</li>
<li>Splitting later is a <code>useClass</code> change if data ownership stayed clean.</li>
<li>Split for measured scale, team ownership, isolation or runtime — not for tidiness.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>10.4 — Bước nhảy qua mạng là chi phí: đo nó, rồi vẽ ranh giới mà không cần nó</h2>
<p class="lead">Bài 10.3 liệt kê những gì transport thêm vào: timeout, sự kiện mất, xử lý trùng, lỗi không tuần tự hoá được. Bài này hỏi câu đến trước — có cần bước nhảy đó không? Lập luận chung nằm ở Node.js 18.4 và System Design 12.3; ở đây ta đo nó trong Nest và cho thấy module Nest đã cho sẵn đúng cái ranh giới mà người ta thường tách dịch vụ để có được.</p>

<h3>Liên hệ đời thường: một căn hộ nhiều phòng, hay nhiều căn hộ</h3>
<p>Ba sinh viên có thể ở chung một căn hộ có phòng khoá riêng: một bếp, một hoá đơn điện, một chìa cửa chính. Hoặc mỗi người thuê một căn: ba cái bếp, ba hoá đơn, và mỗi lần mượn muối là một cuộc điện thoại. Ở riêng hợp lý khi có người sinh hoạt giờ giấc khác hẳn hay cần phòng to hơn nhiều — chứ không phải vì "phòng có cửa" nghe chưa gọn.</p>

<h3>1. Phép đo</h3>
<p>Cùng một <code>BookingsService.dat()</code> hỏi phần phòng sức chứa của một phòng, 5000 lần sau khi làm nóng: một lần mã phòng nằm cùng tiến trình, một lần nằm sau TCP (dịch vụ của 10.3, trên cùng máy — trường hợp tốt nhất mạng có thể cho):</p>
<div class="out">${esc(OUT_DO)}</div>
<div class="out">$ # ba lượt nữa, xen kẽ
${esc(OUT_BA)}</div>
<ul>
<li>Cùng tiến trình: khoảng 0,3 µs mỗi lần. Qua TCP localhost: p50 57–107 µs, p99 220–340 µs — chậm hơn hai đến ba trăm lần, và độ dao động giữa các lượt còn lớn hơn cả chi phí gọi trong tiến trình. Giữa hai máy thật còn cộng thêm thời gian đi mạng.</li>
<li>Tắt dịch vụ thì bản tách hỏng đúng từng lời gọi một. Trong một tiến trình, "module phòng đang sập" là trạng thái không tồn tại.</li>
<li>Vài trăm micro giây chẳng là gì với một request. Nó đáng kể vì request thật gọi rất nhiều lần như thế, nối tiếp nhau, và giờ lần nào cũng có thể hỏng riêng.</li>
</ul>

<h3>2. Ranh giới, không cần mạng</h3>
<p>Thứ người ta muốn khi tách thường là một <em>ranh giới</em>: mã đặt lịch không được thò tay vào ruột phần phòng. Module Nest cho bạn điều đó ngay trong một tiến trình. Định nghĩa hợp đồng, cài nó trong module phòng, chỉ export hợp đồng:</p>
<pre><code class="language-ts">${esc(MA_API)}</code></pre>
<pre><code class="language-ts">${esc(MA_ROOMS)}</code></pre>
<pre><code class="language-ts">${esc(MA_BK)}</code></pre>
<ul>
<li><code>BookingsService</code> phụ thuộc lớp trừu tượng <code>PhongApi</code> — chính là token DI. Nó không nhìn thấy <code>PhongTaiCho</code> (tệp không export, module cũng không export).</li>
<li>Phép đo ở trên chạy đúng mã này: <code>TACH=1</code> đổi một dòng <code>useClass</code>. Tách về sau là đổi provider cộng một lần triển khai, không phải viết lại — miễn là bạn giữ ranh giới trung thực tới lúc đó.</li>
<li>Giữ trung thực chủ yếu là chuyện dữ liệu: module nào sở hữu bảng của nó; module khác đi qua hợp đồng, không bao giờ <code>prisma.room.findMany</code> từ mã đặt lịch. DB dùng chung chính là sợi dây khiến việc tách sau này bất khả.</li>
</ul>

<h3>3. Khi nào tách mới đáng</h3>
<table>
<tr><th>Lý do tách</th><th>Kiểm bằng gì</th></tr>
<tr><td>Một phần cần quy mô khác hẳn (ví dụ xử lý ảnh)</td><td>Hồ sơ tải đã đo, không phải đoán. Thường một worker hàng đợi (chương 9) là đủ.</td></tr>
<tr><td>Các đội riêng cần lịch phát hành riêng</td><td>Nhiều đội thật sự bị chặn bởi một đường triển khai.</td></tr>
<tr><td>Cô lập lỗi: X sập không được kéo Y</td><td>X có kiểu hỏng mà ranh giới tiến trình chặn được (bộ nhớ, mã native).</td></tr>
<tr><td>Runtime hoặc ngôn ngữ khác</td><td>Yêu cầu thật (ML bằng Python), không phải sở thích.</td></tr>
</table>
<p>Cái giá, từ 10.3 và khoá Hệ phân tán: timeout và thử lại ở mọi lời gọi, sự kiện có thể mất hoặc nhân đôi, giao dịch biến thành saga, thêm một thứ phải triển khai, giám sát và truy vết, và môi trường chạy ở máy cần bật đủ mọi dịch vụ.</p>

<h3>4. Hai công ty đã quay đầu</h3>
<ul>
<li><strong>Segment, 2018.</strong> Mỗi "destination" đã thành một dịch vụ và một repo riêng; thư viện dùng chung trôi mỗi nơi một phiên bản. Tới lúc họ gộp <em>hơn 140 dịch vụ về một</em>, ba kỹ sư toàn thời gian đang dành phần lớn thời gian chỉ để giữ hệ thống sống.</li>
<li><strong>Shopify, 2019.</strong> Một trong những codebase Ruby on Rails lớn nhất chọn <em>modular monolith</em>: chia mã thành component có ranh giới và phụ thuộc tường minh, vẫn giữ một khối triển khai.</li>
</ul>

<h3>🧪 Thực hành (10 phút) — tách hay không?</h3>
<p>Với mỗi tình huống, quyết định và nêu một lý do quyết định.</p>
<ol>
<li>API đặt lịch (4 lập trình viên) muốn chuyển module "phòng" thành dịch vụ riêng "cho kiến trúc sạch".</li>
<li>Xuất báo cáo PDF hằng tháng chặn event loop 8 giây, làm chậm mọi request.</li>
<li>Một đội thứ hai, ở nước khác, sẽ sở hữu phần thanh toán và phát hành theo lịch riêng; thanh toán cần kiểm toán PCI mà phần còn lại không nên nằm trong phạm vi.</li>
</ol>
<details><summary>Xem đáp án</summary>
<ol>
<li>Không tách: ranh giới đã là một module có hợp đồng export; không có gì đo được cần mở rộng hay triển khai độc lập.</li>
<li>Dời việc, không dời kiến trúc: một job BullMQ do tiến trình worker riêng xử lý (9.1) — cùng codebase, khác tiến trình.</li>
<li>Tách là hợp lý: sở hữu và nhịp phát hành riêng, cộng ranh giới tuân thủ mà chỉ ranh giới tiến trình và mạng mới thật sự tạo ra.</li>
</ol>
</details>

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>Dự án mới: monolith hay microservice?</strong> Modular monolith trước; tách một module khi xuất hiện nhu cầu đã đo (quy mô, đội, cô lập, runtime).</li>
<li><strong>Giữ monolith tách được về sau bằng cách nào?</strong> Module phụ thuộc hợp đồng được export, mỗi module sở hữu bảng của mình, không truy vấn chéo module.</li>
<li><strong>Một lời gọi qua mạng tốn bao nhiêu so với gọi hàm?</strong> Độ trễ gấp hàng trăm lần ngay cả trên localhost, cộng các kiểu hỏng mới.</li>
<li><strong>Thứ gì thay giao dịch DB khi trải qua nhiều dịch vụ?</strong> Saga với bước bù trừ, hoặc outbox — thêm mã và nhất quán sau cùng.</li>
</ol>

<h3>💼 Tình huống đi làm</h3>
<p>Đi OJT bạn dễ được giao bảo trì một monolith lớn hơn là thiết kế microservice. Kỹ năng đáng giá là tìm đường nối: module nào đụng bảng nào, lời gọi nào vượt ranh giới. Khi khách đòi "chuyển sang microservice", sản phẩm đầu tiên đáng tiền là một bản đồ module kèm phụ thuộc — nó hay cho thấy đường tách khách muốn sẽ cắt ngang một bảng dùng chung.</p>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Modular monolith</span><span class="v">Một khối triển khai, chia thành module có hợp đồng tường minh.</span></div>
  <div class="kv"><span class="k">Hợp đồng (port)</span><span class="v">Lớp trừu tượng/token mà module khác phụ thuộc thay cho lớp cài đặt.</span></div>
  <div class="kv"><span class="k">Sở hữu dữ liệu</span><span class="v">Chỉ module đó đọc/ghi bảng của nó.</span></div>
  <div class="kv"><span class="k">Strangler pattern</span><span class="v">Thay dần một phần nằm sau hợp đồng của nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đo được: 0,3 µs trong tiến trình so với 57–107 µs qua TCP localhost; tách + dịch vụ tắt = mọi lời gọi đều hỏng.</li>
<li>Module Nest + hợp đồng trừu tượng được export cho ranh giới mà không cần bước nhảy mạng.</li>
<li>Tách về sau chỉ là đổi <code>useClass</code> nếu sở hữu dữ liệu vẫn sạch.</li>
<li>Tách vì quy mô đã đo, vì đội sở hữu, vì cô lập hay runtime — không phải vì cho gọn.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
