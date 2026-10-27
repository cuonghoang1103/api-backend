/**
 * FER202 · 12.1 — Redux & Redux Toolkit (bài luyện).
 * Dễ → khó: tự viết createStore (hiểu 3 nguyên tắc) → counterSlice + configureStore + hooks →
 * todos slice (Immer) + selector → giỏ hàng: createSelector + preloadedState + lưu localStorage bằng subscribe.
 */
import { doiDau, KHOA, jsNho, reactNho } from './_chung.mjs';

const click = (selector, lan = 1) => ({ hanhDong: 'click', selector, lan });
const nhap = (selector, giaTri) => ({ hanhDong: 'nhap', selector, giaTri });
const RX = { redux: './app/store' };

export default doiDau({
  slug: 'fer202-12-1-redux-toolkit',
  ten: '12.1 Redux Toolkit',
  khoa: KHOA,
  baiHoc: 'fer202-12-1-redux-toolkit',
  de: [
    jsNho({
      tieuDe: 'Build a mini createStore (the three Redux principles)',
      doKho: 'MEDIUM', phut: 15,
      khaiNiem: ['single source of truth', 'state is read-only', 'pure reducers', 'subscribe/unsubscribe'], the: ['redux', 'javascript'],
      moTa: {
        en: '<p>Redux is small enough to write yourself — doing it once makes the three principles concrete. Implement <code>createStore(reducer, preloadedState)</code> returning <code>{ getState, dispatch, subscribe }</code>. On creation, dispatch <code>{ type: "@@INIT" }</code> so the reducer can provide its initial state.</p>',
        vi: '<p>Redux đủ nhỏ để tự viết — làm một lần là hiểu ba nguyên tắc. Cài <code>createStore(reducer, preloadedState)</code> trả <code>{ getState, dispatch, subscribe }</code>. Khi tạo, dispatch <code>{ type: "@@INIT" }</code> để reducer cấp state ban đầu.</p>',
      },
      yeuCau: [
        { en: '<code>dispatch(action)</code>: action must be a plain object with a <code>type</code> — otherwise throw <code>Error("Actions must be plain objects with a type")</code>; computes the new state, calls every listener, returns the action.', vi: '<code>dispatch(action)</code>: action phải là object thường có <code>type</code> — nếu không ném <code>Error("Actions must be plain objects with a type")</code>; tính state mới, gọi mọi listener, trả lại action.' },
        { en: '<code>subscribe(listener)</code> returns an <code>unsubscribe</code> function.', vi: '<code>subscribe(listener)</code> trả hàm <code>unsubscribe</code>.' },
      ],
      viDu: [{ input: 'createStore(counter).dispatch({ type: "inc" }); getState()', output: '1', explanation: 'The reducer default parameter gives 0 on @@INIT.|||Tham số mặc định của reducer cho 0 lúc @@INIT.' }],
      goiY: ['let state = preloadedState; const listeners = []; function dispatch(action) { … state = reducer(state, action); listeners.forEach((l) => l()); return action; } dispatch({ type: "@@INIT" });', 'subscribe: listeners.push(l); return () => { const i = listeners.indexOf(l); if (i >= 0) listeners.splice(i, 1); };'],
      loiHayGap: ['Trả về <code>state</code> rồi để nơi khác sửa trực tiếp ⇒ phá nguyên tắc "state chỉ đọc" (ở đây chấp nhận, Redux thật cũng không đóng băng).', 'Gọi listener TRƯỚC khi cập nhật state ⇒ listener đọc state cũ.'],
      thuatNgu: [{ en: 'store', vi: 'kho chứa state duy nhất của app' }, { en: 'listener', vi: 'hàm được gọi sau mỗi lần dispatch' }],
      giaiThich: '<p>Ba nguyên tắc: (1) một store duy nhất, (2) chỉ đổi state bằng cách dispatch action, (3) đổi state bằng reducer thuần. createStore chỉ là vài dòng nối ba điều đó lại; react-redux dùng subscribe để biết khi nào vẽ lại.</p>',
      dau: `// main.js — STARTER
function createStore(reducer, preloadedState) {
  let state = preloadedState;
  return {
    getState: () => state,
    dispatch: (action) => { state = reducer(state, action); },
    subscribe: () => {},
  };
}
`,
      giai: `// main.js — Redux tối giản: một state, đổi qua dispatch, reducer thuần, listener
function createStore(reducer, preloadedState) {
  let state = preloadedState;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    if (action === null || typeof action !== 'object' || Array.isArray(action) || typeof action.type !== 'string') {
      throw new Error('Actions must be plain objects with a type');
    }
    state = reducer(state, action);
    listeners.slice().forEach((listener) => listener()); // bản sao: unsubscribe trong lúc gọi vẫn an toàn
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return function unsubscribe() {
      const i = listeners.indexOf(listener);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  dispatch({ type: '@@INIT' });
  return { getState, dispatch, subscribe };
}
`,
      kiem: [
        { moTa: 'Initial state from the reducer', chuanBi: 'const counter = (s = 0, a) => (a.type === "inc" ? s + 1 : s);', goi: 'createStore(counter).getState()', mongDoi: 0 },
        { moTa: 'dispatch updates the state', chuanBi: 'const counter = (s = 0, a) => (a.type === "inc" ? s + 1 : s); const st = createStore(counter); st.dispatch({ type: "inc" }); st.dispatch({ type: "inc" });', goi: 'st.getState()', mongDoi: 2 },
        { moTa: 'preloadedState wins over the default', chuanBi: 'const counter = (s = 0, a) => (a.type === "inc" ? s + 1 : s); const st = createStore(counter, 10); st.dispatch({ type: "inc" });', goi: 'st.getState()', mongDoi: 11 },
        { moTa: 'Listeners run after the state changes', chuanBi: 'const counter = (s = 0, a) => (a.type === "inc" ? s + 1 : s); const st = createStore(counter); const seen = []; st.subscribe(() => seen.push(st.getState())); st.dispatch({ type: "inc" }); st.dispatch({ type: "x" });', goi: 'seen', mongDoi: [1, 1] },
        { an: true, moTa: 'unsubscribe stops notifications', chuanBi: 'const st = createStore((s = 0, a) => s + 1); let n = 0; const un = st.subscribe(() => n++); st.dispatch({ type: "a" }); un(); st.dispatch({ type: "b" });', goi: 'n', mongDoi: 1 },
        { an: true, moTa: 'Rejects actions without a type', chuanBi: 'const st = createStore((s = 0) => s);', goi: 'st.dispatch(() => {})', mongDoi: { loi: 'Error', thongDiep: '^Actions must be plain objects with a type$' } },
        { an: true, moTa: 'dispatch returns the action', chuanBi: 'const st = createStore((s = 0) => s);', goi: 'st.dispatch({ type: "hello", payload: 1 })', mongDoi: { type: 'hello', payload: 1 } },
      ],
    }),
    reactNho({
      tieuDe: 'counterSlice + configureStore + useSelector/useDispatch',
      doKho: 'MEDIUM', phut: 14, index: RX,
      themGiai: {
        'src/features/counter/counterSlice.js': `// src/features/counter/counterSlice.js — createSlice sinh action creator + reducer
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1; // Immer: "sửa" bản nháp, RTK tạo state mới
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    reset: () => ({ value: 0 }),
  },
});

export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;
export const selectCount = (state) => state.counter.value;
export default counterSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js — một store cho cả app
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
`,
      },
      themDau: {
        'src/features/counter/counterSlice.js': `// src/features/counter/counterSlice.js — STARTER: viết bằng createSlice
export const increment = () => ({ type: 'counter/increment' });
export const selectCount = () => 0;
export default function counterReducer(state = { value: 0 }) {
  return state;
}
`,
        'src/app/store.js': `// src/app/store.js — STARTER
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({ reducer: { counter: counterReducer } });
`,
      },
      khaiNiem: ['createSlice', 'configureStore', 'Provider', 'useSelector', 'useDispatch', 'payload'], the: ['redux', 'redux-toolkit', 'exercise-24'],
      moTa: {
        en: '<p>The Exercise 24 setup. <code>counterSlice</code> (name <code>counter</code>, state <code>{ value: 0 }</code>) with <code>increment</code>, <code>decrement</code>, <code>incrementByAmount(n)</code>, <code>reset</code>, and a selector <code>selectCount</code>. <code>index.js</code> already wraps <code>&lt;App /&gt;</code> in <code>&lt;Provider store={store}&gt;</code>. Wire the UI with <code>useSelector</code> and <code>useDispatch</code>.</p>',
        vi: '<p>Thiết lập của Exercise 24. <code>counterSlice</code> (name <code>counter</code>, state <code>{ value: 0 }</code>) có <code>increment</code>, <code>decrement</code>, <code>incrementByAmount(n)</code>, <code>reset</code>, và selector <code>selectCount</code>. <code>index.js</code> đã bọc <code>&lt;App /&gt;</code> trong <code>&lt;Provider store={store}&gt;</code>. Nối giao diện bằng <code>useSelector</code> và <code>useDispatch</code>.</p>',
      },
      yeuCau: [
        { en: '<code>#count</code>, <code>#inc</code>, <code>#dec</code>, <code>#amount</code> (number input, default 5) + <code>#add-amount</code>, <code>#reset</code>.', vi: '<code>#count</code>, <code>#inc</code>, <code>#dec</code>, <code>#amount</code> (ô số, mặc định 5) + <code>#add-amount</code>, <code>#reset</code>.' },
        { en: 'A second component <code>#double</code> (<code>Double: 10</code>) reads the SAME store value.', vi: 'Component thứ hai <code>#double</code> (<code>Double: 10</code>) đọc CÙNG giá trị trong store.' },
      ],
      viDu: [{ input: 'amount 5, Add amount, +', output: 'count 6 · Double: 12', explanation: 'dispatch(incrementByAmount(Number(amount)))|||dispatch(incrementByAmount(Number(amount)))' }],
      goiY: ['const count = useSelector(selectCount); const dispatch = useDispatch();', 'onClick={() => dispatch(incrementByAmount(Number(amount) || 0))}'],
      loiHayGap: ['<code>dispatch(increment)</code> (thiếu ngoặc) ⇒ dispatch một hàm ⇒ thunk chạy nó, không có gì xảy ra.', 'Truyền chuỗi "5" làm payload ⇒ 0 + "5" = "05".'],
      thuatNgu: [{ en: 'slice', vi: 'một phần state + reducer + action' }, { en: 'action creator', vi: 'hàm tạo action: increment() ⇒ { type: "counter/increment" }' }],
      giaiThich: '<p>createSlice sinh <code>type</code> dạng <code>"counter/increment"</code> và action creator tương ứng. Nhờ Immer, reducer viết kiểu "sửa trực tiếp" mà vẫn bất biến. Mọi component dùng useSelector cùng một ô state sẽ vẽ lại khi nó đổi.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p id="count">{count}</p>
      <button id="inc" onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
`,
      giai: `// src/App.js — đọc bằng useSelector, đổi bằng dispatch(action creator)
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment, incrementByAmount, reset, selectCount } from './features/counter/counterSlice';

function DoubleView() {
  const count = useSelector(selectCount);
  return <p id="double">Double: {count * 2}</p>;
}

export default function App() {
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  const [amount, setAmount] = useState('5');

  return (
    <div>
      <p id="count">{count}</p>
      <button id="inc" type="button" onClick={() => dispatch(increment())}>+</button>
      <button id="dec" type="button" onClick={() => dispatch(decrement())}>−</button>
      <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button id="add-amount" type="button" onClick={() => dispatch(incrementByAmount(Number(amount) || 0))}>Add amount</button>
      <button id="reset" type="button" onClick={() => dispatch(reset())}>Reset</button>
      <DoubleView />
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Increment and decrement', kiem: 'text', selector: '#count', giaTri: '1', truoc: [click('#inc', 2), click('#dec')] },
        { moTa: 'incrementByAmount with a number payload', kiem: 'text', selector: '#count', giaTri: '12', truoc: [nhap('#amount', '12'), click('#add-amount')] },
        { moTa: 'Another component reads the same state', kiem: 'text', selector: '#double', giaTri: 'Double: 12', truoc: [click('#add-amount'), click('#inc')] },
        { moTa: 'Reset', kiem: 'text', selector: '#count', giaTri: '0', truoc: [click('#inc', 3), click('#reset')] },
        { an: true, moTa: 'Slice made with createSlice', kiem: 'ma-nguon', tep: 'src/features/counter/counterSlice.js', khop: 'createSlice\\(\\s*\\{[\\s\\S]*name:\\s*[\'"]counter[\'"]' },
        { an: true, moTa: 'App uses useSelector + useDispatch (no local count state)', kiem: 'ma-nguon', tep: 'src/App.js', khop: '^(?=[\\s\\S]*useSelector\\()(?=[\\s\\S]*useDispatch\\()(?![\\s\\S]*\\[\\s*count\\s*,\\s*setCount\\s*\\])' },
      ],
    }),
    reactNho({
      tieuDe: 'Todos slice with Immer and selectors',
      doKho: 'MEDIUM', phut: 16, index: RX,
      themGiai: {
        'src/features/todos/todosSlice.js': `// src/features/todos/todosSlice.js — reducer "sửa" bản nháp (Immer) + prepare callback tạo id
import { createSlice, nanoid } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    todoAdded: {
      reducer(state, action) {
        state.items.push(action.payload);
      },
      prepare(text) {
        return { payload: { id: nanoid(), text: text.trim(), done: false } };
      },
    },
    todoToggled(state, action) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) todo.done = !todo.done;
    },
    todoRemoved(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    filterChanged(state, action) {
      state.filter = action.payload;
    },
    completedCleared(state) {
      state.items = state.items.filter((t) => !t.done);
    },
  },
});

export const { todoAdded, todoToggled, todoRemoved, filterChanged, completedCleared } = todosSlice.actions;

export const selectFilter = (state) => state.todos.filter;
export const selectRemaining = (state) => state.todos.items.filter((t) => !t.done).length;
export const selectVisibleTodos = (state) => {
  const { items, filter } = state.todos;
  if (filter === 'active') return items.filter((t) => !t.done);
  if (filter === 'done') return items.filter((t) => t.done);
  return items;
};

export default todosSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({ reducer: { todos: todosReducer } });
`,
      },
      themDau: {
        'src/features/todos/todosSlice.js': `// src/features/todos/todosSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: { items: [], filter: 'all' },
  reducers: {
    todoAdded(state, action) {
      return state; // TODO
    },
  },
});

export const { todoAdded } = todosSlice.actions;
export const todoToggled = () => ({ type: 'noop' });
export const todoRemoved = () => ({ type: 'noop' });
export const filterChanged = () => ({ type: 'noop' });
export const completedCleared = () => ({ type: 'noop' });
export const selectVisibleTodos = (state) => state.todos.items;
export const selectRemaining = () => 0;
export const selectFilter = (state) => state.todos.filter;
export default todosSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

export const store = configureStore({ reducer: { todos: todosReducer } });
`,
      },
      khaiNiem: ['Immer drafts', 'prepare callback', 'nanoid', 'selectors', 'derived data'], the: ['redux', 'redux-toolkit'],
      moTa: {
        en: '<p>A todo app whose state lives in Redux. Reducers use Immer ("mutate" the draft); <code>todoAdded</code> uses a <b>prepare callback</b> to build the payload (<code>nanoid()</code> id, trimmed text) so components dispatch just the text. Visible items and the remaining count are <b>selectors</b>, not stored state.</p>',
        vi: '<p>App việc cần làm, state nằm trong Redux. Reducer dùng Immer ("sửa" bản nháp); <code>todoAdded</code> dùng <b>prepare callback</b> để dựng payload (id <code>nanoid()</code>, chữ đã trim) nên component chỉ cần dispatch chuỗi. Danh sách hiển thị và số việc còn lại là <b>selector</b>, không lưu thành state.</p>',
      },
      yeuCau: [
        { en: 'Form <code>#todo-form</code> + <code>#todo-text</code> (blank ignored). Rows <code>li.todo</code> (<code>.text</code>, checkbox <code>.toggle</code>, <code>.btn-remove</code>), class <code>done</code> when done.', vi: 'Form <code>#todo-form</code> + <code>#todo-text</code> (rỗng bỏ qua). Dòng <code>li.todo</code> (<code>.text</code>, ô chọn <code>.toggle</code>, <code>.btn-remove</code>), có class <code>done</code> khi xong.' },
        { en: 'Filter buttons <code>#f-all</code>, <code>#f-active</code>, <code>#f-done</code>; <code>#remaining</code> <code>2 items left</code>; <code>#clear-done</code>.', vi: 'Nút lọc <code>#f-all</code>, <code>#f-active</code>, <code>#f-done</code>; <code>#remaining</code> <code>2 items left</code>; <code>#clear-done</code>.' },
      ],
      viDu: [{ input: 'add A, B, C; toggle B; filter active', output: 'A, C · 2 items left', explanation: 'selectVisibleTodos derives the list from items + filter.|||selectVisibleTodos tính danh sách từ items + filter.' }],
      goiY: ['todoAdded: { reducer(state, action) { state.items.push(action.payload); }, prepare(text) { return { payload: { id: nanoid(), text: text.trim(), done: false } }; } }', 'todoToggled(state, action) { const t = state.items.find((x) => x.id === action.payload); if (t) t.done = !t.done; }'],
      loiHayGap: ['Vừa sửa nháp vừa <code>return</code> object mới trong cùng reducer ⇒ Immer báo lỗi.', 'Lưu <code>visibleTodos</code> thành state riêng ⇒ quên cập nhật khi thêm/xoá.'],
      thuatNgu: [{ en: 'draft', vi: 'bản nháp Immer cho phép "sửa" mà vẫn bất biến' }, { en: 'selector', vi: 'hàm đọc/tính dữ liệu từ state' }],
      giaiThich: '<p>Immer ghi lại các thay đổi trên bản nháp rồi tạo state mới. Prepare callback giữ logic tạo dữ liệu trong slice (id, trim) thay vì rải ra component. Selector giữ state tối thiểu.</p>',
      dau: `// src/App.js — STARTER
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { todoAdded, selectVisibleTodos } from './features/todos/todosSlice';

export default function App() {
  const todos = useSelector(selectVisibleTodos);
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  return (
    <form id="todo-form" onSubmit={(e) => { e.preventDefault(); dispatch(todoAdded(text)); }}>
      <input id="todo-text" value={text} onChange={(e) => setText(e.target.value)} />
      <ul>{todos.map((t) => <li key={t.id} className="todo"><span className="text">{t.text}</span></li>)}</ul>
    </form>
  );
}
`,
      giai: `// src/App.js — component chỉ đọc selector và dispatch action
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  completedCleared, filterChanged, selectFilter, selectRemaining, selectVisibleTodos,
  todoAdded, todoRemoved, todoToggled,
} from './features/todos/todosSlice';

const FILTERS = [['all', 'All'], ['active', 'Active'], ['done', 'Done']];

export default function App() {
  const todos = useSelector(selectVisibleTodos);
  const remaining = useSelector(selectRemaining);
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();
  const [text, setText] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(todoAdded(text));
    setText('');
  };

  return (
    <div>
      <form id="todo-form" onSubmit={submit}>
        <input id="todo-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="What needs to be done?" />
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id} className={t.done ? 'todo done' : 'todo'}>
            <input type="checkbox" className="toggle" checked={t.done} onChange={() => dispatch(todoToggled(t.id))} />
            <span className="text">{t.text}</span>
            <button type="button" className="btn-remove" onClick={() => dispatch(todoRemoved(t.id))}>×</button>
          </li>
        ))}
      </ul>
      <p id="remaining">{remaining} items left</p>
      {FILTERS.map(([value, label]) => (
        <button key={value} id={´f-@{value}´} type="button" className={filter === value ? 'active' : ''} onClick={() => dispatch(filterChanged(value))}>{label}</button>
      ))}
      <button id="clear-done" type="button" onClick={() => dispatch(completedCleared())}>Clear done</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Adds trimmed todos', kiem: 'danh-sach-text', selector: 'li.todo .text', mongDoi: ['Learn Redux', 'Write slice'], truoc: [nhap('#todo-text', '  Learn Redux '), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'Write slice'), { hanhDong: 'gui', selector: '#todo-form' }] },
        { moTa: 'Toggle + remaining count', kiem: 'danh-sach-text', selector: 'li.todo.done .text, #remaining', mongDoi: ['B', '2 items left'], truoc: [nhap('#todo-text', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'B'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'C'), { hanhDong: 'gui', selector: '#todo-form' }, click('li.todo:nth-child(2) .toggle')] },
        { moTa: 'Active filter', kiem: 'danh-sach-text', selector: 'li.todo .text', mongDoi: ['A', 'C'], truoc: [nhap('#todo-text', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'B'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'C'), { hanhDong: 'gui', selector: '#todo-form' }, click('li.todo:nth-child(2) .toggle'), click('#f-active')] },
        { an: true, moTa: 'Clear done', kiem: 'danh-sach-text', selector: 'li.todo .text', mongDoi: ['A'], truoc: [nhap('#todo-text', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'B'), { hanhDong: 'gui', selector: '#todo-form' }, click('li.todo:nth-child(2) .toggle'), click('#clear-done')] },
        { an: true, moTa: 'Remove one', kiem: 'so-luong', selector: 'li.todo', giaTri: 1, truoc: [nhap('#todo-text', 'A'), { hanhDong: 'gui', selector: '#todo-form' }, nhap('#todo-text', 'B'), { hanhDong: 'gui', selector: '#todo-form' }, click('li.todo:nth-child(1) .btn-remove')] },
        { an: true, moTa: 'Blank ignored', kiem: 'so-luong', selector: 'li.todo', giaTri: 0, truoc: [nhap('#todo-text', '   '), { hanhDong: 'gui', selector: '#todo-form' }] },
        { an: true, moTa: 'prepare callback in the slice', kiem: 'ma-nguon', tep: 'src/features/todos/todosSlice.js', khop: 'prepare\\s*\\(' },
      ],
    }),
    reactNho({
      tieuDe: 'Cart: createSelector, preloadedState and persistence',
      doKho: 'HARD', phut: 22, index: RX,
      themGiai: {
        'src/features/cart/cartSlice.js': `// src/features/cart/cartSlice.js — giỏ hàng + selector có ghi nhớ
import { createSelector, createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { lines: [] },
  reducers: {
    added(state, action) {
      const p = action.payload;
      const line = state.lines.find((l) => l.id === p.id);
      if (line) line.qty += 1;
      else state.lines.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    },
    qtyChanged(state, action) {
      const { id, qty } = action.payload;
      if (qty <= 0) state.lines = state.lines.filter((l) => l.id !== id);
      else {
        const line = state.lines.find((l) => l.id === id);
        if (line) line.qty = qty;
      }
    },
    cleared(state) {
      state.lines = [];
    },
  },
});

export const { added, qtyChanged, cleared } = cartSlice.actions;

const selectLines = (state) => state.cart.lines;
export const selectCount = createSelector([selectLines], (lines) => lines.reduce((s, l) => s + l.qty, 0));
export const selectTotal = createSelector([selectLines], (lines) => lines.reduce((s, l) => s + l.qty * l.price, 0));
export { selectLines };

export default cartSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js — khôi phục giỏ từ localStorage (preloadedState) và lưu lại sau mỗi thay đổi
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

const KEY = 'cart';

function loadCart() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return undefined;
    const lines = JSON.parse(raw);
    return Array.isArray(lines) ? { cart: { lines } } : undefined;
  } catch {
    return undefined; // dữ liệu hỏng ⇒ bỏ qua
  }
}

export const store = configureStore({
  reducer: { cart: cartReducer },
  preloadedState: loadCart(),
});

let last = store.getState().cart.lines;
store.subscribe(() => {
  const lines = store.getState().cart.lines;
  if (lines !== last) {
    last = lines;
    localStorage.setItem(KEY, JSON.stringify(lines));
  }
});
`,
      },
      themDau: {
        'src/features/cart/cartSlice.js': `// src/features/cart/cartSlice.js — STARTER
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { lines: [] },
  reducers: {
    added(state, action) {
      state.lines.push({ ...action.payload, qty: 1 });
    },
    qtyChanged() {},
    cleared() {},
  },
});

