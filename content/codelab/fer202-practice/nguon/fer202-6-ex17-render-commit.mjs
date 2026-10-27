/**
 * FER202 · Exercise 17 — Render and Commit (lý thuyết + quan sát ⇒ sắp xếp + trắc nghiệm + bài React đếm render).
 */
import { doiDau, KHOA, lc, reactNho, tinh } from './_chung.mjs';

const o = (ma, de, muc, dapAn, giaiThich) => ({ ma, de, muc: lc(...muc), dapAn, giaiThich });
const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-6-ex17-render-commit',
  ten: '6.4 Exercise 17 — Render and Commit',
  khoa: KHOA,
  baiHoc: 'fer202-6-ex17-render-commit',
  de: [
    tinh({
      loai: 'order',
      tieuDe: 'Order the steps of a React update',
      doKho: 'EASY', phut: 6,
      khaiNiem: ['trigger', 'render', 'commit', 'paint'], the: ['rendering', 'exercise-17'],
      moTa: {
        en: '<p>React serves UI like a restaurant kitchen: an order is placed (trigger), the cook prepares it (render), the dish is served (commit), then the customer sees it (browser paint). Put the steps in order.</p>',
        vi: '<p>React phục vụ giao diện như bếp nhà hàng: khách gọi món (trigger), đầu bếp nấu (render), mang món ra (commit), rồi khách thấy món (trình duyệt vẽ). Hãy xếp các bước đúng thứ tự.</p>',
      },
      goiY: ['Không thể "commit" thứ chưa được tính ra.', 'Trình duyệt chỉ vẽ sau khi DOM đã được cập nhật.'],
      loiHayGap: ['Nghĩ render = cập nhật DOM. Render chỉ là gọi component để tính JSX.', 'Nghĩ mọi lần render đều đổi DOM.'],
      giaiThich: '<p>Trigger (lần đầu hoặc setState) → React gọi component (render) → so sánh và áp thay đổi tối thiểu vào DOM (commit) → trình duyệt vẽ.</p>',
      thuatNgu: [{ en: 'trigger', vi: 'kích hoạt' }, { en: 'commit', vi: 'áp thay đổi vào DOM' }, { en: 'paint', vi: 'trình duyệt vẽ lên màn hình' }],
      cauHoi: [
        o('r1', 'A user clicks "+" in a counter. Order what happens.', [
          ['c', 'React compares the new JSX with the previous one'],
          ['a', 'The click handler calls <code>setCount(c =&gt; c + 1)</code> (trigger)'],
          ['e', 'The browser paints the new number'],
          ['b', 'React calls <code>Counter()</code> again to get new JSX (render)'],
          ['d', 'React updates only the changed text node in the DOM (commit)'],
        ], ['a', 'b', 'c', 'd', 'e'], 'Trigger → render → diff → commit → paint.|||Trigger → render → so sánh → commit → vẽ.'),
      ],
    }),
    tinh({
      tieuDe: 'Render vs commit: true or false?',
      doKho: 'MEDIUM', phut: 8,
      khaiNiem: ['render', 'commit', 'reconciliation'], the: ['rendering', 'exercise-17'],
      moTa: {
        en: '<p>Six statements from the Exercise 17 experiment (put <code>console.log(\'render\')</code> in a component and watch).</p>',
        vi: '<p>Sáu nhận định từ thí nghiệm của Exercise 17 (đặt <code>console.log(\'render\')</code> trong component và quan sát).</p>',
      },
      goiY: ['Render là gọi hàm component; commit mới đụng DOM.', 'Cha render thì con render theo (trừ khi được memo).'],
      loiHayGap: ['Đặt lệnh đổi DOM / gọi API trong thân component (lúc render).', 'Lo sợ render "tốn kém" — đa số render rẻ, commit mới tốn.'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'reconciliation', vi: 'đối chiếu cây cũ/mới' }],
      cauHoi: [
        q('t1', 'Every render changes the DOM.', [['a', 'True'], ['b', 'False']], ['b'], 'If the JSX is the same, the commit step changes nothing.|||Nếu JSX như cũ, bước commit không đổi gì.'),
        q('t2', 'When a parent re-renders, its children re-render too (by default).', [['a', 'True'], ['b', 'False']], ['a'], 'Unless wrapped in React.memo with unchanged props.|||Trừ khi bọc React.memo và props không đổi.'),
        q('t3', 'Rendering must be pure: no side effects such as fetching or changing the DOM.', [['a', 'True'], ['b', 'False']], ['a'], 'Side effects go into event handlers or useEffect.|||Tác dụng phụ đặt trong handler sự kiện hoặc useEffect.'),
        q('t4', '<code>setCount(count)</code> with the same value always triggers a full DOM rewrite.', [['a', 'True'], ['b', 'False']], ['b'], 'React may bail out; even if it renders, the commit finds nothing to change.|||React có thể bỏ qua; kể cả có render thì commit cũng không thấy gì để đổi.'),
        q('t5', 'React keeps a DOM input\'s typed text when the surrounding JSX re-renders with the same structure.', [['a', 'True'], ['b', 'False']], ['a'], 'Same element in the same place ⇒ React reuses the DOM node.|||Cùng phần tử ở cùng vị trí ⇒ React dùng lại nút DOM.'),
        q('t6', 'In StrictMode (development), React may call your component twice to detect impure renders.', [['a', 'True'], ['b', 'False']], ['a'], 'That is why you can see "render" logged twice in development.|||Vì vậy ở development bạn có thể thấy "render" in hai lần.'),
      ],
    }),
    reactNho({
      tieuDe: 'See render vs commit: count renders without re-rendering',
      doKho: 'HARD', phut: 15,
      khaiNiem: ['useRef', 'render count', 'same-value update'], the: ['rendering', 'exercise-17'],
      moTa: {
        en: '<p>Make the render/commit cycle visible. A <code>useRef</code> counts how many times <code>Counter</code> renders (a ref change does NOT trigger a render). "+1" changes state; "Same value" calls <code>setCount(count)</code>, which React may skip entirely.</p>',
        vi: '<p>Làm cho chu trình render/commit hiện ra. <code>useRef</code> đếm số lần <code>Counter</code> render (đổi ref KHÔNG gây render). "+1" đổi state; "Same value" gọi <code>setCount(count)</code>, React có thể bỏ qua hoàn toàn.</p>',
      },
      yeuCau: [
        { en: '<code>#count</code> shows the count; <code>#renders</code> shows "Renders: N" where N increments inside the component body via <code>renders.current += 1</code>.', vi: '<code>#count</code> hiện số đếm; <code>#renders</code> hiện "Renders: N", N tăng trong thân component qua <code>renders.current += 1</code>.' },
        { en: '<code>#plus</code> ⇒ count + 1; <code>#same</code> ⇒ <code>setCount(count)</code>.', vi: '<code>#plus</code> ⇒ count + 1; <code>#same</code> ⇒ <code>setCount(count)</code>.' },
      ],
      viDu: [{ input: 'click +1 twice', output: 'count 2 · Renders: 3', explanation: '1 initial render + 2 updates (production build, no StrictMode double render).|||1 lần render đầu + 2 lần cập nhật (bản production, không render đôi của StrictMode).' }],
      goiY: ['const renders = useRef(0); renders.current += 1; — đếm trong thân hàm (chính là lúc render).', 'Đừng dùng useState để đếm render — set state trong lúc render gây vòng lặp vô hạn.'],
      loiHayGap: ['<code>const [renders, setRenders] = useState(0); setRenders(renders + 1)</code> trong thân ⇒ "Too many re-renders".', 'Nghĩ "Same value" sẽ làm số render tăng mãi.'],
      thuatNgu: [{ en: 'ref', vi: 'hộp chứa giá trị sống qua các lần render, đổi không gây render' }],
      giaiThich: '<p>Thân component chạy mỗi lần render nên bộ đếm trong ref tăng đúng số lần render. Đặt cùng giá trị (<code>Object.is</code> bằng nhau) cho phép React "bail out" — không render lại con và không commit gì.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  // TODO: đếm số lần render bằng useRef
  return (
    <div>
      <p id="count">{count}</p>
      <p id="renders">Renders: ?</p>
      <button id="plus" onClick={() => setCount(count + 1)}>+1</button>
      <button id="same">Same value</button>
    </div>
  );
}

export default function App() {
  return <Counter />;
}
`,
      giai: `// src/App.js — ref đếm render (đổi ref không gây render); setCount(count) có thể bị React bỏ qua
import { useRef, useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const renders = useRef(0);
  renders.current += 1; // thân component chạy = một lần render

  return (
    <div>
      <p id="count">{count}</p>
      <p id="renders">Renders: {renders.current}</p>
      <button id="plus" type="button" onClick={() => setCount((c) => c + 1)}>+1</button>
      <button id="same" type="button" onClick={() => setCount(count)}>Same value</button>
    </div>
  );
}

export default function App() {
  return <Counter />;
}
`,
      kiem: [
        { moTa: 'First render', kiem: 'text', selector: '#renders', giaTri: 'Renders: 1' },
        { moTa: 'Two updates ⇒ three renders', kiem: 'danh-sach-text', selector: '#count, #renders', mongDoi: ['2', 'Renders: 3'], truoc: [{ hanhDong: 'click', selector: '#plus' }, { hanhDong: 'cho', ms: 50 }, { hanhDong: 'click', selector: '#plus' }] },
        { moTa: 'Same value does not change the count', kiem: 'text', selector: '#count', giaTri: '0', truoc: [{ hanhDong: 'click', selector: '#same' }] },
        { an: true, moTa: 'Same value adds at most one render', kiem: 'text', selector: '#renders', khop: '^Renders: [12]$', truoc: [{ hanhDong: 'click', selector: '#same' }, { hanhDong: 'cho', ms: 50 }, { hanhDong: 'click', selector: '#same' }, { hanhDong: 'cho', ms: 50 }, { hanhDong: 'click', selector: '#same' }] },
        { an: true, moTa: 'Render count uses useRef', kiem: 'ma-nguon', khop: 'useRef\\(\\s*0\\s*\\)' },
      ],
    }),
  ],
});
