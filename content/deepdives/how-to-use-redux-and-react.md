Redux has an image problem. It was the default answer for two years, then the punchline for five, and most of what people know about it describes a version that stopped being current in 2019. Meanwhile the actual question — *when does an application need a store outside the component tree, and what does that cost* — has a measurable answer.

So this guide measures it. Every state transition, render count, selector call and byte below came out of a real store: reducers dispatched in Node, components mounted with jsdom, render counts taken from a counter inside each component body.

```
@reduxjs/toolkit 2.12.0 · react-redux 9.3.0 · redux 5.0.1 · react 19.2.8
```

Five of those measurements contradicted something I was about to write, and one of them contradicts the sentence Redux Toolkit is usually sold with.

---

## What Redux actually is, in one reducer

Strip away every library and Redux is one function signature:

```js
(state, action) => newState
```

That's it. Here it is with no dependency at all:

```js
const initial = { count: 0, user: { name: 'mai' }, items: ['a'] };

function reducer(state = initial, action) {
  switch (action.type) {
    case 'count/inc':
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
}
```

```js
const store = createStore(reducer);
const before = store.getState();
store.dispatch({ type: 'count/inc' });
const after = store.getState();
```

```
before : {"count":0,"user":{"name":"mai"},"items":["a"]}
after  : {"count":1,"user":{"name":"mai"},"items":["a"]}
```

Now the part that matters, and that you can only see by comparing references:

```
Object.is(before, after)             = false
Object.is(before.user, after.user)   = true
Object.is(before.items, after.items) = true
```

The root object is new, so anything watching the store can tell *something* changed with one comparison. But `user` and `items` are **the same objects** — the spread copied their references, not their contents. That's **structural sharing**, and it's the whole performance story of immutable state: a component that only reads `state.user` can skip re-rendering after a comparison that costs nothing.

And an action nobody handles changes nothing at all:

```js
store.dispatch({ type: 'nothing/at/all' });
```

```
same reference as before? true
```

Which is why `default: return state` is not boilerplate — it's the contract that makes reference comparison a valid way to detect change.

---

## The store is three functions

```js
store.getState();          // read
store.dispatch(action);    // write
store.subscribe(listener); // be told
```

`subscribe` behaves more bluntly than people expect. Measured:

```
1 dispatch that changes state → listener ran 1 time
1 dispatch that changes NOTHING → listener ran 1 time
3 dispatches in a row          → listener ran 3 times
```

The store notifies on **every** dispatch, whether or not the state changed, and it does not batch. All the cleverness about "did this actually change" and "should this component re-render" lives above the store, in `useSelector`. Keep that division in mind — it explains a measurement later that surprises people.

![One dispatch, all the way through](/deepdives/redux/dispatch-cycle.svg)

---

## `createSlice`, and what it actually saves

The pitch for Redux Toolkit is that it removes boilerplate. I wanted a number, so I wrote the same two-action feature both ways and counted.

Classic Redux:

```js
const ADD = 'todos/add';
const TOGGLE = 'todos/toggle';
export const add = (text) => ({ type: ADD, payload: text });
export const toggle = (id) => ({ type: TOGGLE, payload: id });

export default function todos(state = [], action) {
  switch (action.type) {
    case ADD:
      return [...state, { id: state.length + 1,
                          text: action.payload, done: false }];
    case TOGGLE:
      return state.map((t) =>
        t.id === action.payload ? { ...t, done: !t.done } : t);
    default:
      return state;
  }
}
```

Redux Toolkit:

```js
const slice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    add(state, a) {
      state.push({ id: state.length + 1, text: a.payload, done: false });
    },
    toggle(state, a) {
      const t = state.find((x) => x.id === a.payload);
      if (t) t.done = !t.done;
    },
  },
});

export const { add, toggle } = slice.actions;
export default slice.reducer;
```

```
classic Redux : 14 lines, 500 characters
createSlice   : 13 lines, 370 characters
```

**One line.** I expected a rout and got a rounding error — 26% fewer characters and a single line saved. If your reason for adopting Redux Toolkit is line count, the measurement does not support you.

What the measurement misses is where the actual value is, and it's worth being precise about because these are the things that break in hand-written Redux:

- **No action-type constants to keep in sync.** `slice.actions.add` and the reducer that handles it cannot drift apart, because they're generated from the same key. Every codebase with hand-written types has at least one action that's dispatched and never handled.
- **No manual immutable updates.** The `state.map(t => t.id === id ? {...t, done: !t.done} : t)` line above is correct; the one someone writes at 6pm won't be. More on that next.
- **The defaults are configured.** Thunks, DevTools, and two development-time guards, without a store setup file.
- **`createSlice` gives you one place per feature.** That's a structural benefit, and it's the same argument as feature folders in the [React structure guide](/tech-trends/how-to-structure-and-organize-a-react-application).

