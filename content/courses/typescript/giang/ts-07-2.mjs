/** Giảng theo slide — bài 7.2 Modifier ánh xạ (deck ts-07-2, 7 slide). */
import { walkTs } from '../_slides.mjs';

export default walkTs('ts-07-2', 'Mapping modifiers: add &amp; remove ? and readonly', 'Modifier ánh xạ: thêm &amp; gỡ ? và readonly', [
  [1, 'Mapping modifiers: add &amp; remove ? and readonly',
    `<p>A mapped type does more than copy a field’s type — it can change the two modifiers every property carries: ? (optional) and readonly. Add ? and you have a PATCH body; remove it and every field is required; remove readonly and a frozen type becomes a draft. These are Partial, Required, Readonly and a hand-written Mutable.</p>`,
    `<p>Một mapped type làm hơn việc chép kiểu của một trường — nó đổi được hai modifier mà mọi thuộc tính mang: ? (optional) và readonly. Thêm ? là có một PATCH body; gỡ nó thì mọi trường bắt buộc; gỡ readonly thì một kiểu đóng băng thành một bản nháp. Đây là Partial, Required, Readonly và một Mutable viết tay.</p>`],
  [2, 'Add ?: Partial<T> — a PATCH body',
    `<p>{ [K in keyof T]?: T[K] } adds the optional modifier to every field, so a Patch of Booking may carry any subset — exactly what an HTTP PATCH needs. This is the built-in Partial<T>. The call applyPatch(b, { seats: 30 }) compiles because every other field may be omitted.</p>`,
    `<p>{ [K in keyof T]?: T[K] } thêm modifier optional cho mọi trường, nên một Patch của Booking mang bất kỳ tập con nào — đúng thứ một HTTP PATCH cần. Đây là Partial<T> dựng sẵn. Lời gọi applyPatch(b, { seats: 30 }) biên dịch vì mọi trường khác được phép bỏ.</p>`],
  [3, 'Remove ?: Required<T>',
    `<p>-? removes the optional modifier: Complete of Draft makes body and tags required, so a value with only title is TS2739. The plain Draft accepted it; the mapped version does not. This is Required<T> — useful when a fully filled version of a draft must have everything.</p>`,
    `<p>-? gỡ modifier optional: Complete của Draft làm body và tags bắt buộc, nên một giá trị chỉ có title là TS2739. Draft trơn nhận nó; bản ánh xạ thì không. Đây là Required<T> — có ích khi một bản đã điền đủ của một draft phải có mọi thứ.</p>`],
  [4, 'Remove readonly: a mutable copy',
    `<p>-readonly strips the read-only modifier: a Mutable of Lab can be reassigned where the original Lab could not. There is no built-in Mutable, but it is one line — handy for a builder that assembles an object before freezing it.</p>`,
    `<p>-readonly bóc modifier chỉ đọc: một Mutable của Lab gán lại được ở chỗ Lab gốc không thể. Không có Mutable dựng sẵn, nhưng nó chỉ một dòng — tiện cho một builder lắp một object trước khi đóng băng.</p>`],
  [5, 'Both at once',
    `<p>Modifiers combine: { readonly [K in keyof T]?: T[K] } makes every field both read-only and optional — a read-only patch of a snapshot. For symmetry, +? and +readonly mean "add", the default; you only write the + to be explicit.</p>`,
    `<p>Modifier ghép được: { readonly [K in keyof T]?: T[K] } làm mọi trường vừa chỉ đọc vừa optional — một patch chỉ-đọc của một ảnh chụp. Để đối xứng, +? và +readonly nghĩa là "thêm", mặc định; bạn chỉ viết + để cho rõ.</p>`],
  [6, 'Which modifier, when',
    `<p>Add ? for a PATCH body (Partial); remove it for a complete version (Required); add readonly for a snapshot (Readonly); remove it for a mutable copy. In LabFlow: Patch<BookingRecord> is an update body, Readonly<BookingRecord> a stored snapshot.</p>`,
    `<p>Thêm ? cho một PATCH body (Partial); gỡ nó cho một bản đầy đủ (Required); thêm readonly cho một ảnh chụp (Readonly); gỡ nó cho một bản sao sửa được. Trong LabFlow: Patch<BookingRecord> là một body cập nhật, Readonly<BookingRecord> một ảnh chụp đã lưu.</p>`],
  [7, 'Practice &amp; what is next',
    `<p>Practice: updateUser demands all three fields (TS2739) — change the changes parameter to a mapped Patch<User> so any subset is accepted. Next, 7.3: a conditional type chooses a type based on a condition, and infer pulls a type out of another — the element of an array, the return of a function.</p>`,
    `<p>Luyện tập: updateUser đòi cả ba trường (TS2739) — đổi tham số changes thành một mapped Patch<User> để tập con nào cũng nhận. Tiếp, 7.3: một conditional type chọn một kiểu theo điều kiện, và infer rút một kiểu ra khỏi kiểu khác — phần tử của mảng, kiểu trả về của hàm.</p>`],
]);