export const { added, qtyChanged, cleared } = cartSlice.actions;
export const selectLines = (state) => state.cart.lines;
export const selectCount = (state) => state.cart.lines.length;
export const selectTotal = () => 0;
export default cartSlice.reducer;
`,
        'src/app/store.js': `// src/app/store.js — STARTER
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({ reducer: { cart: cartReducer } });
`,
      },
      khaiNiem: ['createSelector (memoized)', 'preloadedState', 'store.subscribe', 'persisting part of the state'], the: ['redux', 'redux-toolkit'],
      moTa: {
        en: '<p>A shopping cart in Redux that survives a reload. <code>selectCount</code> and <code>selectTotal</code> are memoized with <code>createSelector</code>. On startup <code>store.js</code> reads localStorage key <code>cart</code> (an array of lines) into <code>preloadedState</code>; afterwards it writes the lines back whenever they change (<code>store.subscribe</code>). Corrupted storage must not crash the app.</p>',
        vi: '<p>Giỏ hàng Redux còn nguyên sau khi tải lại. <code>selectCount</code> và <code>selectTotal</code> có ghi nhớ bằng <code>createSelector</code>. Khi khởi động <code>store.js</code> đọc localStorage khoá <code>cart</code> (mảng dòng) vào <code>preloadedState</code>; sau đó ghi lại mỗi khi các dòng đổi (<code>store.subscribe</code>). Storage hỏng không được làm sập app.</p>',
      },
      yeuCau: [
        { en: 'Products (given in App): Pen 15000, Notebook 32000, Bag 250000 — buttons <code>.btn-add</code>. Lines <code>li.line</code> (<code>.name</code>, <code>.qty</code> number input, <code>.subtotal</code>). Qty 0 removes the line.', vi: 'Sản phẩm (đã cho trong App): Pen 15000, Notebook 32000, Bag 250000 — nút <code>.btn-add</code>. Dòng <code>li.line</code> (<code>.name</code>, ô số <code>.qty</code>, <code>.subtotal</code>). Số lượng 0 thì bỏ dòng.' },
        { en: '<code>#cart-count</code> (total quantity), <code>#cart-total</code> <code>Total: 62,000 ₫</code>, <code>#clear</code>.', vi: '<code>#cart-count</code> (tổng số lượng), <code>#cart-total</code> <code>Total: 62,000 ₫</code>, <code>#clear</code>.' },
      ],
      viDu: [{ input: 'add Pen ×2, Notebook ×1, reload', output: 'cart restored · Total: 62,000 ₫', explanation: 'preloadedState: { cart: { lines } }|||preloadedState: { cart: { lines } }' }],
      goiY: ['export const selectTotal = createSelector([selectLines], (lines) => lines.reduce((s, l) => s + l.qty * l.price, 0));', 'configureStore({ reducer, preloadedState: loadCart() }); store.subscribe(() => localStorage.setItem("cart", JSON.stringify(store.getState().cart.lines)));'],
      loiHayGap: ['Lưu cả store (kể cả dữ liệu tải từ server) ⇒ dữ liệu cũ kẹt lại sau mỗi lần mở app.', 'Ghi localStorage TRONG reducer ⇒ reducer không còn thuần.'],
      thuatNgu: [{ en: 'memoized selector', vi: 'selector nhớ kết quả, chỉ tính lại khi đầu vào đổi' }, { en: 'hydrate', vi: 'nạp lại state đã lưu khi khởi động' }],
      giaiThich: '<p>Reducer phải thuần nên việc lưu (tác dụng phụ) nằm NGOÀI: subscribe hoặc middleware. preloadedState chạy trước mọi reducer, nên giỏ đã có từ lần render đầu.</p>',
      dau: `// src/App.js — STARTER
