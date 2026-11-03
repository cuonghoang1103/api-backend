/** Giảng theo slide — bài 16.3 Organizing types (deck ts-16-3, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-16-3', 'Organizing types', 'Tổ chức kiểu', [
  [1, 'Organizing types',
    `<p>As a codebase grows, where types live matters as much as what they say. Two questions come up again and again: <code>type</code> or <code>interface</code>? And where should a shared type sit so everyone imports the same one? A few conventions keep a large project’s types tidy and its imports honest.</p>`,
    `<p>Khi một codebase lớn dần, kiểu sống ở đâu quan trọng ngang với nó nói gì. Hai câu hỏi lặp lại mãi: <code>type</code> hay <code>interface</code>? Và một kiểu dùng chung nên nằm đâu để mọi người import cùng một cái? Vài quy ước giữ kiểu của một dự án lớn gọn gàng và import của nó trung thực.</p>`],
  [2, 'type vs interface: redeclaration',
    `<p>A <code>type</code> alias is a single definition — declare <code>type User</code> twice and it is TS2300, a duplicate identifier. That is usually what you want: one name, one shape. Use <code>type</code> for unions, tuples, mapped and conditional types — everything that is not just an object shape.</p>`,
    `<p>Một <code>type</code> alias là một định nghĩa duy nhất — khai <code>type User</code> hai lần và nó là TS2300, một định danh trùng. Đó thường là thứ bạn muốn: một tên, một dáng. Dùng <code>type</code> cho union, tuple, mapped và conditional type — mọi thứ không chỉ là một dáng object.</p>`],
  [3, 'interface: declaration merging',
    `<p>Two interfaces of the same name <em>merge</em> into one. It looks like a footgun, but it is the mechanism behind augmentation (Chapter 10’s <code>Request.user</code>): a library declares <code>interface Request</code>, and you add fields to it from your own file without touching its source. Use <code>interface</code> for object shapes you might extend or augment.</p>`,
    `<p>Hai interface cùng tên <em>gộp</em> thành một. Nó trông như một cái bẫy, nhưng là cơ chế đằng sau augmentation (<code>Request.user</code> của Chương 10): một thư viện khai <code>interface Request</code>, và bạn thêm trường vào nó từ tệp của mình mà không đụng source nó. Dùng <code>interface</code> cho dáng object bạn có thể mở rộng hay augment.</p>`],
  [4, 'Where types live',
    `<p>A shared type belongs next to the thing it describes — the model’s type beside the model, a DTO beside its route. Re-export the public ones through a barrel (<code>export type</code> from 15.3) so every consumer imports the same name from one place. A type imported from two files is two types that will drift; one source, one import.</p>`,
    `<p>Một kiểu dùng chung thuộc về cạnh thứ nó mô tả — kiểu của model cạnh model, một DTO cạnh route của nó. Re-export các cái công khai qua một barrel (<code>export type</code> của 15.3) để mọi bên tiêu thụ import cùng một tên từ một chỗ. Một kiểu import từ hai tệp là hai kiểu sẽ trôi; một nguồn, một import.</p>`],
  [5, 'At a glance',
    `<p><code>type</code> is a single definition (redeclaring is TS2300) — use it for unions, tuples, mapped/conditional types. <code>interface</code> merges on redeclaration — use it for object shapes you may extend or augment. Keep a type next to what it describes, and re-export the public ones through one barrel so no two files own the same shape.</p>`,
    `<p><code>type</code> là một định nghĩa duy nhất (khai lại là TS2300) — dùng cho union, tuple, mapped/conditional. <code>interface</code> gộp khi khai lại — dùng cho dáng object bạn có thể mở rộng hay augment. Giữ một kiểu cạnh thứ nó mô tả, và re-export các cái công khai qua một barrel để không hai tệp nào sở hữu cùng một dáng.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a <code>type Lab</code> is declared twice — TS2300; merge the two shapes into one definition and it runs. Next, 16.4: the whole picture — how every chapter’s habit fits into one type-driven codebase, and where to go after this course.</p>`,
    `<p>Luyện tập: một <code>type Lab</code> được khai hai lần — TS2300; gộp hai dáng thành một định nghĩa và nó chạy. Tiếp, 16.4: bức tranh toàn cảnh — thói quen của mọi chương khớp vào một codebase type-driven ra sao, và đi đâu sau khoá này.</p>`],
]);
