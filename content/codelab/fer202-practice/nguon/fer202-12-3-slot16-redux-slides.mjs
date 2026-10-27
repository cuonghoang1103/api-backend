/**
 * FER202 · 12.3 — Slide check: Redux, Redux Toolkit, react-redux, middleware, thunk (Slot 16–17). Trắc nghiệm.
 */
import { doiDau, KHOA, lc, tinh } from './_chung.mjs';

const q = (ma, de, luaChon, dapAn, giaiThich, nhieu) => ({ ma, de, luaChon: lc(...luaChon), dapAn, giaiThich, ...(nhieu ? { nhieu: true } : {}) });

export default doiDau({
  slug: 'fer202-12-3-slot16-redux-slides',
  ten: '12.3 Slide check — Redux',
  khoa: KHOA,
  baiHoc: 'fer202-12-3-slot16-redux-slides',
  de: [
    tinh({
      tieuDe: 'Slide check: Flux, Redux and Redux Toolkit',
      doKho: 'EASY', phut: 15,
      khaiNiem: ['MVC vs Flux', 'three principles', 'createSlice', 'configureStore', 'hooks', 'middleware', 'thunk'], the: ['redux', 'quiz'],
      moTa: {
        en: '<p>Twelve questions on Slots 16–17: why Flux replaced two-way MVC data flow, the three principles of Redux, the Redux Toolkit API, react-redux hooks, middleware and Redux Thunk — the topics FE papers test most in the last chapter.</p>',
        vi: '<p>Mười hai câu về Slot 16–17: vì sao Flux thay luồng dữ liệu hai chiều kiểu MVC, ba nguyên tắc của Redux, API của Redux Toolkit, hook của react-redux, middleware và Redux Thunk — những chủ đề đề FE hỏi nhiều nhất ở chương cuối.</p>',
      },
      goiY: ['Luồng một chiều: action → dispatcher/store → view.', 'createSlice = reducer + action creator; configureStore = store + middleware mặc định + DevTools.'],
      loiHayGap: ['Nhầm useSelector (đọc) với useDispatch (gửi).', 'Nghĩ reducer được phép gọi API.'],
      giaiThich: '<p>Xem giải thích từng câu sau khi nộp.</p>',
      thuatNgu: [{ en: 'unidirectional data flow', vi: 'luồng dữ liệu một chiều' }],
      cauHoi: [
        q('q1', 'Main problem Flux solves compared with two-way MVC bindings in large apps:', [['a', 'Slow CSS'], ['b', 'Hard-to-trace cascading updates; Flux enforces one-way data flow'], ['c', 'Missing database'], ['d', 'Too few components']], ['b'], 'Action → dispatcher → store → view, always in one direction.|||Action → dispatcher → store → view, luôn một chiều.'),
        q('q2', 'The three principles of Redux: (choose all)', [['a', 'Single source of truth'], ['b', 'State is read-only (change it by dispatching actions)'], ['c', 'Changes are made with pure functions (reducers)'], ['d', 'Every component has its own store']], [['a', 'b', 'c']], 'One store for the whole app.|||Một store cho cả app.', true),
        q('q3', 'An action is…', [['a', 'a function that changes state'], ['b', 'a plain object with a <code>type</code> describing what happened'], ['c', 'a React component'], ['d', 'a CSS class']], ['b'], 'Often with a payload.|||Thường kèm payload.'),
        q('q4', 'A reducer must NOT… (choose all)', [['a', 'call an API'], ['b', 'mutate its arguments (without Immer)'], ['c', 'use Math.random()/Date.now()'], ['d', 'return a new state']], [['a', 'b', 'c']], 'Same input ⇒ same output, no side effects.|||Cùng đầu vào ⇒ cùng kết quả, không tác dụng phụ.', true),
        q('q5', '<code>createSlice</code> generates…', [['a', 'only the store'], ['b', 'a reducer and action creators from the reducers you write'], ['c', 'React components'], ['d', 'middleware']], ['b'], 'Action types are "<name>/<reducerKey>".|||Kiểu action là "<name>/<khoá reducer>".'),
        q('q6', 'Why can RTK reducers write <code>state.value += 1</code>?', [['a', 'Redux allows mutation'], ['b', 'Immer turns the "mutations" on a draft into a new immutable state'], ['c', 'It is a bug'], ['d', 'Only in development']], ['b'], 'Either mutate the draft or return a new value, not both.|||Hoặc sửa bản nháp, hoặc trả giá trị mới, không làm cả hai.'),
        q('q7', '<code>configureStore</code> adds by default… (choose all)', [['a', 'redux-thunk'], ['b', 'Redux DevTools support'], ['c', 'development checks for mutations/serializability'], ['d', 'a REST client']], [['a', 'b', 'c']], 'That is why middleware: [logger] alone removes thunk.|||Vì vậy middleware: [logger] một mình sẽ làm mất thunk.', true),
        q('q8', 'Make the store available to components:', [['a', '<code>&lt;Provider store={store}&gt;</code> around the app'], ['b', 'Import the store in every component'], ['c', 'window.store'], ['d', 'useContext(store)']], ['a'], 'From react-redux.|||Của react-redux.'),
        q('q9', '<code>useSelector(fn)</code>…', [['a', 'dispatches actions'], ['b', 'reads a value from the store and re-renders when it changes'], ['c', 'creates a slice'], ['d', 'selects DOM elements']], ['b'], 'useDispatch returns dispatch.|||useDispatch trả về hàm dispatch.'),
        q('q10', 'Middleware signature:', [['a', '<code>(state, action) =&gt; state</code>'], ['b', '<code>store =&gt; next =&gt; action =&gt; …</code>'], ['c', '<code>(props) =&gt; JSX</code>'], ['d', '<code>async () =&gt; {}</code>']], ['b'], 'Call next(action) to continue the chain.|||Gọi next(action) để đi tiếp.'),
        q('q11', 'A thunk is…', [['a', 'an action type'], ['b', 'a function dispatched instead of an object; redux-thunk calls it with (dispatch, getState)'], ['c', 'a reducer'], ['d', 'a selector']], ['b'], 'Used for async logic like API calls.|||Dùng cho logic bất đồng bộ như gọi API.'),
        q('q12', '<code>createAsyncThunk("users/fetch", fn)</code> dispatches…', [['a', 'only users/fetch'], ['b', 'users/fetch/pending, then users/fetch/fulfilled or users/fetch/rejected'], ['c', 'nothing until you dispatch manually'], ['d', 'START and END']], ['b'], 'Handle them in extraReducers.|||Xử lý chúng trong extraReducers.'),
      ],
    }),
  ],
});