So the honest pitch is "fewer ways to be wrong", not "less code".

---

## immer: mutations that aren't

Inside a `createSlice` reducer you write what looks like mutation:

```js
addQty(state, action) {
  state.items[0].qty += action.payload;
}
```

Nothing is mutated. Immer hands your reducer a **draft** — a Proxy that records writes — then produces a new state from the recording. Measured on a cart with `items`, `coupon` and `meta`:

```
before.items[0] : {"id":1,"qty":1}
after.items[0]  : {"id":1,"qty":3}

Object.is(before, after)             = false
Object.is(before.items, after.items) = false
Object.is(before.meta, after.meta)   = true   ← untouched, same reference
before.items[0].qty is still 1
```

Read the third line. `meta` was not part of the update, so immer reused the exact same object — the same structural sharing as the hand-written spread, produced automatically along the path you actually touched. And the old state is genuinely unchanged: `before.items[0].qty` is still 1 after the dispatch.

A reducer that touches nothing returns the same state object:

```
reducer that changes nothing → same reference? true
```

Two things to know about immer in practice. You may either mutate the draft **or** return a new value, never both in one reducer — returning a value while also having written to the draft is an error. And the draft is only a draft during the reducer: don't hold onto it, don't pass it to an async callback, and don't return it from a selector.

---

## The two guards you get for free

`configureStore` turns on development-time checks that catch the two classic Redux bugs. I tried to trigger both.

**Mutating state outside a reducer:**

```js
store.getState().bad.n = 99;
```

```
TypeError: Cannot assign to read only property 'n' of object '#<Object>'
```

Here's a detail I had wrong. I was going to describe this as the immutability *middleware* catching the mutation on the next dispatch. It's better than that: RTK freezes state with immer, so the assignment **throws immediately, at the line that did it**, before any dispatch happens. You get a stack trace pointing at the culprit instead of a warning pointing at the next unrelated action.

**A non-serializable payload:**

```js
store.dispatch({ type: 'bad/withDate',
                 payload: { when: new Date(0), fn: () => {} } });
```

```
A non-serializable value was detected in an action,
in the path: `payload.when`.
```

It names the exact path. This check exists because two Redux features depend on state and actions being plain data: time-travel debugging, and serialising state to storage or to a server. A `Date` in an action works fine until someone tries to replay it.

Both checks are development-only and cost nothing in production. If a specific action genuinely needs a non-serializable payload, configure the exception rather than disabling the check:

```js
configureStore({
  reducer,
  middleware: (gdm) => gdm({
    serializableCheck: { ignoredActions: ['upload/setFile'] },
  }),
});
```

---

## `useSelector` subscribes at the leaf

This is the measurement that decides whether Redux helps or hurts a React app. A store with two slices, and four components: one reads the theme, one reads the cart count, one reads nothing, one only dispatches.

```js
const ReadsTheme = () => <span>{useSelector(s => s.ui.theme)}</span>;
const ReadsCount = () => <span>{useSelector(s => s.cart.items.length)}</span>;
```

```
dispatch ui/toggle     → {ReadsTheme: 1}
dispatch cart/addItem  → {ReadsCount: 1}
```

**One component per dispatch.** `App` didn't re-render. `Buttons` didn't. `ReadsNothing` didn't. The component that read the changed slice did, and nothing else.

That is a genuinely different shape from context, and it's the honest technical case for a store. The [React structure guide](/tech-trends/how-to-structure-and-organize-a-react-application) measured the same tree six ways; this fits on the end of that table:

| Approach | Components re-rendered |
|---|---|
| state at the top, props down | 5 |
| one context holding two values | 3 |
| two contexts, split by rate of change | 2 |
| state at the leaf that needs it | 1 |
| Redux + `useSelector` | 1 |

`useSelector` is built on `useSyncExternalStore`, the same primitive as a hand-rolled store — so the render behaviour is identical, and what Redux adds on top is the reducer discipline, the DevTools, and the middleware layer. If all you wanted was leaf subscriptions, you don't need Redux for that.

![Who re-renders when one slice changes](/deepdives/redux/render-scope.svg)

---

## The selector trap that costs you every dispatch

`useSelector` re-renders when its result changes by reference. So a selector that builds a new object every call changes every time, and the component re-renders on **every dispatch in the application** — including dispatches to slices it doesn't read.

```js
// re-renders on every dispatch, anywhere
const t = useSelector((s) => ({
  count: s.cart.items.length,
  sum: s.cart.items.reduce((a, i) => a + i.price, 0),
}));
```

Three dispatches to an unrelated slice (`ui/toggle`), with the cart untouched:

