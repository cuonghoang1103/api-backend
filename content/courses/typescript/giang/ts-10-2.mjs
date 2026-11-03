/** Giảng theo slide — bài 10.2 Declaration files (.d.ts) (deck ts-10-2, 6 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-10-2', 'Declaration files (.d.ts)', 'File khai báo (.d.ts)', [
  [1, 'Declaration files (.d.ts)',
    `<p>A lot of JavaScript in the world has no types — an old package, a vendored script, a file your team never migrated. A declaration file, .d.ts, is how you give it types without touching the JavaScript: types on one side, the running code on the other. It is the same split you saw with import type, now across a whole module.</p>`,
    `<p>Rất nhiều JavaScript ngoài kia không có kiểu — một package cũ, một script vendor, một tệp nhóm bạn chưa chuyển. Một tệp khai báo, .d.ts, là cách bạn cho nó kiểu mà không chạm vào JavaScript: kiểu một bên, code chạy một bên. Đó là cùng phép tách bạn thấy với import type, giờ qua cả một module.</p>`],
  [2, 'The problem: an untyped import is unknown',
    `<p>Import a .js file with no declaration and tsc has nothing to go on — under strict it is TS7016, "could not find a declaration file", and the value would otherwise be any. A single untyped import turns off every check downstream of it. The .d.ts is how you close that hole.</p>`,
    `<p>Import một tệp .js không có khai báo và tsc không có gì để dựa — dưới strict đó là TS7016, "không tìm thấy tệp khai báo", và giá trị lẽ ra là any. Một import không kiểu tắt mọi phép kiểm phía sau nó. Tệp .d.ts là cách bạn bịt lỗ đó.</p>`],
  [3, 'Sidecar .d.ts for a relative file',
    `<p>Put a slug.d.ts next to slug.js and tsc reads the types from the .d.ts while Node runs the .js. The import is now fully typed — slugify takes a string, returns a string — and the real JavaScript runs unchanged. The declaration describes the shape; the .js provides the behaviour.</p>`,
    `<p>Đặt một slug.d.ts cạnh slug.js và tsc đọc kiểu từ .d.ts còn Node chạy .js. Import giờ có kiểu đầy đủ — slugify nhận một string, trả một string — và JavaScript thật chạy nguyên. Khai báo tả dáng; .js cung cấp hành vi.</p>`],
  [4, 'declare module: type a package by name',
    `<p>For a package you import by a bare name, declare module 'labflow-legacy' { … } gives it types by its import name. Without it, the bare import is TS2307, "cannot find module". The ambient declaration lives in a .d.ts anywhere in the project and the compiler finds it — one block, and an untyped dependency is usable.</p>`,
    `<p>Với một package bạn import bằng tên trần, declare module 'labflow-legacy' { … } cho nó kiểu theo tên import. Không có nó, import trần là TS2307, "không tìm thấy module". Khai báo ambient nằm trong một .d.ts ở bất kỳ đâu trong dự án và trình biên dịch tìm ra — một khối, và một dependency không kiểu dùng được.</p>`],
  [5, 'Three ways a package gets types',
    `<p>Bundled — the package ships its own .d.ts (the best case). From DefinitelyTyped — you install @types/the-package. Or you write them — a sidecar .d.ts or a declare module block you own. The first is automatic, the second is one install, the third is this chapter’s craft and Lab 10’s task.</p>`,
    `<p>Đóng gói sẵn — package giao .d.ts của chính nó (trường hợp tốt nhất). Từ DefinitelyTyped — bạn cài @types/the-package. Hoặc bạn tự viết — một sidecar .d.ts hay một khối declare module bạn sở hữu. Cái đầu tự động, cái hai một lệnh cài, cái ba là nghề của chương này và việc của Lab 10.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: a legacy.js helper imported with no declaration is TS7016 — add a legacy.d.ts beside it and the import is typed and runs. Next, 10.3: augmentation — adding a field to a type you do not own, like Request.user on Express, without forking the library.</p>`,
    `<p>Luyện tập: một helper legacy.js import mà không có khai báo là TS7016 — thêm một legacy.d.ts cạnh nó và import có kiểu và chạy. Tiếp, 10.3: bổ sung — thêm một trường vào một kiểu bạn không sở hữu, như Request.user trên Express, mà không fork thư viện.</p>`],
]);
