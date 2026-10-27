/**
 * FER202 · 6.2 — Slide check: Event handling, Render & Commit, State as a snapshot (Slot 11–12). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-6-2-slot11-events-slides',
  ten: '6.2 Slide check — Events, render & snapshot',
  khoa: KHOA,
  baiHoc: 'fer202-6-2-slot11-events-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: event handling in React',
      doKho: 'EASY', phut: 12,
      khaiNiem: ['synthetic events', 'handlers', 'preventDefault', 'stopPropagation'], the: ['events', 'quiz'],
      moTa: {
        en: '<p>Ten questions on Slot 11–12: naming and passing handlers, the synthetic event object, default actions and propagation.</p>',
        vi: '<p>Mười câu về Slot 11–12: đặt tên và truyền handler, object sự kiện tổng hợp, hành vi mặc định và lan truyền.</p>',
      },
      goiY: ['Handler nhận HÀM, không phải kết quả của lời gọi.', 'preventDefault ≠ stopPropagation.'],
      loiHayGap: ['Viết onclick chữ thường; truyền chuỗi như HTML.', 'Trả false để chặn mặc định (không có tác dụng trong React).'],
      giaiThich: '<p>Xem giải thích sau khi nộp.</p>',
      thuatNgu: [{ en: 'synthetic event', vi: 'sự kiện tổng hợp của React (bọc sự kiện gốc)' }],
      cauHoi: [
        q('q1', 'Correct way to attach a click handler in React?', [['a', '<code>onclick="handle()"</code>'], ['b', '<code>onClick={handle}</code>'], ['c', '<code>onClick="handle"</code>'], ['d', '<code>on-click={handle}</code>']], ['b'], 'camelCase prop + a function reference.|||Prop camelCase + tham chiếu hàm.'),
        q('q2', '<code>&lt;button onClick={save()}&gt;</code> will…', [['a', 'call save on click'], ['b', 'call save during every render'], ['c', 'never call save'], ['d', 'throw a syntax error']], ['b'], 'The expression is evaluated while rendering.|||Biểu thức được tính ngay khi render.'),
        q('q3', 'Pass an id to a handler:', [['a', '<code>onClick={remove(id)}</code>'], ['b', '<code>onClick={() =&gt; remove(id)}</code>'], ['c', '<code>onClick={remove, id}</code>'], ['d', '<code>onClick:remove(id)</code>']], ['b'], 'Wrap in an arrow so it runs later.|||Bọc bằng arrow để chạy về sau.'),
        q('q4', 'Stop a form from reloading the page:', [['a', '<code>return false</code>'], ['b', '<code>e.preventDefault()</code> in onSubmit'], ['c', '<code>e.stopPropagation()</code>'], ['d', 'remove the button']], ['b'], 'preventDefault cancels the browser\'s default action.|||preventDefault huỷ hành vi mặc định của trình duyệt.'),
        q('q5', 'A click on a child also triggers the parent\'s onClick because of…', [['a', 'capturing only'], ['b', 'bubbling'], ['c', 'hoisting'], ['d', 'batching']], ['b'], 'Events bubble from the target up through its ancestors.|||Sự kiện nổi bọt từ phần tử đích lên các tổ tiên.'),
        q('q6', 'Difference between <code>e.target</code> and <code>e.currentTarget</code>?', [['a', 'None'], ['b', 'target = element actually clicked; currentTarget = element whose handler is running'], ['c', 'target is always the button'], ['d', 'currentTarget is the window']], ['b'], 'Important for delegation.|||Quan trọng khi ủy quyền sự kiện.'),
        q('q7', 'Read the text of a controlled input in onChange:', [['a', '<code>e.value</code>'], ['b', '<code>e.target.value</code>'], ['c', '<code>this.value</code>'], ['d', '<code>e.data</code>']], ['b'], 'For checkboxes use <code>e.target.checked</code>.|||Với checkbox dùng e.target.checked.'),
        q('q8', 'Which run during RENDER and must stay pure? (choose all)', [['a', 'The component function body'], ['b', 'Event handlers'], ['c', 'Calculating JSX from props/state'], ['d', 'A fetch inside onClick']], [['a', 'c']], 'Handlers run later (on events) and may have side effects.|||Handler chạy về sau (khi có sự kiện) và được phép có tác dụng phụ.', true),
        q('q9', 'Inside one handler, after <code>setName(\'An\')</code>, <code>name</code> is…', [['a', '"An" immediately'], ['b', 'still the value from this render'], ['c', 'undefined'], ['d', 'null']], ['b'], 'State is a snapshot for the whole render.|||State là ảnh chụp cho cả lần render.'),
        q('q10', 'Multiple setState calls in one click usually cause…', [['a', 'one re-render (batching)'], ['b', 'one render per call'], ['c', 'no render'], ['d', 'an error']], ['a'], 'React 18 batches updates in event handlers, timeouts and promises.|||React 18 gom các lần cập nhật trong handler, timeout và promise.'),
      ],
    }),
  ],
});
