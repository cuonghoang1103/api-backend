/** Giảng theo slide — bài 10.3 Global & module augmentation (deck ts-10-3, 6 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-10-3', 'Global &amp; module augmentation', 'Bổ sung toàn cục &amp; bổ sung module', [
  [1, 'Global &amp; module augmentation',
    `<p>Sometimes you need to add a field to a type you do not own — a known env var on process.env, a user on an Express Request. Augmentation lets you extend an existing interface from your own file, without editing the library. It works because TypeScript merges two declarations of the same interface into one.</p>`,
    `<p>Đôi khi bạn cần thêm một trường vào một kiểu bạn không sở hữu — một env var đã biết trên process.env, một user trên Express Request. Bổ sung cho bạn mở rộng một interface có sẵn từ tệp của chính bạn, mà không sửa thư viện. Nó chạy được vì TypeScript gộp hai khai báo của cùng một interface thành một.</p>`],
  [2, 'Declaration merging: the mechanism',
    `<p>Two interfaces with the same name in the same scope merge into one with all the fields. A Lab declared twice — once with code, once with seats — is a single Lab that must have both. This merging is the engine under every augmentation: you are adding a second declaration that joins the first.</p>`,
    `<p>Hai interface cùng tên trong cùng phạm vi gộp thành một với tất cả các trường. Một Lab khai hai lần — một với code, một với seats — là một Lab duy nhất phải có cả hai. Phép gộp này là động cơ dưới mọi bổ sung: bạn đang thêm một khai báo thứ hai nối vào cái đầu.</p>`],
  [3, 'declare global: extend a global type',
    `<p>Wrap the merge in declare global and you extend a global interface from a module. Declaring NodeJS.ProcessEnv with a LABFLOW_PORT: string makes process.env.LABFLOW_PORT a string everywhere — not string | undefined. You have told the compiler a fact about the environment that it could not infer.</p>`,
    `<p>Bọc phép gộp trong declare global và bạn mở rộng một interface toàn cục từ một module. Khai NodeJS.ProcessEnv với một LABFLOW_PORT: string làm process.env.LABFLOW_PORT thành một string ở mọi nơi — không phải string | undefined. Bạn đã nói với trình biên dịch một sự thật về môi trường mà nó không suy được.</p>`],
  [4, 'Without the augmentation',
    `<p>Remove the declaration and process.env.LABFLOW_PORT is string | undefined again — assigning it to a string is TS2322. That contrast is the whole point: augmentation is how you record a guarantee the types cannot know on their own, like "this env var is always set" or "every request has a user".</p>`,
    `<p>Bỏ khai báo và process.env.LABFLOW_PORT lại là string | undefined — gán nó vào một string là TS2322. Tương phản đó chính là mấu chốt: bổ sung là cách bạn ghi lại một bảo đảm mà kiểu không tự biết, như "env var này luôn được đặt" hay "mọi request đều có một user".</p>`],
  [5, 'Augmentation: the rules that make it work',
    `<p>Match the name and the kind (an interface augments an interface). Put it in a module (a file with an import or export) so declare global is needed to reach the global scope. Keep it type-only — augmentation adds declarations, never runtime code. These three rules are why the Request.user pattern is one small file, not a fork.</p>`,
    `<p>Khớp tên và loại (một interface bổ sung một interface). Đặt nó trong một module (một tệp có import hay export) nên cần declare global để với tới phạm vi toàn cục. Giữ nó chỉ-kiểu — bổ sung thêm khai báo, không bao giờ code lúc chạy. Ba luật này là vì sao mẫu Request.user là một tệp nhỏ, không phải một fork.</p>`],
  [6, 'Practice &amp; what is next',
    `<p>Practice: process.env.DATABASE_URL is string | undefined, so returning it as a string is TS2322 — add a declare global that declares DATABASE_URL: string and it compiles. Next, 10.4: how a package ships its types in the first place — bundled, from @types, and how TypeScript finds them.</p>`,
    `<p>Luyện tập: process.env.DATABASE_URL là string | undefined, nên trả nó như một string là TS2322 — thêm một declare global khai DATABASE_URL: string và nó biên dịch. Tiếp, 10.4: một package giao kiểu của nó thế nào ngay từ đầu — đóng gói sẵn, từ @types, và TypeScript tìm chúng ra sao.</p>`],
]);
