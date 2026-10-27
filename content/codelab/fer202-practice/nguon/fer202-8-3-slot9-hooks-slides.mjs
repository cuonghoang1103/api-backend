/**
 * FER202 · 8.3 — Slide check: React Hooks (Slot 9–10). Trắc nghiệm + sắp thứ tự vòng đời effect.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-8-3-slot9-hooks-slides',
  ten: '8.3 Slide check — React Hooks',
  khoa: KHOA,
  baiHoc: 'fer202-8-3-slot9-hooks-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: the rules and the five core hooks',
      doKho: 'EASY', phut: 14,
      khaiNiem: ['rules of hooks', 'useState', 'useEffect', 'useContext', 'useReducer', 'useRef'], the: ['hooks', 'quiz'],
      moTa: {
        en: '<p>Twelve questions on Slot 9–10: why hooks exist, the two rules of hooks, and when to use useState, useEffect, useContext, useReducer and useRef. These are the questions FE multiple-choice papers ask most often.</p>',
        vi: '<p>Mười hai câu về Slot 9–10: vì sao có hooks, hai luật của hooks, và khi nào dùng useState, useEffect, useContext, useReducer, useRef. Đây là nhóm câu đề trắc nghiệm FE hỏi nhiều nhất.</p>',
      },
      goiY: ['Luật hooks: chỉ gọi ở cấp cao nhất, chỉ gọi trong function component hoặc custom hook.', 'Mảng phụ thuộc: không có ⇒ mỗi render; [] ⇒ một lần; [x] ⇒ khi x đổi.'],
      loiHayGap: ['Nhầm "effect chạy trước khi vẽ" — useEffect chạy SAU khi trình duyệt vẽ.', 'Nghĩ đổi ref.current làm component vẽ lại.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'hook', vi: 'hàm use… cho phép function component dùng state và tính năng React' }],
      cauHoi: [
        q('q1', 'Hooks were introduced in React…', [['a', '15.0'], ['b', '16.8'], ['c', '17.0'], ['d', '18.0']], ['b'], 'React 16.8 (February 2019).|||React 16.8 (tháng 2/2019).'),
        q('q2', 'Which call breaks the rules of hooks?', [['a', '<code>const [a, setA] = useState(0)</code> at the top of a component'], ['b', '<code>if (open) { useEffect(…) }</code>'], ['c', 'Calling <code>useState</code> inside a custom hook'], ['d', 'Calling two <code>useState</code> in a row']], ['b'], 'Hooks must be called in the same order every render — never inside conditions or loops.|||Hook phải được gọi cùng thứ tự mỗi lần render — không đặt trong điều kiện hay vòng lặp.'),
        q('q3', 'What does <code>useState</code> return?', [['a', 'The state value only'], ['b', 'An array: [value, setter]'], ['c', 'An object {value, set}'], ['d', 'A Promise']], ['b'], 'Destructure it: const [count, setCount] = useState(0).|||Tách ra: const [count, setCount] = useState(0).'),
        q('q4', '<code>useEffect(fn)</code> with NO dependency array runs…', [['a', 'once'], ['b', 'after every render'], ['c', 'never'], ['d', 'only on unmount']], ['b'], 'No array ⇒ after every commit. [] ⇒ once after mount.|||Không có mảng ⇒ sau mỗi lần commit. [] ⇒ một lần sau mount.'),
        q('q5', 'The function returned from an effect is…', [['a', 'ignored'], ['b', 'the cleanup — run before the effect re-runs and on unmount'], ['c', 'the next state'], ['d', 'called before render']], ['b'], 'Remove listeners, clear timers, cancel requests there.|||Gỡ listener, xoá timer, huỷ request ở đó.'),
        q('q6', 'Why must the effect callback not be <code>async</code>?', [['a', 'It is slower'], ['b', 'An async function returns a Promise, but React expects nothing or a cleanup function'], ['c', 'React forbids await anywhere'], ['d', 'It is fine']], ['b'], 'Define an async function inside and call it.|||Khai báo hàm async bên trong rồi gọi.'),
        q('q7', '<code>useContext(MyContext)</code> returns…', [['a', 'the Provider component'], ['b', 'the value of the nearest MyContext.Provider above, or the default'], ['c', 'all providers'], ['d', 'undefined always']], ['b'], 'The nearest provider wins.|||Provider gần nhất thắng.'),
        q('q8', 'Signature of <code>useReducer</code>?', [['a', '<code>const [state, dispatch] = useReducer(reducer, initialArg, init?)</code>'], ['b', '<code>const dispatch = useReducer(state)</code>'], ['c', '<code>useReducer(action)</code>'], ['d', '<code>const [state] = useReducer()</code>']], ['a'], 'The optional third argument computes the initial state lazily.|||Tham số thứ ba (tuỳ chọn) tính state ban đầu một cách lười.'),
        q('q9', 'When is <code>useReducer</code> preferred over <code>useState</code>? (choose all)', [['a', 'Many related state fields'], ['b', 'Next state depends on the previous one in several ways'], ['c', 'A single boolean toggle'], ['d', 'You want to test the update logic as a pure function']], [['a', 'b', 'd']], 'A single boolean is simpler with useState.|||Một boolean đơn giản thì useState gọn hơn.', true),
        q('q10', 'Changing <code>ref.current</code>…', [['a', 're-renders the component'], ['b', 'does not trigger a re-render'], ['c', 'throws an error'], ['d', 'resets state']], ['b'], 'Refs are for values that should not affect rendering (DOM nodes, timer ids).|||Ref dùng cho giá trị không ảnh hưởng hiển thị (nút DOM, mã timer).'),
        q('q11', 'A custom hook is…', [['a', 'a class'], ['b', 'a function whose name starts with "use" and may call other hooks'], ['c', 'a component that returns JSX'], ['d', 'a Redux middleware']], ['b'], 'Each component calling it gets its own state.|||Mỗi component gọi nó có state riêng.'),
        q('q12', 'Two clicks call <code>setCount(count + 1)</code> twice in one handler (count = 0). Result?', [['a', '2'], ['b', '1'], ['c', '0'], ['d', 'error']], ['b'], 'Both read the same snapshot. Use setCount(c => c + 1) to get 2.|||Cả hai đọc cùng một ảnh chụp. Dùng setCount(c => c + 1) để được 2.'),
      ],
    }),
    tinh({
      loai: 'order',
      tieuDe: 'Order the life of an effect',
      doKho: 'MEDIUM', phut: 6,
      khaiNiem: ['render', 'commit', 'effect', 'cleanup'], the: ['hooks', 'useEffect', 'order'],
      moTa: {
        en: '<p>A component with <code>useEffect(() =&gt; { subscribe(id); return () =&gt; unsubscribe(id); }, [id])</code> mounts with id 1, then id changes to 2, then the component is removed. Put the events in the order they happen.</p>',
        vi: '<p>Component có <code>useEffect(() =&gt; { subscribe(id); return () =&gt; unsubscribe(id); }, [id])</code> mount với id 1, rồi id đổi thành 2, rồi component bị gỡ. Sắp các sự kiện theo đúng thứ tự xảy ra.</p>',
      },
      goiY: ['Effect chạy SAU khi DOM đã cập nhật.', 'Cleanup của lần cũ chạy trước effect của lần mới.'],
      loiHayGap: ['Đặt cleanup của id 1 sau subscribe(2).', 'Nghĩ effect chạy trước render.'],
      giaiThich: '<p>Mỗi lần phụ thuộc đổi: render → commit DOM → cleanup cũ → effect mới. Khi gỡ: chỉ còn cleanup.</p>',
      thuatNgu: [{ en: 'commit', vi: 'React áp thay đổi vào DOM thật' }],
      cauHoi: [
        o('e1', 'Order the events', [
          ['m3', 'Render with id = 2 and commit to the DOM'],
          ['m1', 'Render with id = 1 and commit to the DOM'],
          ['m5', 'subscribe(2)'],
          ['m2', 'subscribe(1)'],
          ['m6', 'Component removed: unsubscribe(2)'],
          ['m4', 'unsubscribe(1)'],
        ], ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'], 'Render/commit → cleanup of the old effect → new effect; on removal only the cleanup runs.|||Render/commit → cleanup của effect cũ → effect mới; khi gỡ chỉ còn cleanup.'),
      ],
    }),
  ],
});