```
new object each call → Totals rendered 3 times
useSelector(..., shallowEqual) → Totals rendered 0 times
useSelector(createSelector(...)) → Totals rendered 0 times
```

Zero versus three, on dispatches that had nothing to do with this component's data. And react-redux will tell you, in development, in as many words:

```
Selector unknown returned a different result when called with the same
parameters. This can lead to unnecessary rerenders.
Selectors that return a new reference (such as an object or an array)
should be memoized
```

Two fixes, and they're not equivalent:

```js
// 1. compare the result shallowly instead of by reference
useSelector(selectTotals, shallowEqual);

// 2. memoise the selector so the reference is stable
const selectTotals = createSelector(
  [(s) => s.cart.items],
  (items) => ({ count: items.length,
                sum: items.reduce((a, i) => a + i.price, 0) }),
);
```

`shallowEqual` stops the re-render but still runs your computation on every dispatch. `createSelector` stops both. If the computation is a `.length`, use `shallowEqual` and move on; if it's a `reduce` over a thousand rows, memoise.

The cheapest fix of all is to not build an object:

```js
const count = useSelector((s) => s.cart.items.length);
const sum = useSelector((s) => s.cart.total);
```

Two `useSelector` calls returning primitives need no memoisation at all, because numbers compare by value. Reach for `createSelector` when you're deriving something, not when you're reading two fields.

---

## `createSelector`, measured

`createSelector` memoises on its inputs. What that means precisely:

```js
const memoed = createSelector(
  [(s) => s.cart.items],
  (items) => items.reduce((a, i) => a + i.price, 0),
);
```

```
called 5 times, state unchanged
  plain function  → computed 5 times
  createSelector  → computed 1 time

3 dispatches to a DIFFERENT slice, then called again
  createSelector  → computed 0 times

3 dispatches that CHANGE cart, then called again
  createSelector  → computed 3 times
```

The middle result is the useful one: dispatching to `ui` produced a new root state object, and `createSelector` still didn't recompute, because its *input* — `state.cart.items` — was the same reference. That's structural sharing paying off twice: once to skip a render, once to skip a computation.

Two caveats that catch people. A `createSelector` has a **cache size of one** by default, so a selector shared by many components with different arguments thrashes:

```js
// one cache slot, shared by every row → recomputes constantly
const selectById = createSelector(
  [(s) => s.posts.entities, (s, id) => id],
  (entities, id) => entities[id],
);
```

The fix is a selector factory per component instance, or `createSelector` with a larger cache (RTK 2 uses `weakMapMemoize` by default for exactly this reason, which handles the common case). And an input selector that itself builds a new object defeats the whole thing — inputs must be stable references, which in practice means they should be plain field reads.

---

## Async: one call, three actions

`createAsyncThunk` turns a promise into a small state machine. One thunk produces three action types, and you handle the ones you care about:

```js
const fetchUser = createAsyncThunk('users/fetch', async (id) => {
  if (id === 'boom') throw new Error('server said no');
  return { id, name: `user-${id}` };
});
```

```js
extraReducers: (b) => {
  b.addCase(fetchUser.pending,   (s) => { s.status = 'loading'; s.error = null; })
   .addCase(fetchUser.fulfilled, (s, a) => {
     s.status = 'ok';
     s.data = a.payload;
   })
   .addCase(fetchUser.rejected, (s, a) => {
     s.status = 'failed';
     s.error = a.error.message;
   });
}
```

With a middleware spying on every action that reached the store:

```
success → ["users/fetch/pending", "users/fetch/fulfilled"]
          state {"status":"ok","data":{"id":"7","name":"user-7"},"error":null}

failure → ["users/fetch/pending", "users/fetch/rejected"]
          state {"status":"failed","data":{"id":"7",…},"error":"server said no"}
```

![The three actions of one thunk](/deepdives/redux/thunk-lifecycle.svg)

Look at the failure state carefully: `status` is `failed` and `data` **still holds the previous user**. That's not a bug in RTK, it's a decision my reducer made by not clearing `data` in the `rejected` case. Whether that's right depends on the screen — keeping stale data while showing an error banner is often better than blanking the page — but it should be a decision, not an accident. Write the `rejected` case explicitly every time.

Two behaviours of the returned promise that trip people up:

```
dispatch(...) resolved with type=users/fetch/rejected · has .error? true
```

**`dispatch(thunk())` does not reject.** It resolves with the rejected *action*, so `try/catch` around a dispatch catches nothing. To get a throw, ask for one:

```js
try {
  await store.dispatch(fetchUser('boom')).unwrap();
} catch (e) {
  // handle it
}
```

```
.unwrap() → throws Object: server said no
```

