/**
 * FER202 · 5.3 — Slide check: All about Components (Slot 6) + 5.6 — PropTypes (Slot 13). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-5-3-slot6-component-slides',
  ten: '5.3 Slide check — All about Components',
  khoa: KHOA,
  baiHoc: 'fer202-5-3-slot6-component-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: components, props and state',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['components', 'props', 'state', 'class vs function'], the: ['components', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 6: what components are, props vs state, class vs function components and their lifecycle.</p>',
        vi: '<p>Mười câu về Slot 6: component là gì, props và state, class và function component cùng vòng đời.</p>',
      },
      goiY: ['Props: cha đưa xuống, con chỉ đọc. State: dữ liệu riêng của component, đổi qua hàm đặt.', 'Class: this.state + this.setState; function: useState.'],
      loiHayGap: ['Nghĩ con được sửa props.', 'Nhầm setState của class (trộn) với useState (thay thế).'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'lifecycle', vi: 'vòng đời (mount, update, unmount)' }, { en: 'immutable props', vi: 'props không đổi được từ bên trong' }],
      cauHoi: [
        q('q1', 'A React component name must…', [['a', 'be all lower-case'], ['b', 'start with a capital letter'], ['c', 'end with "Component"'], ['d', 'be unique in the whole app']], ['b'], 'Lower-case JSX tags are treated as HTML elements.|||Thẻ JSX viết thường bị coi là thẻ HTML.'),
        q('q2', 'Inside a child component, props are…', [['a', 'read-only'], ['b', 'writable but not recommended'], ['c', 'copied into state automatically'], ['d', 'global variables']], ['a'], 'A component must never modify its own props — ask the parent through a callback.|||Component không được sửa props của chính nó — nhờ cha qua callback.'),
        q('q3', 'Which is TRUE about state?', [['a', 'It is passed from the parent.'], ['b', 'Changing it with its setter re-renders the component.'], ['c', 'It is shared by all instances.'], ['d', 'It can only hold numbers.']], ['b'], 'State is local to each instance; setting it schedules a re-render.|||State riêng cho từng instance; gọi hàm đặt sẽ lên lịch vẽ lại.'),
        q('q4', 'In a class component, state is updated with…', [['a', '<code>this.state.x = 1</code>'], ['b', '<code>this.setState({ x: 1 })</code>'], ['c', '<code>setState(1)</code>'], ['d', '<code>this.update()</code>']], ['b'], '<code>this.setState</code> merges the change and re-renders.|||this.setState trộn thay đổi và vẽ lại.'),
        q('q5', 'Which class method runs once after the component appears on screen?', [['a', '<code>render</code>'], ['b', '<code>componentDidMount</code>'], ['c', '<code>componentWillUnmount</code>'], ['d', '<code>constructor</code> after render']], ['b'], 'componentDidMount ≈ <code>useEffect(fn, [])</code> in function components.|||componentDidMount ≈ useEffect(fn, []) ở function component.'),
        q('q6', 'Which are advantages of function components with hooks? (choose all)', [['a', 'Less boilerplate (no <code>this</code>, no binding)'], ['b', 'Logic can be reused with custom hooks'], ['c', 'They are the only way to use state'], ['d', 'Recommended style for new React code']], [['a', 'b', 'd']], 'Class components still have state; hooks are just simpler and reusable.|||Class vẫn có state; hooks chỉ gọn và dễ tái sử dụng hơn.', true),
        q('q7', '<code>props.children</code> contains…', [['a', 'the child components\' state'], ['b', 'whatever is written between the opening and closing tags'], ['c', 'an array of DOM nodes'], ['d', 'only text']], ['b'], 'Anything nested inside <code>&lt;Comp&gt;…&lt;/Comp&gt;</code>: text, elements, components.|||Mọi thứ lồng trong <Comp>…</Comp>: chữ, phần tử, component.'),
        q('q8', 'Lifting state up means…', [['a', 'moving state to the closest common parent of the components that need it'], ['b', 'using global variables'], ['c', 'putting state in localStorage'], ['d', 'moving state into the deepest child']], ['a'], 'The common parent owns the data and passes it down with callbacks to change it.|||Cha chung giữ dữ liệu, truyền xuống kèm callback để thay đổi.'),
        q('q9', 'After <code>const [n, setN] = useState(0)</code>, which correctly increments?', [['a', '<code>n++</code>'], ['b', '<code>setN(n + 1)</code> or <code>setN((c) =&gt; c + 1)</code>'], ['c', '<code>useState(n + 1)</code>'], ['d', '<code>this.setN(n + 1)</code>']], ['b'], 'Always go through the setter; the updater form is safest when chaining.|||Luôn qua hàm đặt; dạng hàm cập nhật an toàn nhất khi gọi liên tiếp.'),
        q('q10', 'A pure component (in the React sense)…', [['a', 'renders the same output for the same props and state'], ['b', 'never re-renders'], ['c', 'has no props'], ['d', 'uses only CSS']], ['a'], 'Rendering must not have side effects — same inputs, same JSX.|||Render không được có tác dụng phụ — cùng đầu vào, cùng JSX.'),
      ],
    }),
  ],
});
