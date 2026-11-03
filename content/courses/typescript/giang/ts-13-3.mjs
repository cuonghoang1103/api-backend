/** Giảng theo slide — bài 13.3 Schema as the single source of truth (deck ts-13-3, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-13-3', 'Schema as the single source of truth', 'Schema là nguồn sự thật duy nhất', [
  [1, 'Schema as the single source of truth',
    `<p>Once a schema both validates and infers, you have a choice: write the type by hand as well, or derive it from the schema. Derive it. A hand-written copy is a second source of truth, and two sources drift — the schema gains a field, the type does not, and a bug slips through the gap. One definition, both jobs.</p>`,
    `<p>Một khi một schema vừa validate vừa suy kiểu, bạn có một lựa chọn: viết kiểu bằng tay nữa, hay suy nó từ schema. Hãy suy nó. Một bản chép tay là một nguồn sự thật thứ hai, và hai nguồn thì trôi — schema thêm một trường, kiểu thì không, và một bug lọt qua khe hở. Một định nghĩa, cả hai việc.</p>`],
  [2, 'Derive the type, do not copy it',
    `<p>Define the schema, then <code>type BookingInput = z.Infer&lt;typeof BookingInput&gt;</code>. The type is computed from the schema at compile time, so it is always exactly in step. Add a field to the schema and every function typed <code>BookingInput</code> updates for free; the compiler shows you each place that must now handle it.</p>`,
    `<p>Định nghĩa schema, rồi <code>type BookingInput = z.Infer&lt;typeof BookingInput&gt;</code>. Kiểu được tính từ schema lúc biên dịch, nên nó luôn khớp nhịp. Thêm một trường vào schema và mọi hàm kiểu <code>BookingInput</code> cập nhật miễn phí; trình biên dịch chỉ cho bạn từng chỗ giờ phải xử lý nó.</p>`],
  [3, 'A hand-written copy drifts',
    `<p>Write the type by hand with a <code>purpose</code> the schema never added, and assigning the parsed value to it is TS2741 — the parsed value (from the schema) has no <code>purpose</code>. The error is the drift made visible: the two definitions disagree, and the compiler catches it at the seam instead of a user hitting it later.</p>`,
    `<p>Viết kiểu bằng tay với một <code>purpose</code> mà schema không bao giờ thêm, và gán giá trị đã parse cho nó là TS2741 — giá trị đã parse (từ schema) không có <code>purpose</code>. Lỗi là sự trôi dạt được làm cho hiện ra: hai định nghĩa bất đồng, và trình biên dịch bắt nó ngay mối nối thay vì một người dùng gặp nó về sau.</p>`],
  [4, 'The same idea you met in Chapter 9',
    `<p>Chapter 9’s seed incident was a hand-copied enum union drifting from the generated one. This is the same lesson at the boundary: a type that is <em>computed from</em> a source of truth cannot drift; a type that <em>copies</em> one will. Zod’s <code>Infer</code>, Prisma’s generated types (13.4), and Chapter 7’s mapped types are all the computed kind.</p>`,
    `<p>Sự cố seed của Chương 9 là một union enum chép tay trôi khỏi bản sinh. Đây là cùng bài học ở biên: một kiểu được <em>tính từ</em> một nguồn sự thật không thể trôi; một kiểu <em>chép</em> một nguồn thì sẽ. <code>Infer</code> của Zod, kiểu sinh của Prisma (13.4), và mapped type của Chương 7 đều thuộc loại được-tính.</p>`],
  [5, 'At a glance',
    `<p><code>z.Infer&lt;typeof schema&gt;</code> computes the type from the schema — one source of truth, no copy to maintain. A hand-written duplicate that drifts is TS2741/TS2339 at the seam. Prefer derived types everywhere a tool already owns the shape: Zod schemas, Prisma models, API contracts.</p>`,
    `<p><code>z.Infer&lt;typeof schema&gt;</code> tính kiểu từ schema — một nguồn sự thật, không bản sao phải bảo trì. Một bản chép tay trôi dạt là TS2741/TS2339 ở mối nối. Ưu tiên kiểu suy ra ở mọi nơi một công cụ đã sở hữu dáng: schema Zod, model Prisma, hợp đồng API.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a hand-written type claims a <code>name</code> the schema never had — TS2741; replace it with <code>z.Infer&lt;typeof UserInput&gt;</code> and it runs. Next, 13.4: Prisma generates the types for your database models, the server-side twin of Zod at the boundary.</p>`,
    `<p>Luyện tập: một kiểu viết tay đòi một <code>name</code> mà schema không bao giờ có — TS2741; thay nó bằng <code>z.Infer&lt;typeof UserInput&gt;</code> và nó chạy. Tiếp, 13.4: Prisma sinh kiểu cho các model CSDL của bạn, người anh em phía máy chủ của Zod ở biên.</p>`],
]);