And note what it throws: an `Object`, not an `Error`. RTK serialises the error into a plain object (`{ name, message, stack, code }`) because actions must be serialisable, so `e instanceof Error` is **false** in a `.unwrap()` catch block. Check `e.message`, not the constructor. That one cost me a minute of disbelief.

---

## `condition`: deduplication in one line

Three components mount at once and each asks for the same data. The classic fix is a flag in the component; the built-in fix is an option on the thunk:

```js
const load = createAsyncThunk(
  'feed/load',
  async () => { /* fetch */ },
  { condition: (_arg, { getState }) => getState().feed.status !== 'loading' },
);
```

```js
await Promise.all([store.dispatch(load()),
                   store.dispatch(load()),
                   store.dispatch(load())]);
```

```
the fetch function ran 1 time
blocked by condition: 2 of 3 (meta.condition === true)
```

Three dispatches, one request. The blocked dispatches resolve immediately with `meta.condition: true` and never emit `pending` or `fulfilled`, so your reducers don't see them at all. This is the entire feature that request-deduplication libraries are famous for, available as a three-line option — worth knowing before you add a dependency for it.

---

## RTK Query: the part that replaces your thunks

If the state you're storing came from a server, `createAsyncThunk` is the wrong tool and RTK ships the right one in the same package. Three components asking for the same data:

```js
const api = createApi({
  reducerPath: 'api',
  tagTypes: ['Post'],
  endpoints: (b) => ({
    getPosts: b.query({ queryFn: fetchPosts, providesTags: ['Post'] }),
    addPost: b.mutation({ queryFn: postIt, invalidatesTags: ['Post'] }),
  }),
});
```

```js
const Row = ({ tag }) => {
  const { data, isLoading } = api.endpoints.getPosts.useQuery();
  return <span>{isLoading ? '…' : `${tag}:${data.length}`}</span>;
};
```

```
3 components calling useQuery('getPosts') → the fetch function ran 1 time
DOM "a:1b:1c:1"
mounting a 4th component later            → 0 additional fetches (cache)
dispatching a mutation with invalidatesTags → 1 refetch, automatically
cache keys: ["getPosts(undefined)"]
```

Four behaviours, none of which you wrote: request deduplication across components, a cache keyed by endpoint + arguments, automatic refetch of exactly the queries a mutation invalidates, and `isLoading`/`isError`/`data` without a reducer case each. Compare that with the `condition` option earlier — that gave you deduplication for one thunk; this gives you the whole cache.

The tag system is the part worth understanding, because it's the whole invalidation model in two words:

```js
getPosts:  b.query({ providesTags: ['Post'] })
getPost:   b.query({ providesTags: (r, e, id) => [{ type: 'Post', id }] })
addPost:   b.mutation({ invalidatesTags: ['Post'] })
editPost:  b.mutation({ invalidatesTags: (r, e, a) =>
             [{ type: 'Post', id: a.id }] })
```

A mutation says what it invalidated; every query that provides a matching tag refetches. Nothing subscribes to anything by hand. Editing one post refetches that post and any list that provides the general `Post` tag, and nothing else.

Which sharpens the honest recommendation: **if you're reaching for Redux because of server data, use RTK Query and write almost no reducers.** If you're not otherwise using Redux, TanStack Query does the same job without the store. Either way, hand-written thunks for CRUD are the option that costs the most and gives the least.

---

## Listener middleware: `takeLatest` without a saga

Redux Saga existed because reducers can't do effects and thunks can't be cancelled. RTK's listener middleware covers most of what people used sagas for, and cancellation is the interesting part. A debounced search where every keystroke dispatches:

```js
listener.startListening({
  actionCreator: typed,
  effect: async (action, api) => {
    api.cancelActiveListeners();   // ← makes this takeLatest
    await api.delay(20);           // ← debounce
    runs.push(action.payload);
  },
});
```

Four keystrokes in a row — `r`, `re`, `red`, `redu`:

```
effect ran to completion 1 time: ["redu"]
```

Three effects were cancelled mid-`delay` and only the last one finished. That's `takeLatest` plus debounce in two lines, with no generators and no extra dependency. The same API gives you `condition` (wait for a future action), `take`, `fork`/`unsubscribe`, and access to `getState`/`dispatch`.

Where it belongs: reacting to actions with side effects that aren't a data fetch — analytics, a toast, syncing to `localStorage`, starting a websocket, invalidating something. Where it doesn't: business logic that should be a reducer, or a fetch that should be RTK Query.

```js
configureStore({
  reducer,
  // prepend, so the listener sees actions before the dev checks
  middleware: (gdm) => gdm().prepend(listener.middleware),
});
```

---

## Time travel is just replaying the log

