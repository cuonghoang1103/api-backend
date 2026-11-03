/** Giảng theo slide — bài 10.1 ES modules & the type boundary (deck ts-10-1, 6 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-10-1', 'ES modules &amp; the type boundary', 'ES module &amp; biên giới kiểu', [
  [1, 'ES modules &amp; the type boundary',
    `<p>The last chapters typed code inside one project; the next few move types across boundaries — between files, packages and runtimes. It starts with the module system: how a value and a type leave one file and enter another. The key idea is that types and values travel the same import, but only values exist at run time.</p>`,
    `<p>Các chương trước gõ kiểu bên trong một dự án; vài chương tới đưa kiểu qua các biên giới — giữa tệp, package và môi trường chạy. Bắt đầu từ hệ module: một giá trị và một kiểu rời một tệp và vào một tệp khác ra sao. Ý chính: kiểu và giá trị đi cùng một import, nhưng chỉ giá trị tồn tại lúc chạy.</p>`],
  [2, 'What you will take away from this chapter',
    `<p>By the end you can bring types across every boundary: import type and the module boundary (this lesson), write a .d.ts for an untyped JavaScript package (10.2), augment a global or a library type like Request.user (10.3), and know how a package ships its types (10.4). Lab 10: write the declaration file for a real JS module until it refuses every wrong call.</p>`,
    `<p>Cuối chương bạn đưa được kiểu qua mọi biên giới: import type và biên giới module (bài này), viết một .d.ts cho một package JavaScript không kiểu (10.2), bổ sung một kiểu toàn cục hay kiểu thư viện như Request.user (10.3), và biết một package giao kiểu ra sao (10.4). Lab 10: viết tệp khai báo cho một module JS thật tới khi nó từ chối mọi lời gọi sai.</p>`],
  [3, 'Exporting: named, default, and types',
    `<p>One module exports a named function, a default function and a type. The consumer imports the default and the named value together, and the type separately. The type is for the compiler only — it is erased before the code runs, which is why it crosses the boundary differently from a value.</p>`,
    `<p>Một module export một hàm named, một hàm default và một kiểu. Bên dùng import default và giá trị named cùng nhau, và kiểu riêng. Kiểu chỉ cho trình biên dịch — nó bị xoá trước khi code chạy, vì thế nó qua biên giới khác với một giá trị.</p>`],
  [4, 'Importing — and import type',
    `<p>Under verbatimModuleSyntax (the course config), importing a type as if it were a value is TS1484. import type says "this is a type, erase the whole import" — so the compiler never emits an import that does not exist at run time. It is the explicit boundary between what the type-checker sees and what Node runs.</p>`,
    `<p>Dưới verbatimModuleSyntax (config của khoá), import một kiểu như thể nó là một giá trị là TS1484. import type nói "đây là một kiểu, xoá cả import" — nên trình biên dịch không bao giờ sinh một import không tồn tại lúc chạy. Đó là biên giới tường minh giữa thứ bộ kiểm thấy và thứ Node chạy.</p>`],
  [5, 'The module boundary, at a glance',
    `<p>A named export is imported by name; a default export by any name; a type by import type. Values and types share the import syntax but live in different worlds — values at run time, types only at compile time. Getting this boundary right is what lets types travel safely into the declaration files, augmentations and packages of the rest of the chapter.</p>`,
    `<p>Một named export import theo tên; một default export theo tên bất kỳ; một kiểu bằng import type. Giá trị và kiểu dùng chung cú pháp import nhưng sống ở hai thế giới khác nhau — giá trị lúc chạy, kiểu chỉ lúc biên dịch. Làm đúng biên giới này là thứ cho kiểu đi an toàn vào các tệp khai báo, bổ sung và package của phần còn lại của chương.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: a Role type imported as a value is TS1484 — change it to import type and it compiles and runs. Next, 10.2: declaration files — how you give types to a JavaScript package that has none, so an untyped import stops being any.</p>`,
    `<p>Luyện tập: một kiểu Role import như một giá trị là TS1484 — đổi thành import type và nó biên dịch và chạy. Tiếp, 10.2: tệp khai báo — cách bạn cho kiểu một package JavaScript không có kiểu, để một import không kiểu thôi là any.</p>`],
]);
