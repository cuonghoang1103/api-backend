/**
 * FER202 · 7.3 — Slide check: Props, State & Context (Slot 8). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-7-3-slot8-props-context-slides',
  ten: '7.3 Slide check — Props, State & Context',
  khoa: KHOA,
  baiHoc: 'fer202-7-3-slot8-props-context-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: props patterns and Context',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['Context', 'Provider', 'useContext', 'render props', 'HOC'], the: ['context', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 8 and Chapter 7: when to use Context, how Providers resolve, and the reuse patterns (children, render props, HOC).</p>',
        vi: '<p>Mười câu về Slot 8 và Chương 7: khi nào dùng Context, Provider được tìm thế nào, và các mẫu tái sử dụng (children, render props, HOC).</p>',
      },
      goiY: ['useContext tìm Provider GẦN NHẤT phía trên.', 'Context không thay thế mọi props — chỉ dữ liệu "toàn cục".'],
      loiHayGap: ['Dùng Context cho mọi thứ ⇒ khó lần theo dữ liệu, vẽ lại thừa.', 'Đặt Provider bên dưới component cần đọc.'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'consumer', vi: 'nơi đọc context' }],
      cauHoi: [
        q('q1', 'Prop drilling is…', [['a', 'passing props through components that do not use them'], ['b', 'a security bug'], ['c', 'mutating props'], ['d', 'a React API']], ['a'], 'Context avoids it for data needed deep in the tree.|||Context tránh được nó với dữ liệu cần ở tầng sâu.'),
        q('q2', 'Create a context:', [['a', '<code>React.createContext(defaultValue)</code>'], ['b', '<code>new Context()</code>'], ['c', '<code>useContext.create()</code>'], ['d', '<code>React.context()</code>']], ['a'], 'Returns an object with Provider (and Consumer).|||Trả về object có Provider (và Consumer).'),
        q('q3', 'When is the default value of a context used?', [['a', 'Always'], ['b', 'Only when no matching Provider is above the component'], ['c', 'When the Provider value is undefined'], ['d', 'Never']], ['b'], 'A Provider with value={undefined} still wins.|||Provider có value={undefined} vẫn được ưu tiên.'),
        q('q4', 'Two Providers of the same context are nested. A deep consumer gets…', [['a', 'the outer value'], ['b', 'the nearest (inner) value'], ['c', 'both merged'], ['d', 'an error']], ['b'], 'The closest Provider wins.|||Provider gần nhất thắng.'),
        q('q5', 'What re-renders when a Provider\'s value changes?', [['a', 'Nothing'], ['b', 'Every component that uses that context'], ['c', 'Only the Provider'], ['d', 'The whole page reloads']], ['b'], 'That is why the value should be memoised and contexts kept focused.|||Vì vậy nên memo value và giữ context gọn.'),
        q('q6', 'Good candidates for Context? (choose all)', [['a', 'Theme'], ['b', 'Current user'], ['c', 'The text of one input'], ['d', 'Language']], [['a', 'b', 'd']], 'Local form state belongs in the component.|||State cục bộ của ô nhập thuộc về component.', true),
        q('q7', 'A render prop is…', [['a', 'a prop whose value is a function returning JSX'], ['b', 'a prop named render only'], ['c', 'a CSS property'], ['d', 'a lifecycle method']], ['a'], 'The name is free; children can also be that function.|||Tên tuỳ ý; children cũng có thể là hàm đó.'),
        q('q8', 'A higher-order component…', [['a', 'is a component with many children'], ['b', 'takes a component and returns a new component'], ['c', 'is a class component only'], ['d', 'is rendered first']], ['b'], 'e.g. connect() of react-redux.|||vd connect() của react-redux.'),
        q('q9', 'A container component typically…', [['a', 'only renders markup'], ['b', 'handles data/logic and passes it to presentational components'], ['c', 'is a CSS container'], ['d', 'cannot have state']], ['b'], 'Container vs presentational split separates logic from UI.|||Tách container và presentational để tách logic khỏi giao diện.'),
        q('q10', 'Modern replacement for many HOCs and render props?', [['a', 'Mixins'], ['b', 'Custom hooks'], ['c', 'jQuery plugins'], ['d', 'Global variables']], ['b'], 'Custom hooks share logic without extra wrapper components.|||Custom hook chia sẻ logic mà không thêm component bọc.'),
      ],
    }),
  ],
});