"Time-travel debugging" sounds like magic and is arithmetic. Because every action is plain serialisable data and every reducer is pure, the state is a *function of the action list* — so recording the list is recording the session. A middleware that pushes each action into an array:

```js
const recorder = () => (next) => (action) => {
  log.push(action);
  return next(action);
};
```

Four dispatches, then send the log through JSON — exactly as it would travel attached to a bug report — and replay it into a **fresh store**:

```js
const wire = JSON.stringify(log);
const s2 = makeStore();
JSON.parse(wire).forEach((a) => s2.dispatch(a));
```

```
recorded 4 actions · the log as JSON = 147 bytes

original state : {"items":[{"id":1}],"coupon":"TET25"}
replayed state : {"items":[{"id":1}],"coupon":"TET25"}
identical? true
```

**147 bytes reproduced the exact state.** And stopping early is stepping backwards in time:

```js
JSON.parse(wire).slice(0, 3).forEach((a) => s3.dispatch(a));
```

```
replaying 3 of 4 actions: {"items":[{"id":1},{"id":2}],"coupon":"TET25"}
```

That's the whole feature, and it's why the serializability check earlier is not pedantry: a `Date` or a `File` in an action breaks the JSON round trip, and with it the ability to replay. It's also the most under-used debugging technique in front-end work — "attach your action log" turns an unreproducible report into a test case.

This is the capability no `useState` refactor gives you, and the honest reason to keep Redux in an application complex enough to have unreproducible bugs.

---

## DevTools: what the log buys you in practice

`configureStore` wires up the Redux DevTools extension with no configuration, and the replay measurement above is exactly what powers it. Four things it gives you that a `console.log` doesn't:

- **The action list** — every dispatch, in order, with its payload. When a user says "it broke after I hit save twice", the list shows whether the second save dispatched at all.
- **A state diff per action.** Not the whole state — the fields that changed. This is the fastest way to find a reducer that changes more than it should, which in immer-based code usually means a stray write to a draft.
- **Jump and skip.** Click an earlier action and the app renders that state; toggle one action off and everything after it recomputes without it. That's the replay above, driven from a UI.
- **Export and import.** The action log as a JSON file — 147 bytes in the measurement earlier — attachable to a bug report and replayable on your machine.

Two practical notes. Trim it in production rather than shipping the whole history:

```js
configureStore({
  reducer,
  devTools: process.env.NODE_ENV !== 'production',
});
```

And if the DevTools panel says "no store found", the usual cause is two stores (one created at module scope, one in a test or in a hot-reloaded module) rather than a wiring problem.

The reason to mention this in a structure guide is that these features are the *entire* return on Redux's constraints. Serialisable actions, pure reducers, one write path — each of those is a rule you follow at every keystroke, and the log is what you get for following them. If a project doesn't use the log to debug, it's paying the rules and collecting nothing, which is a fair sign the state belongs somewhere simpler.

---

## Middleware is an onion

Every middleware wraps the next one, and the reducer is in the middle. Two loggers that record before and after:

```js
const mk = (name) => () => (next) => (action) => {
  order.push(`${name} →`);
  const r = next(action);
  order.push(`← ${name}`);
  return r;
};
```

```
A →  B →  ← B  ← A
```

So `A` sees the action before `B` does, and sees the world *after* the reducer has run when `next` returns. That ordering is why the position of `concat` matters:

```js
configureStore({
  reducer,
  middleware: (gdm) => gdm().concat(logger, analytics),
});
```

`gdm()` is `getDefaultMiddleware` — the thunk middleware plus the two dev checks. Always build on it rather than replacing it, or you lose thunks silently. Use `prepend` when your middleware must see actions before the defaults do (for example, to rewrite an action before the serializability check inspects it).

The onion shape is also what makes middleware the right place for cross-cutting concerns — analytics, optimistic updates, retry, offline queueing — and the wrong place for business logic, which belongs in reducers where it's testable as a pure function.

---

## One action, several slices

This is the structural capability that no per-component state can reproduce, and it's three lines. A logout should clear the cart, the draft nobody submitted, and the auth user — in a component-state world that's a chain of callbacks or an effect that knows about everything.

```js
const loggedOut = createAction('auth/loggedOut');

// each slice cleans up its own corner, in its own file
const auth = createSlice({ name: 'auth', initialState: { user: 'mai' },
  reducers: {},
  extraReducers: (b) => { b.addCase(loggedOut, (s) => { s.user = null; }); },
});

const cart = createSlice({ name: 'cart', initialState: { items: [1, 2, 3] },
  reducers: {},
  extraReducers: (b) => { b.addCase(loggedOut, (s) => { s.items = []; }); },
});
```

