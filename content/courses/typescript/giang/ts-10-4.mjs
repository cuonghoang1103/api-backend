/** Giảng theo slide — bài 10.4 Getting types from packages (deck ts-10-4, 6 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-10-4', 'Getting types from packages', 'Lấy kiểu từ package', [
  [1, 'Getting types from packages',
    `<p>Most of the types you use you did not write — they come with the packages you install. This lesson is how that works: how a package carries types, how TypeScript finds them, and what to do when a package has none. It is the consumer side of everything 10.2 and 10.3 taught you to produce.</p>`,
    `<p>Phần lớn kiểu bạn dùng không do bạn viết — chúng đi cùng các package bạn cài. Bài này là cách đó chạy: một package mang kiểu thế nào, TypeScript tìm chúng ra sao, và làm gì khi một package không có. Đó là phía người dùng của mọi thứ 10.2 và 10.3 đã dạy bạn tạo ra.</p>`],
  [2, 'Bundled types: node:path',
    `<p>node:path ships its types through @types/node, so join is fully typed with no setup: it takes strings and returns a string, and the call runs. This is the common case — you import, and the types are already there. You only notice the machinery when it is missing.</p>`,
    `<p>node:path giao kiểu qua @types/node, nên join có kiểu đầy đủ mà không cần cài gì: nó nhận các string và trả một string, và lời gọi chạy. Đây là trường hợp thường — bạn import, và kiểu đã ở đó. Bạn chỉ để ý bộ máy khi nó thiếu.</p>`],
  [3, 'The types are real — a wrong call is caught',
    `<p>Because join is typed, passing a number where it wants a string is TS2345. The types that came with the package are not decoration; they are the same checks you would get from code you wrote yourself. A typed dependency protects your call sites exactly like a typed function in your own module.</p>`,
    `<p>Vì join có kiểu, đưa một number vào chỗ nó muốn một string là TS2345. Kiểu đi cùng package không phải trang trí; chúng là cùng phép kiểm bạn có từ code bạn tự viết. Một dependency có kiểu bảo vệ các chỗ gọi của bạn đúng như một hàm có kiểu trong module của chính bạn.</p>`],
  [4, 'How TypeScript finds a package’s types',
    `<p>When you import a package, TypeScript looks for a "types" (or "typings") field in its package.json and reads the .d.ts it points at. A local labflow-ids package with a types field pointing at index.d.ts is fully typed from the import. If there is no types field, TypeScript looks for an @types package next.</p>`,
    `<p>Khi bạn import một package, TypeScript tìm một trường "types" (hay "typings") trong package.json của nó và đọc .d.ts nó trỏ tới. Một package labflow-ids cục bộ với một trường types trỏ vào index.d.ts có kiểu đầy đủ từ import. Nếu không có trường types, TypeScript tìm một package @types tiếp theo.</p>`],
  [5, 'Bundled, @types, or your own',
    `<p>Three outcomes when you import a package: it bundles its own .d.ts (nothing to do), DefinitelyTyped has an @types/ package (npm i -D @types/x), or it has neither (you write a declare module, as in 10.2). Knowing which case you are in tells you whether to install, to write, or to just use.</p>`,
    `<p>Ba kết cục khi bạn import một package: nó đóng gói .d.ts của chính nó (không phải làm gì), DefinitelyTyped có một package @types/ (npm i -D @types/x), hoặc nó không có cả hai (bạn viết một declare module, như 10.2). Biết mình ở trường hợp nào cho bạn biết nên cài, nên viết, hay cứ dùng.</p>`],
  [6, 'Practice &amp; Lab 10',
    `<p>Practice: a call to path.join with a number is TS2345 — pass a string and it runs. Next is Lab 10: a real untyped JavaScript module, labflow-slug.js, ships with no types; you write the labflow-slug.d.ts that types all four exports, until every wrong call is refused. The any stub scores 6, the correct declaration 10.</p>`,
    `<p>Luyện tập: một lời gọi path.join với một number là TS2345 — đưa một string và nó chạy. Tiếp là Lab 10: một module JavaScript không kiểu thật, labflow-slug.js, giao mà không có kiểu; bạn viết labflow-slug.d.ts gõ kiểu cả bốn export, tới khi mọi lời gọi sai bị từ chối. Bản stub any được 6, khai báo đúng 10.</p>`],
]);