import { useDispatch, useSelector } from 'react-redux';
import { added, selectCount, selectLines } from './features/cart/cartSlice';

const PRODUCTS = [
  { id: 1, name: 'Pen', price: 15000 },
  { id: 2, name: 'Notebook', price: 32000 },
  { id: 3, name: 'Bag', price: 250000 },
];

export default function App() {
  const lines = useSelector(selectLines);
  const count = useSelector(selectCount);
  const dispatch = useDispatch();
  return (
    <div>
      {PRODUCTS.map((p) => <button key={p.id} className="btn-add" onClick={() => dispatch(added(p))}>{p.name}</button>)}
      <span id="cart-count">{count}</span>
      <ul>{lines.map((l, i) => <li key={i} className="line"><span className="name">{l.name}</span></li>)}</ul>
    </div>
  );
}
`,
      giai: `// src/App.js — đọc selector có ghi nhớ; sửa số lượng bằng qtyChanged
import { useDispatch, useSelector } from 'react-redux';
import { added, cleared, qtyChanged, selectCount, selectLines, selectTotal } from './features/cart/cartSlice';

const PRODUCTS = [
  { id: 1, name: 'Pen', price: 15000 },
  { id: 2, name: 'Notebook', price: 32000 },
  { id: 3, name: 'Bag', price: 250000 },
];