```
before: {"auth":{"user":"mai"},"cart":{"items":[1,2,3]},
         "draft":{"text":"xin chao"}}
after : {"auth":{"user":null},"cart":{"items":[]},
         "draft":{"text":"xin chao"}}

slice that ignored the action → same reference? true
```

One dispatch, two slices updated, and `draft` — which doesn't listen — kept its exact object, so anything reading it doesn't re-render. Neither slice imports the other; they both import the action. That's the inversion that makes this scale: **features subscribe to events rather than calling each other**, which is the same rule as "features don't import features" from the [React structure guide](/tech-trends/how-to-structure-and-organize-a-react-application), enforced by the architecture instead of by a lint rule.

`addMatcher` generalises it when you want a whole family:

```js
extraReducers: (b) => {
  b.addMatcher(
    (a) => a.type.endsWith('/rejected'),
    (s, a) => { s.lastError = a.error?.message ?? 'unknown'; },
  );
}
```

One case that catches every rejected thunk in the application — a global error slice in five lines.

---

## Testing: the payoff for keeping reducers pure

A reducer is `(state, action) => state`. That means testing one needs no store, no `Provider`, no mocks, no async. Called directly:

```js
let s = reducer(undefined, { type: '@@INIT' });
s = reducer(s, add('mua sua'));
const snapshot = s;
s = reducer(s, toggle(1));
```

```
✓ initial state is []
✓ add appends one item
✓ toggle flips done
✓ the previous state was NOT mutated
✓ an unknown action returns the SAME reference
5/5 pass · 0 mocks · 0 store
```

The fourth and fifth assertions are the ones worth copying, because they test the two properties the rest of the system relies on. If a reducer mutates its input, structural sharing breaks and components stop re-rendering *sometimes*. If an unknown action returns a new object, every component re-renders on every unrelated dispatch. Both are silent, and both are one line to catch.

For selectors, the same: they're pure functions of state, so a test passes a literal state object and asserts on the output — no store needed there either. Test the components with a real store and no mocks (`configureStore` in the test, wrap in `Provider`), and keep mocks for the network boundary only.

---

## The `createSelector` cache, and an old warning that's now obsolete

Plenty of articles warn that a selector taking an argument is dangerous, because `createSelector` has a cache of one and components with different arguments will thrash it. I was going to repeat it. Measured on RTK 2:

```js
const selectById = createSelector(
  [(s) => s.posts.entities, (s, id) => id],
  (entities, id) => entities[id],
);

for (const id of ['a', 'b', 'c', 'a', 'b', 'c']) selectById(state, id);
```

```
RTK 2 default (weakMapMemoize)        → computed 3 times
same selector with lruMemoize (size 1) → computed 6 times
```

Six calls across three ids: **three computations** with the default, six with the old memoiser. RTK 2 changed the default to `weakMapMemoize`, which caches per argument set rather than only the most recent one — so the classic thrash is gone unless you've explicitly configured `lruMemoize` or you're on RTK 1.

Which makes the current advice much simpler than the old advice: write selectors that take arguments, keep input selectors as plain field reads, and only think about memoisation strategy if you measure a problem. If you're on an older version, the workaround was a selector factory per component (`useMemo(() => makeSelectById(), [])`) — and it's worth checking your version before you write that.

---

## Normalised state with `createEntityAdapter`

Storing a list as an array means every lookup is a scan and every update rewrites the array. `createEntityAdapter` keeps `ids` and `entities` separately and gives you the reducers:

```js
const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'posts',
  initialState: adapter.getInitialState({ loading: false }),
  reducers: {
    setAll: adapter.setAll,
    upsert: adapter.upsertOne,
    remove: adapter.removeOne,
  },
});
```

```
after setAll : {"ids":["a","b"],
                "entities":{"a":{"id":"a","t":"A"},"b":{"id":"b","t":"B"}},
                "loading":false}

after upsert b : ids=["a","b"]  b.t=B2
Object.is(entities.a before, after) = true   ← untouched record kept
selectAll().length = 2 · selectById('b').t = B2
```

The last two lines are the payoff. Updating `b` left `a`'s object identical by reference, so a memoised row component for `a` skips its re-render — the array version would have produced a new array and, depending on how you wrote the update, new objects for every row. And `ids` keeps order separately from the lookup table, so sorting doesn't touch the data.

Use it whenever the same records are referenced from more than one place. Skip it for a list you fetch, render once, and throw away.

---

## Store notifications are not renders

Here's the measurement that ties the store and React halves together. A handler dispatching three times, a component reading three fields with three separate `useSelector` calls:

```js
onClick={() => { d(incA()); d(incB()); d(incC()); }}
```

```
store.subscribe ran   3 times   (redux notifies per dispatch)
Reader rendered       1 time    (React batches)
DOM "111"
```

