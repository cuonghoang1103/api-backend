/** Giảng theo slide — bài 12.1 Components & props (deck ts-12-1, 6 slide). */
import { walkTs } from '../_slides.mjs';
export default walkTs('ts-12-1', 'Components & props', 'Component & props', [
  [1, 'Components & props',
    `<p>Chapter 11 typed a backend; now the same types cross to the frontend. A React component is a function of one argument — its props — that returns an element. We use a tiny typed model of React’s surface (FC, an element, a few hooks), the same shapes @types/react gives you, so every example runs with tsc and Node.</p>`,
    `<p>Chương 11 gõ kiểu một backend; giờ cùng các kiểu đó đi sang frontend. Một component React là một hàm của một đối số — props của nó — trả về một element. Ta dùng một mô hình kiểu nhỏ của bề mặt React (FC, một element, vài hook), đúng dáng mà @types/react cho bạn, để mọi ví dụ chạy với tsc và Node.</p>`],
  [2, 'What you will take away from this chapter',
    `<p>By the end you type a UI end to end: a component with typed props (this lesson), hooks whose setter is checked and whose nullable state forces a loading branch (12.2), DOM events where e.target.value is a typed string (12.3), and a typed context plus a generic component (12.4). Lab 12: a typed BookingForm — a component and a hook — for LabFlow.</p>`,
    `<p>Cuối chương bạn gõ kiểu một UI từ đầu đến cuối: một component với props có kiểu (bài này), hook có setter được kiểm và state nullable buộc một nhánh loading (12.2), sự kiện DOM nơi e.target.value là một string có kiểu (12.3), và một context có kiểu cộng một component generic (12.4). Lab 12: một BookingForm có kiểu — một component và một hook — cho LabFlow.</p>`],
  [3, 'A component is a function of typed props',
    `<p>FC&lt;Props&gt; is a function taking one props object and returning an element. Declare the props type and destructure it; props.code and props.seats are typed exactly as you wrote them. The component documents its own API, and TypeScript checks every reader of props against that one type.</p>`,
    `<p>FC&lt;Props&gt; là một hàm nhận một object props và trả về một element. Khai kiểu props và giải cấu trúc nó; props.code và props.seats có kiểu đúng như bạn viết. Component tự ghi API của nó, và TypeScript kiểm mọi chỗ đọc props với đúng cái kiểu đó.</p>`],
  [4, 'The typed component refuses a wrong or missing prop',
    `<p>Read a prop that was not declared — props.name when the type has only code and seats — and it is TS2339. Call the component without a required prop and it is TS2741. The props type is a contract at every call site: a typo or a forgotten field is a compile error, not a blank spot at runtime.</p>`,
    `<p>Đọc một prop không được khai — props.name khi kiểu chỉ có code và seats — và nó là TS2339. Gọi component mà thiếu một prop bắt buộc và nó là TS2741. Kiểu props là một hợp đồng tại mọi chỗ gọi: một lỗi gõ hay một trường bị quên là một lỗi biên dịch, không phải một khoảng trống lúc chạy.</p>`],
  [5, 'A component, at a glance — and the React.FC trap',
    `<p>FC&lt;Props&gt; is a function of its props; children, when a component renders them, is just another prop typed ReactNode (anything renderable). A warning from the real types: React.FC used to add children implicitly, so text passed to a component that ignores it vanished with no error. Declare the props type directly and add children only when you render it.</p>`,
    `<p>FC&lt;Props&gt; là một hàm của props của nó; children, khi một component vẽ chúng, chỉ là một prop khác kiểu ReactNode (bất cứ thứ gì render được). Một lời cảnh báo từ kiểu thật: React.FC từng thêm children một cách ngầm định, nên chữ truyền vào một component bỏ qua nó biến mất không một lỗi nào. Hãy khai kiểu props trực tiếp và chỉ thêm children khi bạn vẽ nó.</p>`],
  [6, 'Practice & what is next',
    `<p>Practice: a Button reads props.text when the type declares only label — TS2339; read props.label and it runs. Next, 12.2: hooks — useState infers the state and types the setter, and a nullable state forces you to handle "not loaded yet".</p>`,
    `<p>Luyện tập: một Button đọc props.text khi kiểu chỉ khai label — TS2339; đọc props.label và nó chạy. Tiếp, 12.2: hook — useState suy ra state và gõ kiểu setter, và một state nullable buộc bạn xử lý "chưa tải xong".</p>`],
]);
