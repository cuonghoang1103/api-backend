/**
 * Web Foundations — Chương 9: TypeScript cơ bản (types, interface, function/generic,
 * tsconfig/tsc, TS trong Node.js/Next.js). Dựa trên JavaScript của CHƯƠNG 4/5.
 * Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng nhau). ⚠️ KHÔNG backtick trần
 * trong content (dùng &#96;); `${` trong code escape thành \${. Quiz có field content.
 */

import { gallery, galleryGiang } from './_slides.mjs';
import L95 from './s09/wf-9-5-ts-in-practice.mjs';
import L94 from './s09/wf-9-4-functions-generics.mjs';
import L93 from './s09/wf-9-3-interfaces.mjs';
import L92 from './s09/wf-9-2-basic-types.mjs';
import L91 from './s09/wf-9-1-why-typescript.mjs';
import { onTapBai } from './_on-tap/index.mjs';

export default {
  title: 'Chapter 9 — TypeScript basics|||Chương 9 — TypeScript cơ bản',
  description: 'JavaScript chạy được, nhưng không nói cho bạn biết một hàm mong đợi gì cho tới khi nó nổ lúc chạy. TypeScript thêm một lớp "types" lên trên JavaScript bạn đã học ở Chương 4-5 — cùng cú pháp, cùng cách suy nghĩ, chỉ thêm annotation để trình biên dịch bắt lỗi TRƯỚC khi bạn bấm chạy. Học interface, function/generic cơ bản, và cách dự án api-backend này (và Node.js/Next.js nói chung) dùng TypeScript thật.',
  lessons: [
    /* ─────────────────── 9.0 slide bài giảng ─────────────────── */
    {
      title: '9.0 — Lecture slides: TypeScript in 12 slides|||9.0 — Slide bài giảng: TypeScript trong 12 slide',
      slug: 'wf-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Kiểu cơ bản, interface, hàm có kiểu và generic nhập môn — đủ để đọc hiểu mã TypeScript.',
      content: `
<div class="ml-en"><h2>📑 Lecture slides: TypeScript in 12 slides</h2>
<p>The goal here is reading, not writing. You will meet TypeScript in other people code long before you choose it yourself.</p>
<p>Two ways to use it: skim before the chapter to see what is coming, then come back afterwards to revise. If a slide still does not make sense, the lesson that teaches it is right below.</p></div>
<div class="ml-vi"><h2>📑 Slide bài giảng: TypeScript trong 12 slide</h2>
<p>Mục tiêu ở đây là ĐỌC HIỂU, chưa phải viết. Bạn sẽ gặp TypeScript trong mã người khác từ lâu trước khi tự chọn dùng nó.</p>
<p>Hai cách dùng: lướt trước khi học chương để biết sắp học gì, rồi quay lại ôn sau. Slide nào còn chưa hiểu thì bài dạy nó nằm ngay bên dưới.</p></div>
${galleryGiang('wf-ts', [
  [1, "Bìa"],
  [2, "Nội dung chương"],
  [3, "Vì sao thêm một bước biên dịch"],
  [4, "Kiểu cơ bản"],
  [5, "Suy luận kiểu — đừng gõ thừa"],
  [6, "interface — mô tả hình dáng object ⭐"],
  [7, "type vs interface"],
  [8, "Hàm có kiểu"],
  [9, "Generic — nhập môn nhẹ nhàng"],
  [10, "TypeScript trong thực tế"],
  [11, "Ba lỗi TypeScript hay gặp nhất"],
  [12, "Tự luyện"],
])}
`,
    },

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    L91,

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    L92,

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    L93,

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    L94,

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    L95,

    /* ─────────────────────────── 9.6 quiz ─────────────────────────── */
    {
      title: '9.6 — Chapter 9 quiz|||9.6 — Kiểm tra chương 9',
      slug: 'wf-9-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về vì sao dùng TypeScript, kiểu cơ bản, union/any, interface, gắn kiểu hàm và generic cơ bản, và tsc/tsconfig.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 9: why TypeScript, basic types and annotations, union types and any, interfaces, typing functions, a gentle intro to generics, and how tsc/tsconfig fit into a real project.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> Reading about types only gets you so far. On Code Lab, annotate real variables and functions, define interfaces, and watch the compiler catch mistakes on the TypeScript track.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Checked, then erased</span><span class="lz-t">No runtime protection</span><span class="lz-d">The compiler checks your code against itself. Data from an API or a form was never seen by it — validate at the boundary.</span></div>
<div class="lz-node"><span class="lz-k">Annotate parameters</span><span class="lz-t">Let the rest infer</span><span class="lz-d">A parameter's type is a decision only you can make. <code>const n = 3</code> is already typed; writing <code>: number</code> adds nothing.</span></div>
<div class="lz-node"><span class="lz-k">strict on, day one</span><span class="lz-t">Especially strictNullChecks</span><span class="lz-d">Without it the compiler cannot see a single null dereference — the most common runtime error in JavaScript stays invisible.</span></div>
<div class="lz-node"><span class="lz-k">! and as are promises</span><span class="lz-t">Not checks</span><span class="lz-d">Both silence the compiler without changing the data. If you cannot back the promise up, write the check instead.</span></div>
</div>
<p class="note-ct"><strong>The errors are the product.</strong> When TypeScript refuses something, the useful reflex is "what does it know that I do not?" — not "how do I make this message go away". Nearly every red squiggle you silence with <code>!</code> or <code>any</code> is a crash you have agreed to meet later.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-9-0-slides&khoa=web-foundations">Practice on Code Lab → Chapter 9 practice set (30 auto-graded exercises)</a></div>
<div class="link-card"><a href="/code-lab/typescript">Go further → the full TypeScript track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 9: vì sao dùng TypeScript, kiểu cơ bản và annotation, union type và any, interface, gắn kiểu cho hàm, làm quen nhẹ với generic, và tsc/tsconfig vận hành trong một dự án thật thế nào.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Chỉ đọc về type thì không đủ. Trên Code Lab, hãy gắn annotation cho biến và hàm thật, định nghĩa interface, và xem trình biên dịch bắt lỗi ở track TypeScript.</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Kiểm rồi xoá</span><span class="lz-t">Không bảo vệ gì lúc chạy</span><span class="lz-d">Trình biên dịch kiểm mã của bạn với chính nó. Dữ liệu từ một API hay một form thì nó chưa từng thấy — hãy kiểm ở biên.</span></div>
<div class="lz-node"><span class="lz-k">Chú thích cho tham số</span><span class="lz-t">Còn lại để nó tự suy</span><span class="lz-d">Kiểu của một tham số là quyết định chỉ bạn mới đưa ra được. <code>const n = 3</code> đã có kiểu rồi; viết thêm <code>: number</code> chẳng thêm được gì.</span></div>
<div class="lz-node"><span class="lz-k">Bật strict ngay ngày đầu</span><span class="lz-t">Nhất là strictNullChecks</span><span class="lz-d">Không có nó, trình biên dịch chẳng thấy nổi một phép tham chiếu null nào — lỗi lúc chạy phổ biến nhất của JavaScript ở lại vô hình.</span></div>
<div class="lz-node"><span class="lz-k">! và as là lời hứa</span><span class="lz-t">Không phải phép kiểm</span><span class="lz-d">Cả hai đều dập trình biên dịch mà chẳng đổi gì về dữ liệu. Nếu bạn không chống lưng nổi lời hứa đó thì hãy viết phép kiểm.</span></div>
</div>
<p class="note-ct"><strong>Chính những cái lỗi mới là sản phẩm.</strong> Khi TypeScript từ chối một thứ, phản xạ hữu ích là "nó biết gì mà mình không biết?" — chứ không phải "làm sao cho cái thông báo này biến mất". Gần như mọi vệt gạch đỏ bạn dập bằng <code>!</code> hay <code>any</code> đều là một cú sập bạn đã đồng ý gặp lại sau này.</p>
<div class="link-card"><a href="/code-lab/web-foundations-practice?bai=wf-9-0-slides&khoa=web-foundations">Luyện tập ở Code Lab → bộ đề Chương 9 (30 bài, máy chấm tự động)</a></div>
<div class="link-card"><a href="/code-lab/typescript">Học sâu hơn → track TypeScript đầy đủ</a></div></div>
${onTapBai('wf-9-6-quiz')}
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does TypeScript add on top of JavaScript?|||TypeScript thêm gì lên trên JavaScript?',
            options: [
              'Optional type annotations, checked at compile time|||Type annotation tuỳ chọn, được kiểm lúc biên dịch',
              'A completely different runtime, unrelated to JavaScript|||Một runtime hoàn toàn khác, không liên quan JavaScript',
              'Faster execution speed at runtime|||Tốc độ thực thi nhanh hơn lúc chạy',
              'A replacement for HTML and CSS|||Một thứ thay thế HTML và CSS',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What must happen before TypeScript code can run in a browser or Node.js?|||Điều gì phải xảy ra trước khi code TypeScript chạy được trên trình duyệt hay Node.js?',
            options: [
              'It must be compiled to plain JavaScript|||Nó phải được biên dịch thành JavaScript thuần',
              'Nothing — .ts files run directly everywhere|||Không gì cả — file .ts chạy trực tiếp mọi nơi',
              'It must be converted to Python first|||Nó phải được chuyển sang Python trước',
              'The browser installs a TypeScript plugin|||Trình duyệt cài một plugin TypeScript',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which annotation correctly types an array of numbers?|||Annotation nào gắn kiểu đúng cho một mảng số?',
            options: [
              'let scores: number[] = [1, 2, 3];|||let scores: number[] = [1, 2, 3];',
              'let scores: number = [1, 2, 3];|||let scores: number = [1, 2, 3];',
              'let scores: array<number> only;|||let scores: array<number> only;',
              'let scores: []number = [1, 2, 3];|||let scores: []number = [1, 2, 3];',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the union type string | number mean?|||Union type string | number nghĩa là gì?',
            options: [
              'The value can be either a string or a number|||Giá trị có thể là string hoặc là number',
              'The value must be both a string and a number at once|||Giá trị phải vừa là string vừa là number cùng lúc',
              'It converts numbers to strings automatically|||Nó tự động chuyển number thành string',
              'It is invalid TypeScript syntax|||Đây là cú pháp TypeScript không hợp lệ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why should the any type generally be avoided?|||Vì sao nên tránh dùng kiểu any nói chung?',
            options: [
              'It disables type checking for that value, losing autocomplete and early bug-catching|||Nó tắt kiểm kiểu cho giá trị đó, mất autocomplete và mất khả năng bắt lỗi sớm',
              'It makes the compiler run out of memory|||Nó khiến trình biên dịch hết bộ nhớ',
              'It is not valid TypeScript syntax|||Đây không phải cú pháp TypeScript hợp lệ',
              'It only works with numbers|||Nó chỉ hoạt động với number',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In an interface, what does a question mark after a property name (email?: string) mean?|||Trong một interface, dấu hỏi sau tên thuộc tính (email?: string) nghĩa là gì?',
            options: [
              'The property is optional — it may be missing|||Thuộc tính đó là tuỳ chọn — có thể vắng mặt',
              'The property is required and must never be empty|||Thuộc tính đó bắt buộc và không bao giờ được rỗng',
              'The property is a boolean|||Thuộc tính đó là một boolean',
              'The property must contain a question mark character|||Thuộc tính đó phải chứa ký tự dấu hỏi',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is an interface useful for describing API JSON responses (from Chapter 6)?|||Vì sao interface hữu ích để mô tả phản hồi JSON của API (từ Chương 6)?',
            options: [
              'It writes the expected shape once and TypeScript checks every place that uses it, catching typos like user.naem|||Nó viết hình dạng mong đợi một lần và TypeScript kiểm mọi nơi dùng nó, bắt được lỗi gõ như user.naem',
              'It automatically sends the HTTP request for you|||Nó tự động gửi yêu cầu HTTP giúp bạn',
              'It converts JSON into HTML|||Nó chuyển JSON thành HTML',
              'It replaces the need for a database entirely|||Nó thay thế hoàn toàn nhu cầu có cơ sở dữ liệu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In function greet(name: string): string { ... }, what does the second string specify?|||Trong function greet(name: string): string { ... }, string thứ hai chỉ định gì?',
            options: [
              'The return type of the function|||Kiểu trả về của hàm',
              'The type of a second parameter|||Kiểu của một tham số thứ hai',
              'The name of the function|||Tên của hàm',
              'A comment, ignored by the compiler|||Một chú thích, bị trình biên dịch bỏ qua',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'In function first<T>(items: T[]): T { return items[0]; }, what is T?|||Trong function first<T>(items: T[]): T { return items[0]; }, T là gì?',
            options: [
              'A generic placeholder for whichever type the function is used with|||Một chỗ trống generic cho bất kể kiểu nào hàm được dùng cùng',
              'A fixed type that always means number|||Một kiểu cố định luôn có nghĩa là number',
              'A built-in TypeScript keyword with no other meaning|||Một từ khoá dựng sẵn của TypeScript không có ý nghĩa khác',
              'A runtime variable that changes while the program runs|||Một biến lúc chạy thay đổi trong khi chương trình chạy',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does running npx tsc --noEmit do?|||Chạy npx tsc --noEmit làm gì?',
            options: [
              'Checks types and reports errors, without writing any compiled files|||Kiểm kiểu và báo lỗi, không ghi file biên dịch nào',
              'Deletes all .ts files in the project|||Xoá mọi file .ts trong dự án',
              'Starts the development server|||Khởi động server phát triển',
              'Deploys the project to production|||Deploy dự án lên production',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
