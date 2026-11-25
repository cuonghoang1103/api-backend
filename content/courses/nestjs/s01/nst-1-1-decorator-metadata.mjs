/**
 * 1.1 — Decorator và reflect-metadata (khoá nestjs, soạn 24/11/2026).
 * Output THẬT: container nst-run-* (node:22-alpine, Node v22.23.5), TypeScript 6.0.3, reflect-metadata 0.2.2.
 * Thư mục scratchpad/nst/lab/c1/deco: thu-tu.ts (decorator chạy lúc nào), meta.ts (design:paramtypes),
 * khong-deco.ts (class không decorator ⇒ undefined), mini-nest.ts (router @Get 62 dòng, curl thật).
 * Đo thật: tắt emitDecoratorMetadata ⇒ mọi metadata undefined; experimentalDecorators:false (decorator chuẩn TC39)
 * ⇒ TS1206 "Decorators are not valid here." ở decorator tham số. Bài typescript-14-4 dạy decorator TC39 — bài này chỉ dạy
 * phần Nest cần (legacy + metadata), liên kết chéo sang đó cho cú pháp.
 */
import { nguon, lienKet } from '../_chung.mjs';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THE = [
  lienKet({ khoa: 'typescript', bai: 'typescript-14-4-decorators', title: 'TypeScript 14.4 — Decorator', sub: 'Cú pháp decorator chuẩn TC39, context có kiểu, khi nào cần bước build. Bài này không dạy lại phần đó.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-5-2-dinh-tuyen', title: 'Node.js 5.2 — Định tuyến trong Express', sub: 'Router mini ở cuối bài làm đúng việc app.get() làm, chỉ khác cách khai báo.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📘', 'TypeScript Handbook — Decorators (experimental)', 'experimentalDecorators, thứ tự đánh giá, decorator tham số, emitDecoratorMetadata.', 'https://www.typescriptlang.org/docs/handbook/decorators.html'),
  nguon('📦', 'rbuckton/reflect-metadata', 'Thư viện polyfill Reflect.defineMetadata / getMetadata mà Nest dùng.', 'https://github.com/rbuckton/reflect-metadata'),
  nguon('📘', 'NestJS Docs — Custom decorators', 'Nest tự mô tả: decorator là khái niệm cốt lõi, dựng trên metadata.', 'https://docs.nestjs.com/custom-decorators'),
].join('\n');
const MA_THUTU = "// Decorator chạy LÚC NÀO? In ra từng bước.\nconsole.log('1. trước khi định nghĩa class');\n\nfunction Ghi(nhan: string) {\n  console.log(`2. gọi hàm tạo decorator: ${nhan}`);\n  return (target: any, key?: string) => {\n    console.log(`3. decorator chạy: ${nhan} trên ${key ?? target.name}`);\n  };\n}\n\n@Ghi('class')\nclass MonAn {\n  @Ghi('phương thức nau') nau() { return 'phở'; }\n  @Ghi('phương thức don') don() { return 'dọn bàn'; }\n}\n\nconsole.log('4. class đã định nghĩa xong — chưa có đối tượng nào');\nconst m = new MonAn();\nconsole.log('5. new MonAn() →', m.nau());";
const OUT_THUTU = "$ npx tsc && node dist/thu-tu.js\n1. trước khi định nghĩa class\n2. gọi hàm tạo decorator: phương thức nau\n3. decorator chạy: phương thức nau trên nau\n2. gọi hàm tạo decorator: phương thức don\n3. decorator chạy: phương thức don trên don\n2. gọi hàm tạo decorator: class\n3. decorator chạy: class trên MonAn\n4. class đã định nghĩa xong — chưa có đối tượng nào\n5. new MonAn() → phở";
const MA_META = "import 'reflect-metadata';\n\ninterface KhoGhiChu { tim(id: number): string }      // interface: biến mất sau biên dịch\nclass DongHo { bayGio() { return new Date(0).toISOString(); } }\n\nconst Injectable = (): ClassDecorator => () => {};   // decorator rỗng — chỉ để TS sinh metadata\nconst Body = (): ParameterDecorator => () => {};\n\n@Injectable()\nclass NotesService {\n  constructor(private dongHo: DongHo, private kho: KhoGhiChu, private ten: string) {}\n  tao(@Body() _x: number): DongHo { return this.dongHo; }\n}\n\nconsole.log('design:paramtypes (constructor):', Reflect.getMetadata('design:paramtypes', NotesService));\nconsole.log('design:paramtypes (tao):        ', Reflect.getMetadata('design:paramtypes', NotesService.prototype, 'tao'));\nconsole.log('design:returntype (tao):        ', Reflect.getMetadata('design:returntype', NotesService.prototype, 'tao'));";
const OUT_META = "$ node dist/meta.js        # tsconfig: experimentalDecorators + emitDecoratorMetadata\ndesign:paramtypes (constructor): [ [class DongHo], [Function: Object], [Function: String] ]\ndesign:paramtypes (tao):         [ [Function: Number] ]\ndesign:returntype (tao):         [class DongHo]";
const OUT_META2 = "$ npx tsc --emitDecoratorMetadata false --outDir dist2 && node dist2/meta.js\ndesign:paramtypes (constructor): undefined\ndesign:paramtypes (tao):         undefined\ndesign:returntype (tao):         undefined";
const MA_KD = "import 'reflect-metadata';\nclass DongHo {}\nclass KhongDecorator { constructor(public d: DongHo) {} }\nconsole.log('không decorator trên class →', Reflect.getMetadata('design:paramtypes', KhongDecorator));";
const OUT_KD = "$ node dist/khong-deco.js\nkhông decorator trên class → undefined";
const OUT_TC39 = "$ npx tsc -p tsconfig.tc39.json     # experimentalDecorators: false = decorator chuẩn TC39\nmeta.ts(12,7): error TS1206: Decorators are not valid here.";
const OUT_JS = "__decorate([\n    __param(0, Body()),\n    __metadata(\"design:type\", Function),\n    __metadata(\"design:paramtypes\", [Number]),\n    __metadata(\"design:returntype\", DongHo)\n], NotesService.prototype, \"tao\", null);\nNotesService = __decorate([\n    Injectable(),\n    __metadata(\"design:paramtypes\", [DongHo, Object, String])\n], NotesService);";
const MA_MINI = "import 'reflect-metadata';\nimport { createServer } from 'node:http';\n\n// ── 1. Decorator: chỉ GHI metadata, không chạy gì cả ──\ntype Route = { method: string; path: string; handler: string };\nconst Controller = (prefix: string): ClassDecorator => (target) =>\n  Reflect.defineMetadata('prefix', prefix, target);\nconst Get = (path = ''): MethodDecorator => (target, key) => {\n  const routes: Route[] = Reflect.getMetadata('routes', target.constructor) ?? [];\n  routes.push({ method: 'GET', path, handler: String(key) });\n  Reflect.defineMetadata('routes', routes, target.constructor);\n};\nconst Param = (name: string): ParameterDecorator => (target, key, index) =>\n  Reflect.defineMetadata(`param:${index}`, name, target, key!);\nconst Injectable = (): ClassDecorator => () => {};\n\n// ── 2. \"Framework\": đọc metadata, tạo đối tượng, nối route ──\nfunction taoDoiTuong(cls: any): any {\n  const phuThuoc: any[] = Reflect.getMetadata('design:paramtypes', cls) ?? [];\n  return new cls(...phuThuoc.map(taoDoiTuong));          // DI tí hon (chương 2 làm đầy đủ)\n}\nfunction khoiDong(controllers: any[], port: number) {\n  const bang = new Map<string, (p: Record<string, string>) => unknown>();\n  for (const C of controllers) {\n    const obj = taoDoiTuong(C);\n    for (const r of Reflect.getMetadata('routes', C) as Route[]) {\n      const duong = `${Reflect.getMetadata('prefix', C)}${r.path}`;\n      console.log(`Mapped {${duong}, ${r.method}}`);\n      bang.set(`${r.method} ${duong}`, (p) => {\n        const so = obj[r.handler].length;\n        const args = Array.from({ length: so }, (_, i) => p[Reflect.getMetadata(`param:${i}`, obj, r.handler)]);\n        return obj[r.handler](...args);\n      });\n    }\n  }\n  createServer((req, res) => {\n    for (const [k, fn] of bang) {                          // khớp \"/notes/:id\" kiểu thô sơ\n      const [m, mau] = k.split(' ');\n      const re = new RegExp('^' + mau.replace(/:(\\w+)/g, '(?<$1>[^/]+)') + '$');\n      const kq = req.method === m && req.url!.match(re);\n      if (kq) return res.end(JSON.stringify(fn(kq.groups ?? {})));\n    }\n    res.statusCode = 404; res.end('{\"message\":\"Not Found\"}');\n  }).listen(port, () => console.log(`nghe cổng ${port}`));\n}\n\n// ── 3. Mã của \"người dùng framework\" — giống hệt Nest ──\n@Injectable()\nclass NotesService {\n  private ds = ['học decorator', 'học DI'];\n  tatCa() { return this.ds; }\n  mot(id: number) { return this.ds[id] ?? null; }\n}\n\n@Controller('/notes')\nclass NotesController {\n  constructor(private readonly notes: NotesService) {}\n  @Get() tatCa() { return this.notes.tatCa(); }\n  @Get('/:id') mot(@Param('id') id: string) { return { id, note: this.notes.mot(Number(id)) }; }\n}\n\nkhoiDong([NotesController], 3000);";
const OUT_MINI = "$ node dist/mini-nest.js\nMapped {/notes, GET}\nMapped {/notes/:id, GET}\nnghe cổng 3000";
const OUT_CURL = "$ curl localhost:3000/notes\n[\"học decorator\",\"học DI\"]\n$ curl localhost:3000/notes/1\n{\"id\":\"1\",\"note\":\"học DI\"}\n$ curl localhost:3000/notes/abc\n{\"id\":\"abc\",\"note\":null}\n$ curl localhost:3000/khong-co\n{\"message\":\"Not Found\"}";

export default {
  title: '1.1 — Decorators and reflect-metadata: build a 60-line @Get router yourself|||1.1 — Decorator và reflect-metadata: tự viết router @Get 60 dòng',
  slug: 'nst-1-1-decorator-metadata',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Decorator kiểu cũ (experimentalDecorators) là hàm chạy MỘT lần lúc định nghĩa class, chỉ để ghi metadata; emitDecoratorMetadata cho TypeScript ghi kiểu tham số constructor (design:paramtypes) — thứ DI của Nest đọc. Thí nghiệm thật: thứ tự chạy, tắt metadata, decorator chuẩn TC39 báo TS1206, rồi tự viết một router @Controller/@Get/@Param 62 dòng chạy được bằng curl.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>1.1 — Decorators are not magic: they write sticky notes, and Nest reads them later</h2>
<p class="lead">Every Nest file is covered in <code>@Something()</code>. If you treat them as magic words, the first error message ("Nest can't resolve dependencies…") will feel random. In this lesson you run four small experiments and then write a 62-line "mini Nest" that maps <code>@Get</code> routes by reading metadata. After that, nothing in chapter 1–3 is a black box.</p>

<h3>Everyday picture: labels on parcels</h3>
<p>At a delivery hub, nobody opens the boxes. A worker sticks labels on them when they are packed ("fragile", "district 7", "cash on delivery"); later, the sorting machine reads the labels and decides where each box goes. A decorator is the worker with the label gun: it runs once, when the class is <em>defined</em>, and sticks metadata on it. Nest is the sorting machine: at startup it reads the labels and builds routes and objects.</p>

<h3>Experiment 1 — when does a decorator run?</h3>
<pre><code class="language-ts">${esc(MA_THUTU)}</code></pre>
<div class="out">${esc(OUT_THUTU)}</div>
<p>Read the numbers: everything happens <strong>before</strong> line 4 — before any object exists. Member decorators run first, top to bottom, then the class decorator. <code>new MonAn()</code> runs no decorator at all. So a decorator cannot "check every request"; it can only <em>record</em> something that another piece of code uses later. That is the whole design of Nest.</p>

<h3>Experiment 2 — the metadata TypeScript writes for you</h3>
<p>Nest's tsconfig turns on two switches: <code>experimentalDecorators</code> (the older decorator dialect, which allows decorators on parameters) and <code>emitDecoratorMetadata</code> (TypeScript writes the <em>types</em> it sees next to any decorated member). Here the decorators are empty functions — they exist only to trigger the emission:</p>
<pre><code class="language-ts">${esc(MA_META)}</code></pre>
<div class="out">${esc(OUT_META)}</div>
<p>This is what the compiler actually produced (<code>dist/meta.js</code>):</p>
<pre><code class="language-js">${esc(OUT_JS)}</code></pre>
<p>Three facts to remember, because each becomes an error you will meet:</p>
<ul>
<li><code>design:paramtypes</code> on the class = the <strong>constructor parameter types</strong>, in order. Nest's DI container reads exactly this list to know what to inject.</li>
<li>An <strong>interface</strong> becomes <code>Object</code>: interfaces vanish after compilation. If a constructor asks for an interface, Nest has nothing to look up — you will need a token and <code>@Inject()</code> (lesson 2.2).</li>
<li>A primitive becomes <code>String</code>/<code>Number</code>: technically present, but there is no "the string" to inject. Same fix.</li>
</ul>

<h3>Experiment 3 — take the switches away</h3>
<div class="out">${esc(OUT_META2)}</div>
<div class="out">${esc(OUT_KD)}</div>
<pre><code class="language-ts">${esc(MA_KD)}</code></pre>
<p>Without <code>emitDecoratorMetadata</code> every list is <code>undefined</code>. And even with it, a class that has <strong>no decorator at all</strong> gets no metadata — this is the real reason every Nest service carries <code>@Injectable()</code>: the decorator is the trigger that makes TypeScript record the constructor types.</p>
<div class="out">${esc(OUT_TC39)}</div>
<p>The newer <strong>standard (TC39) decorators</strong> — the ones lesson typescript 14.4 teaches — do not support parameter decorators and do not emit type metadata. Nest's <code>@Body()</code>, <code>@Param()</code>, <code>@Inject()</code> are parameter decorators, so Nest 12 still requires the legacy mode. If you copy a tsconfig from another project and see TS1206 on <code>@Body()</code>, check <code>experimentalDecorators</code> first.</p>

<h3>Experiment 4 — a mini Nest in 62 lines</h3>
<p>Three parts: decorators that only <em>write</em> metadata, a "framework" that <em>reads</em> it at startup, and user code that looks exactly like Nest.</p>
<pre><code class="language-ts">${esc(MA_MINI)}</code></pre>
<div class="out">${esc(OUT_MINI)}</div>
<div class="out">${esc(OUT_CURL)}</div>
<p>Look at what you just built, because Nest does the same with far more care:</p>
<ul>
<li><code>Mapped {/notes, GET}</code> is printed while <em>reading labels at startup</em> — Nest's <code>RouterExplorer</code> prints the same line for the same reason.</li>
<li><code>taoDoiTuong</code> created <code>NotesService</code> because the controller's <code>design:paramtypes</code> said so. That is dependency injection in 3 lines; chapter 2 grows it into a real container (singletons, cycles, tokens).</li>
<li><code>/notes/abc</code> returned <code>"abc"</code> and <code>null</code>: path parameters are strings, and our framework has no validation step. Nest's answer is the <em>pipe</em> (lessons 1.4, 3.3).</li>
<li>No match ⇒ we wrote a 404 by hand. In Nest that is an <em>exception filter</em> (lesson 3.2).</li>
</ul>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<ol>
<li>Add <code>@Post()</code> to the mini Nest (method <code>POST</code>, read the body with <code>req.on('data')</code>) and a <code>@Body()</code> parameter decorator.</li>
<li>Add a constructor parameter typed as an interface to <code>NotesController</code>. Predict what <code>taoDoiTuong</code> does, then run it.</li>
<li>Remove <code>@Injectable()</code> from <code>NotesService</code> but give it a constructor dependency. What breaks, and why?</li>
</ol>
<details><summary>Show answers</summary>
<p>2 — <code>design:paramtypes</code> contains <code>Object</code>, so <code>taoDoiTuong(Object)</code> runs <code>new Object()</code>: you get an empty object, and the first method call fails with "is not a function". Real Nest refuses earlier, at startup, with a clear message — far better than failing on the first request. 3 — without a decorator TypeScript emits no metadata, <code>getMetadata</code> returns <code>undefined</code>, our <code>?? []</code> turns it into "no dependencies", and the dependency is <code>undefined</code> at runtime. This is why the decorator matters even when it does nothing.</p>
</details>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decorator</span><span class="v">A function applied to a class, method, property or parameter when the class is defined.</span></div>
  <div class="kv"><span class="k">decorator factory</span><span class="v"><code>@Get('x')</code>: a function that returns the decorator, so it can take arguments.</span></div>
  <div class="kv"><span class="k">metadata</span><span class="v">Data attached to a class or member with <code>Reflect.defineMetadata</code>, read back with <code>getMetadata</code>.</span></div>
  <div class="kv"><span class="k">design:paramtypes</span><span class="v">Constructor (or method) parameter types emitted by TypeScript; the input of Nest's DI.</span></div>
  <div class="kv"><span class="k">experimentalDecorators</span><span class="v">The legacy decorator dialect that Nest needs (parameter decorators, metadata).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A decorator runs once at class definition and only records metadata; Nest reads it at startup.</li>
<li><code>emitDecoratorMetadata</code> + any decorator ⇒ TypeScript records constructor types; that list drives injection.</li>
<li>Interfaces become <code>Object</code>: they cannot be injected by type — use a token (2.2).</li>
<li>Nest 12 still needs <code>experimentalDecorators</code>; standard TC39 decorators reject parameter decorators (TS1206).</li>
<li>Routes, DI, pipes and filters in Nest are "read the labels, then act" — you built a 62-line version yourself.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>1.1 — Decorator không phải phép màu: nó dán nhãn, Nest đọc nhãn sau</h2>
<p class="lead">Tệp Nest nào cũng đầy <code>@Gì-đó()</code>. Nếu coi chúng là câu thần chú, thông báo lỗi đầu tiên ("Nest can't resolve dependencies…") sẽ trông như ngẫu nhiên. Bài này cho bạn chạy bốn thí nghiệm nhỏ, rồi tự viết một "Nest tí hon" 62 dòng tự nối route <code>@Get</code> bằng cách đọc metadata. Xong bài, chương 1–3 không còn hộp đen nào.</p>

<h3>Liên hệ đời thường: nhãn dán trên thùng hàng</h3>
<p>Ở kho phân loại của hãng giao hàng, không ai mở thùng ra xem. Lúc đóng gói, nhân viên dán nhãn ("dễ vỡ", "quận 7", "thu hộ"); sau đó máy phân loại đọc nhãn và quyết định thùng đi băng chuyền nào. Decorator là người cầm súng dán nhãn: nó chạy <em>một lần</em>, lúc class được <em>định nghĩa</em>, và dán metadata lên class. Nest là máy phân loại: lúc khởi động, nó đọc nhãn rồi dựng route và tạo đối tượng.</p>

<h3>Thí nghiệm 1 — decorator chạy lúc nào?</h3>
<pre><code class="language-ts">${esc(MA_THUTU)}</code></pre>
<div class="out">${esc(OUT_THUTU)}</div>
<p>Đọc các con số: mọi thứ xảy ra <strong>trước</strong> dòng 4 — trước khi có đối tượng nào. Decorator của thành viên chạy trước, từ trên xuống, rồi mới tới decorator của class. <code>new MonAn()</code> không chạy decorator nào cả. Vậy decorator không thể "kiểm mỗi request"; nó chỉ <em>ghi lại</em> một điều để đoạn mã khác dùng sau. Toàn bộ thiết kế của Nest nằm ở câu này.</p>

<h3>Thí nghiệm 2 — metadata TypeScript tự ghi giúp bạn</h3>
<p>tsconfig của Nest bật hai công tắc: <code>experimentalDecorators</code> (phương ngữ decorator kiểu cũ, cho phép đặt decorator lên tham số) và <code>emitDecoratorMetadata</code> (TypeScript ghi lại <em>kiểu</em> nó thấy cạnh mọi thành viên có decorator). Ở đây decorator là hàm rỗng — chỉ để kích hoạt việc ghi:</p>
<pre><code class="language-ts">${esc(MA_META)}</code></pre>
<div class="out">${esc(OUT_META)}</div>
<p>Đây là thứ trình biên dịch thật sự sinh ra (<code>dist/meta.js</code>):</p>
<pre><code class="language-js">${esc(OUT_JS)}</code></pre>
<p>Ba điều cần nhớ, vì mỗi điều sẽ thành một lỗi bạn gặp:</p>
<ul>
<li><code>design:paramtypes</code> trên class = <strong>kiểu các tham số constructor</strong>, đúng thứ tự. DI container của Nest đọc chính danh sách này để biết cần tiêm gì.</li>
<li><strong>Interface</strong> thành <code>Object</code>: interface biến mất sau biên dịch. Constructor đòi một interface thì Nest không có gì để tra — bạn sẽ cần token và <code>@Inject()</code> (bài 2.2).</li>
<li>Kiểu nguyên thuỷ thành <code>String</code>/<code>Number</code>: có mặt, nhưng không có "cái chuỗi" nào để tiêm. Cách sửa như trên.</li>
</ul>

<h3>Thí nghiệm 3 — tắt công tắc đi</h3>
<div class="out">${esc(OUT_META2)}</div>
<div class="out">${esc(OUT_KD)}</div>
<pre><code class="language-ts">${esc(MA_KD)}</code></pre>
<p>Không có <code>emitDecoratorMetadata</code> thì mọi danh sách là <code>undefined</code>. Và kể cả có bật, class <strong>không mang decorator nào</strong> cũng không được ghi metadata — đây là lý do thật khiến service nào của Nest cũng mang <code>@Injectable()</code>: decorator là cò súng khiến TypeScript ghi lại kiểu tham số constructor.</p>
<div class="out">${esc(OUT_TC39)}</div>
<p><strong>Decorator chuẩn TC39</strong> (loại bài typescript 14.4 dạy) không hỗ trợ decorator trên tham số và không ghi metadata kiểu. <code>@Body()</code>, <code>@Param()</code>, <code>@Inject()</code> của Nest đều là decorator tham số, nên Nest 12 vẫn cần chế độ cũ. Chép tsconfig từ dự án khác sang mà thấy TS1206 ở <code>@Body()</code> thì kiểm <code>experimentalDecorators</code> trước tiên.</p>

<h3>Thí nghiệm 4 — Nest tí hon 62 dòng</h3>
<p>Ba phần: decorator chỉ <em>ghi</em> metadata, một "framework" <em>đọc</em> metadata lúc khởi động, và mã người dùng trông y hệt Nest.</p>
<pre><code class="language-ts">${esc(MA_MINI)}</code></pre>
<div class="out">${esc(OUT_MINI)}</div>
<div class="out">${esc(OUT_CURL)}</div>
<p>Nhìn kỹ thứ bạn vừa dựng, vì Nest làm đúng như vậy, chỉ cẩn thận hơn nhiều:</p>
<ul>
<li><code>Mapped {/notes, GET}</code> được in ra lúc <em>đọc nhãn khi khởi động</em> — <code>RouterExplorer</code> của Nest in đúng dòng ấy vì đúng lý do ấy.</li>
<li><code>taoDoiTuong</code> tạo <code>NotesService</code> vì <code>design:paramtypes</code> của controller bảo vậy. Đó là dependency injection trong 3 dòng; chương 2 phát triển nó thành container thật (singleton, vòng lặp, token).</li>
<li><code>/notes/abc</code> trả <code>"abc"</code> và <code>null</code>: tham số đường dẫn là chuỗi, và framework của ta không có bước kiểm dữ liệu. Câu trả lời của Nest là <em>pipe</em> (bài 1.4, 3.3).</li>
<li>Không khớp route nào ⇒ ta tự viết 404. Trong Nest đó là việc của <em>exception filter</em> (bài 3.2).</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Thêm <code>@Post()</code> vào Nest tí hon (phương thức <code>POST</code>, đọc body bằng <code>req.on('data')</code>) và một decorator tham số <code>@Body()</code>.</li>
<li>Thêm vào <code>NotesController</code> một tham số constructor có kiểu là interface. Đoán xem <code>taoDoiTuong</code> làm gì, rồi chạy thử.</li>
<li>Bỏ <code>@Injectable()</code> khỏi <code>NotesService</code> nhưng cho nó một phụ thuộc trong constructor. Cái gì hỏng, vì sao?</li>
</ol>
<details><summary>Xem đáp án</summary>
<p>2 — <code>design:paramtypes</code> chứa <code>Object</code>, nên <code>taoDoiTuong(Object)</code> chạy <code>new Object()</code>: bạn nhận một object rỗng, và lần gọi phương thức đầu tiên hỏng với "is not a function". Nest thật từ chối sớm hơn, ngay lúc khởi động, với thông báo rõ ràng — tốt hơn nhiều so với hỏng ở request đầu tiên. 3 — không có decorator thì TypeScript không ghi metadata, <code>getMetadata</code> trả <code>undefined</code>, <code>?? []</code> biến nó thành "không có phụ thuộc", và lúc chạy phụ thuộc là <code>undefined</code>. Vì thế decorator quan trọng ngay cả khi thân nó rỗng.</p>
</details>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decorator</span><span class="v">Hàm áp lên class, phương thức, thuộc tính hoặc tham số lúc class được định nghĩa.</span></div>
  <div class="kv"><span class="k">decorator factory</span><span class="v"><code>@Get('x')</code>: hàm trả về decorator, để nhận được đối số.</span></div>
  <div class="kv"><span class="k">metadata</span><span class="v">Dữ liệu gắn vào class/thành viên bằng <code>Reflect.defineMetadata</code>, đọc lại bằng <code>getMetadata</code>.</span></div>
  <div class="kv"><span class="k">design:paramtypes</span><span class="v">Kiểu tham số constructor (hoặc phương thức) do TypeScript ghi; đầu vào của DI trong Nest.</span></div>
  <div class="kv"><span class="k">experimentalDecorators</span><span class="v">Phương ngữ decorator kiểu cũ mà Nest cần (decorator tham số, metadata).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Decorator chạy một lần lúc định nghĩa class và chỉ ghi metadata; Nest đọc metadata lúc khởi động.</li>
<li><code>emitDecoratorMetadata</code> + một decorator bất kỳ ⇒ TypeScript ghi kiểu tham số constructor; danh sách đó điều khiển việc tiêm.</li>
<li>Interface thành <code>Object</code>: không tiêm theo kiểu được — dùng token (2.2).</li>
<li>Nest 12 vẫn cần <code>experimentalDecorators</code>; decorator chuẩn TC39 từ chối decorator tham số (TS1206).</li>
<li>Route, DI, pipe, filter trong Nest đều là "đọc nhãn rồi hành động" — bạn vừa tự dựng một bản 62 dòng.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