const vnd = (n) => n.toLocaleString('en-US') + ' ₫';

export default function App() {
  const lines = useSelector(selectLines);
  const count = useSelector(selectCount);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch();

  return (
    <div>
      <div>
        {PRODUCTS.map((p) => (
          <button key={p.id} type="button" className="btn-add" onClick={() => dispatch(added(p))}>{p.name}</button>
        ))}
      </div>
      <p>Items: <span id="cart-count">{count}</span></p>
      <ul>
        {lines.map((l) => (
          <li key={l.id} className="line">
            <span className="name">{l.name}</span>
            <input className="qty" type="number" min="0" value={l.qty} onChange={(e) => dispatch(qtyChanged({ id: l.id, qty: Number(e.target.value) }))} />
            <span className="subtotal">{vnd(l.qty * l.price)}</span>
          </li>
        ))}
      </ul>
      <p id="cart-total">Total: {vnd(total)}</p>
      <button id="clear" type="button" onClick={() => dispatch(cleared())}>Clear</button>
    </div>
  );
}
`,
      kiem: [
        { moTa: 'Same product merges, count and total', kiem: 'danh-sach-text', selector: '#cart-count, #cart-total', mongDoi: ['3', 'Total: 62,000 ₫'], truoc: [click('.btn-add:nth-child(1)', 2), click('.btn-add:nth-child(2)')] },
        { moTa: 'Changing qty updates the subtotal', kiem: 'text', selector: 'li.line:nth-child(1) .subtotal', giaTri: '75,000 ₫', truoc: [click('.btn-add:nth-child(1)'), nhap('li.line:nth-child(1) .qty', '5')] },
        { moTa: 'Qty 0 removes the line', kiem: 'so-luong', selector: 'li.line', giaTri: 1, truoc: [click('.btn-add:nth-child(1)'), click('.btn-add:nth-child(3)'), nhap('li.line:nth-child(1) .qty', '0')] },
        { moTa: 'Cart survives a reload', kiem: 'danh-sach-text', selector: 'li.line .name, #cart-total', mongDoi: ['Pen', 'Notebook', 'Total: 62,000 ₫'], truoc: [click('.btn-add:nth-child(1)', 2), click('.btn-add:nth-child(2)'), { hanhDong: 'tai-lai' }] },
        { an: true, moTa: 'Saved as an array of lines', kiem: 'kho-cuc-bo', khoa: 'cart', khop: '^\\[\\{"id":3,"name":"Bag","price":250000,"qty":1\\}\\]$', truoc: [click('.btn-add:nth-child(3)')] },
        { an: true, moTa: 'Corrupted storage ⇒ empty cart, no crash', khoCucBo: { cart: '{oops' }, kiem: 'text', selector: '#cart-count', giaTri: '0' },
        { an: true, moTa: 'Clear empties and persists', kiem: 'kho-cuc-bo', khoa: 'cart', khop: '^\\[\\]$', truoc: [click('.btn-add:nth-child(1)'), click('#clear')] },
        { an: true, moTa: 'Memoized selectors', kiem: 'ma-nguon', tep: 'src/features/cart/cartSlice.js', khop: 'createSelector\\(' },
        { an: true, moTa: 'preloadedState in configureStore', kiem: 'ma-nguon', tep: 'src/app/store.js', khop: 'preloadedState' },
      ],
    }),
  ],
});