Three notifications, one render. `useSelector` is built on `useSyncExternalStore`, and React batches the resulting updates within the event — so the store's lack of batching does not become a rendering problem. Three `useSelector` calls in one component also produce one render, not three.

Which means "I should combine my dispatches to reduce renders" is optimising something that isn't happening. There is a real cost to many dispatches — each one runs every reducer and notifies every subscriber — but it's not measured in React renders.

---

## What Redux costs

The honest number, because the "when not to use it" section needs one. The same counter button, built three ways, bundled and minified with esbuild, with React marked external (as it would be in a real app):

```
                       minified    gzip    brotli
useState                   173 B    176 B     124 B
useSyncExternalStore       298 B    249 B     192 B
RTK + react-redux       27,288 B  10,670 B   9,741 B
```

**About 10.7 KB gzipped** for a counter. That's the floor: `configureStore` pulls in immer, reselect and redux whether you use them or not. It doesn't grow much as your app does, which is the point of a floor — 10.7 KB across two slices is a lot, and across forty is nothing.

(The first row is a fun artefact: gzip made the 173-byte file *bigger*, 176 bytes, because the gzip header costs more than the compression saves on tiny inputs. If you ever see a build report claiming a file grew when compressed, that's why.)

The runtime cost is the other half, and it's smaller than the bundle discussion suggests. 20,000 dispatches through a one-line reducer:

```
default middleware (both dev checks on)  → 36 ms = 1.8 µs per dispatch
dev checks disabled                      →  5 ms = 0.3 µs per dispatch
```

**0.3 microseconds per dispatch in production**, because both guards are development-only. So the 6× difference you can measure locally is not something your users pay — but it is worth knowing if a *development* session feels sluggish while a list dispatches per row. The fix there is to narrow the checks rather than remove them:

```js
middleware: (gdm) => gdm({
  immutableCheck: { ignoredPaths: ['bigTable'] },
  serializableCheck: { ignoredPaths: ['bigTable'] },
}),
```

At 0.3 µs, dispatch is never your bottleneck. Selectors that recompute and components that re-render are — which is what the first half of this guide measured.

![What each approach costs, measured](/deepdives/redux/what-it-costs.svg)

---

## When you don't need Redux

Most apps. Said plainly, because the measurements above make the case better than an opinion would.

**If your state is server data, you want a query library, not a store.** Fetching, caching, revalidation, dedup and loading states are what TanStack Query, SWR, or your framework's loaders do. Putting server data in Redux means hand-writing a cache — and the `condition` measurement above is the *only* part of that job Redux hands you for free. If you already have RTK, use **RTK Query** rather than writing thunks per endpoint.

**If your state is local, keep it local.** The React structure guide measured this: state pushed down to the component that needs it re-renders 1 component instead of 5. A store cannot beat that, and it adds a file.

**If you need shared state and nothing else, a nine-line store is 249 bytes gzipped.** `useSyncExternalStore` gives leaf subscriptions with no library, and Zustand gives the same with a nicer API for about 1 KB. You lose DevTools, time travel and middleware — decide whether you want them before paying 10.7 KB for them.

**Redux earns its place when you want the things only a reducer log gives you:** a serialisable history of every state transition, time-travel debugging, replaying a user's session from a bug report, middleware that can see every change in the app, and one file per feature that describes every way its state can change. Those are real, and no `useState` refactor gives them to you.

**And this site doesn't use it.** The frontend is Next.js with the app router; server state lives in server components and route handlers, and client state is local or in a small number of contexts. For ~40 modules that was the right call, and the same reasoning appears in the GraphQL and webpack guides: the interesting question is never "is this tool good", it's "does this application have the problem the tool solves".

---

## Typing it, in four lines

Redux with TypeScript has a reputation for ceremony that Redux Toolkit mostly removed. The whole setup is two types inferred from the store and two pre-typed hooks:

```ts
// app/store.ts
export const store = configureStore({
  reducer: { cart: cartReducer, auth: authReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```ts
// app/hooks.ts
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Then every component uses the typed hooks and gets full inference with no annotations:

```ts
const items = useAppSelector((s) => s.cart.items);   // inferred
const dispatch = useAppDispatch();                   // knows about thunks
```

Three things this buys that are easy to miss. `RootState` is derived from the store rather than hand-written, so adding a slice updates every selector's type automatically — a hand-maintained `RootState` interface is a file that silently goes stale. `AppDispatch` is what makes `dispatch(someThunk())` type-check and return a promise with `.unwrap()`; the untyped `useDispatch` doesn't know thunks exist. And `createSlice` infers the action payload type from the reducer's `PayloadAction<T>`, so the action creators are typed without a separate declaration:

```ts
reducers: {
  setCoupon(state, action: PayloadAction<string | null>) {
    state.coupon = action.payload;
  },
}
```

For selectors defined outside a component, type the state parameter and everything downstream follows:

```ts
export const selectTotal = (s: RootState) =>
  s.cart.items.reduce((a, i) => a + i.price, 0);
```

If a codebase has `any` in its selectors, that's usually a missing `withTypes` rather than a hard typing problem.

---

## A structure worth keeping

If you do use it, this is the layout that stays workable:

```
src/
  app/
    store.ts            configureStore, one file, no logic
  features/
    cart/
      cartSlice.ts      slice + selectors + thunks for THIS feature
      cartSelectors.ts  createSelector, when there are enough to move out
      CartPage.tsx
    auth/
      authSlice.ts
```

- **One slice per feature, next to the components that use it.** Not a `reducers/` directory — same argument as feature folders generally.
- **Selectors live with the slice**, and components import selectors rather than reaching into state shape. Then a state reshape touches one file.
- **`store.ts` only composes.** If it has an `if` in it, something belongs in a slice.
- **Never import a slice from another feature's slice.** Cross-feature reactions belong in a listener middleware or a shared slice.
- **Thunks handle orchestration, reducers handle state.** A reducer that calls anything asynchronous is a bug the dev-time guards won't catch.

---

## What I got wrong measuring this

Five, and the first is the one worth carrying away.

1. **"Redux Toolkit removes a lot of boilerplate."** Measured on the same two-action feature: **14 lines versus 13**, 500 characters versus 370. One line. The real benefits — no action constants to desync, no hand-written immutable updates, dev guards on by default — are about correctness, not volume. I'd have written the volume claim and it would have been wrong.
2. **Mutating state outside a reducer is caught by the immutability middleware.** It's caught earlier and better: RTK freezes state, so the assignment throws a `TypeError` at the exact line, before any dispatch. I was about to describe a warning that arrives one action later.
3. **`.unwrap()` throws your `Error`.** It throws a plain serialised **`Object`** — `e instanceof Error` is `false`. Check `e.message`.
4. **Three dispatches in one handler means three renders.** The store notified 3 times and the component rendered **once**, because react-redux is built on `useSyncExternalStore` and React batches. Store notifications and renders are different counters, and only one of them is the one you care about.

5. **"A `createSelector` that takes an argument thrashes its one-slot cache."** True on RTK 1, obsolete on RTK 2: six calls across three ids computed **three** times with the current default `weakMapMemoize`, and six times only when I explicitly configured the old `lruMemoize`. Version-dependent advice again — the same shape as the webpack CSS finding.

The thread connecting them: four of the five are cases where I assumed a *mechanism* from an outcome I'd read about. The freeze versus middleware, the serialised error versus the thrown one, the notification versus the render — in each case the outcome I expected was roughly right and the mechanism was different, which is exactly the kind of error that survives until something behaves unexpectedly and you have no model to debug it with.

---

## Cheat sheet

```js
// the four things you write
createSlice({ name, initialState, reducers, extraReducers })
createAsyncThunk('feature/verb', async (arg, thunkApi) => …, { condition })
createSelector([inputs], (…values) => derived)
configureStore({ reducer, middleware: (gdm) => gdm().concat(mw) })
```

| Symptom | Cause |
|---|---|
| component re-renders on every dispatch | selector returns a new object — memoise or read primitives |
| `createSelector` recomputes constantly | an input selector returns a new reference, or one cache slot is shared |
| `try/catch` around a dispatch catches nothing | `dispatch(thunk())` resolves; use `.unwrap()` |
| `e instanceof Error` is false in a thunk catch | RTK serialises errors to plain objects |
| `TypeError: Cannot assign to read only property` | you mutated state outside a reducer; RTK froze it |
| "non-serializable value detected" | a `Date`, `Map`, `File` or function in an action or state |
| stale data shown next to an error | the `rejected` case didn't clear it — decide explicitly |
| duplicate requests on mount | add `condition` to the thunk |
| thunks stopped working after a store change | `middleware` replaced instead of `gdm().concat(...)` |
| row components all re-render on one edit | store the list as `ids` + `entities` via `createEntityAdapter` |

---

## Where to go next

- **[How to Structure and Organize a React Application](/tech-trends/how-to-structure-and-organize-a-react-application)** — the render-scope table this guide extends, plus the state-boundary measurement that decides whether you need a store at all.
- **[How to Set Up webpack From Scratch](/tech-trends/how-to-set-up-webpack-from-scratch)** — how to check what a dependency really costs your bundle, including why `sideEffects: false` decides whether unused code disappears.
- **[Code Lab](/code-lab)** — graded exercises: write the reducer, then fix the selector that re-renders on every dispatch, then delete the store you didn't need.
