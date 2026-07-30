Vue is usually explained with the word "magic". You change a variable, the screen changes, and the tutorial moves on. That's a bad way to learn a framework, because the first time the magic *doesn't* happen — the value updated and the screen didn't — you have nothing to debug with.

There is no magic. There's a `Proxy` that records which properties each function read, a compiler that annotates every dynamic node in your template with an integer, and a queue that runs once per microtask. All three are observable, so this guide observes them: every render count, dependency hit, patch flag, byte and millisecond below came out of a running program.

```
vue 3.5.40 · @vue/compiler-sfc 3.5.40 · @vue/server-renderer 3.5.40
react 19.2.8 · jsdom 29.1.1 · node 22.21.0
```

Six of those measurements contradicted something I was about to write. One of them contradicts a claim in half the "Vue 3 vs Vue 2" posts on the internet, and one of them contradicts an earlier measurement in this very lab — I've kept both, at the end.

---

## Reactivity is one question: who read this?

Start with the smallest possible comparison. A plain variable, and a `ref`, each watched by an effect:

```js
let plain = 0;
const count = ref(0);

watchEffect(() => { plain; plainRuns++; }, { flush: 'sync' });
watchEffect(() => { count.value; refRuns++; }, { flush: 'sync' });

plain = 1; plain = 2; plain = 3;
count.value = 1; count.value = 2; count.value = 3;
```

```
plain changed 3× → effect ran 1 time  (just the initial run)
ref changed 3×   → effect ran 4 times
```

Nothing surprising yet. What matters is *how* the second number happens, because that mechanism is the entire framework. When the effect ran the first time, Vue was watching: any property read while an effect is running gets recorded against that effect. When you write, Vue looks up that one property and runs only what it finds.

Which means tracking is **per property**, not per object:

```js
const state = reactive({ a: 1, b: 1, nested: { deep: 1 } });

watchEffect(() => { state.a; });               // reads a
watchEffect(() => { state.b; });               // reads b
watchEffect(() => { state.nested.deep; });     // reads deep
watchEffect(() => { JSON.stringify(state); }); // reads everything
```

| after | effect reading `a` | reading `b` | reading `nested.deep` | reading all |
|---|---|---|---|---|
| `state.a = 2` | +1 | +0 | +0 | +1 |
| `state.nested.deep = 2` | +0 | +0 | +1 | +1 |
| `state.a = 2` again (same value) | +0 | — | — | — |

Three things in that table are worth stopping on. Nested reads are tracked at the nested property, not at the parent — `state.nested.deep = 2` did not wake the effect that read `state.a`. `JSON.stringify(state)` woke up for both, correctly, because it really did read both. And writing the value that's already there ran nothing: the set trap compares first, so an idempotent write costs nothing but the comparison.

![How tracking works](/deepdives/vue/reactivity-tracking.svg)

Because the plumbing is a `Proxy` and not per-property getters, it also sees operations that the Vue 2 implementation structurally could not:

```js
const state = reactive({ a: 1 });
watchEffect(() => { Object.keys(state).length; });  // iteration
watchEffect(() => { state.brandNew; });            // a key that doesn't exist
```

```
adding a new key    → iterating effect +1   effect reading that key +1
deleting it         → iterating effect +1   effect reading that key +1
'brandNew' in state → false
```

An effect can depend on a property that doesn't exist yet, and on the *set of keys* rather than any one key. In Vue 2 both of those needed `Vue.set`. Arrays get the same treatment, and the granularity is finer than people expect:

```js
const list = reactive(['a', 'b']);
```

| operation | effect reading `.length` | reading `[0]` | reading `join('')` |
|---|---|---|---|
| `list.push('c')` | +1 | +0 | +1 |
| `list[0] = 'z'` | +0 | +1 | +1 |
| `list.length = 1` | +1 | +0 | +1 |

`push` did not disturb the effect that only reads `list[0]`. That's not an optimisation Vue applied on purpose so much as a consequence of tracking reads honestly.

And `reactive()` is lazy, which is the part that actually pays for the Proxy. Building a 1,000-row tree, each row with ten keys and a nested object:

```
reactive() on the whole tree            : 0.31 ms
walking it up front with defineProperty : 5.39 ms   (Vue 2's approach)
                                          17× more
```

```js
const raw = makeTree();
const p = reactive(raw);
isReactive(raw.rows[500]);          // false — not converted yet
void p.rows[500].meta.author;       // touch it
isReactive(p.rows[500]);            // true — proxy created on read
isReactive(raw.rows[500]);          // false — the raw object stays raw
```

Row 500 became a proxy at the moment it was read, and not before. A list where the user only ever expands three rows never pays for the other 997.

---

## `ref` or `reactive`

Both wrap state; they are not interchangeable, and the reasons are mechanical rather than stylistic.

`ref` is a class with a getter and a setter. `reactive` is a `Proxy`. That difference shows up in a benchmark of two million writes:

```
plain object            .n++      1.3 ns
defineProperty accessor .n++      3.2 ns    ← Vue 2's mechanism
bare Proxy, empty traps .n++    182.2 ns
shallowReactive         .n++    272.7 ns
reactive                .n++    290.1 ns
reactive + 1 effect     .n++    328.6 ns
ref                     .value++ 22.5 ns
```

A `ref` write is **thirteen times cheaper** than a `reactive` property write, because it never goes through a Proxy. And look at the third row: a `Proxy` whose traps do nothing but `Reflect.get`/`Reflect.set` already costs 182 ns. About 62% of `reactive`'s cost is the language feature, not Vue's bookkeeping. There is nothing Vue can do about that number.

Second difference: a `ref` can be replaced wholesale, and a `reactive` cannot.

```js
asRef.value = { user: { name: 'b' } };          // effect fires: +1
Object.assign(asReactive, { user: { name: 'b' } });  // effect fires: +1
state = { user: { name: 'b' } };                // rebinds a local variable
```

The third line is the one that bites. Assignment replaces your *binding*; the proxy other code is holding is untouched. There is no version of `reactive` where that works, because it would require JavaScript to intercept assignment to a variable. `Object.assign` works, and so does `ref`, which is the practical argument for making `ref` the default: the "we fetched new data, replace everything" case is a one-liner.

Refs unwrap automatically inside a reactive object — but not inside arrays or Maps:

```js
const inner = ref(1);
const state = reactive({ inner, list: [inner], map: new Map([['k', inner]]) });
```

```
state.inner          → 1              isRef → false   (unwrapped)
state.list[0]        → still a ref, you need .value
state.map.get('k')   → still a ref
state.inner = 5      → inner.value is now 5   (writes through)
```

That inconsistency is real and it is the single most common source of `[object Object]` in a Vue template. The rule is: unwrapping happens for plain-object properties only.

The shallow variants stop the recursion, which is what you want for a chart instance or a big immutable payload:

```
mutating .value.n     → ref: +1    shallowRef: +0
triggerRef(shallowRef)→ +1
replacing .value      → +1
isReactive(shallowReactive(x).nested) → false
```

And `markRaw` opts an object out entirely — `isReactive(state.heavy)` stays `false` after you put a `markRaw`'d object into a reactive one. Use it for third-party instances you never want proxied.

---

## The destructure trap, and the half of it that isn't true

"Don't destructure a reactive object" is the first rule everyone learns. It's also, measured, only half right — which is exactly why it stays confusing.

The half that's true:

```js
const state = reactive({ n: 0 });
const { n } = state;

watchEffect(() => { void n; });        // effect A
watchEffect(() => { void state.n; });  // effect B

state.n = 1; state.n = 2;
```

```
effect A (destructured) → ran 1 time    (the initial run, then nothing)
effect B (state.n)      → ran 3 times
```

The destructuring read `state.n` once, got the number `0`, and stored it in a `const`. Numbers don't have identity; there is nothing left for the proxy to intercept. `toRefs` exists for this — it hands you a ref per key instead of a value per key:

```js
const { count: broken } = state;
const { count: live } = toRefs(state);
```

```
destructured directly → +0   value read: 0
via toRefs            → +1   value read: 1
```

Now the half that isn't true:

```js
const state = reactive({ nested: { deep: 1 }, list: [1, 2] });
const { nested, list } = state;   // destructuring objects, not primitives

state.nested.deep = 2;
state.list.push(3);
```

```
effect reading nested.deep → +1   (still reactive)
effect reading list.length → +1   (still reactive)
```

Destructuring an object or array property gives you the **child proxy**, and it keeps working forever. So a beginner who destructures `const { user, items } = state` sees everything behave perfectly, concludes the warning is folklore, then destructures `const { count } = state` a week later and loses an afternoon. The rule isn't "never destructure reactive" — it's "destructuring a **primitive** takes a snapshot".

### Props are the same trap with a compiler on top

This component works:

```vue
<script setup>
const { max = 10 } = defineProps({ max: Number })
</script>
<template><b>max={{ max }}</b></template>
```

```
initial          : max=1
parent changed it: max=2   → UPDATES
```

This one, which looks like the same code, does not:

```js
const B = {
  props: { max: Number },
  setup(props) {
    const { max } = props;    // snapshot
    return { max };
  },
  template: `<b>max={{ max }}</b>`,
};
```

```
initial            : max=1
after 2 changes    : max=1   → BROKEN
```

Same destructure, opposite outcome, and the difference is not in Vue's runtime at all. Run the first one through the compiler and there is no local variable:

```js
props: /*@__PURE__*/_mergeDefaults({ max: Number }, { max: 10 }),
setup(__props, { expose: __expose, emit: __emit }) {
  const left = computed(() => __props.max - n.value)
  if (n.value >= __props.max) emit('done')
```

Every use site was rewritten to `__props.max`, and the default moved into a `_mergeDefaults` call on the props option. The "reactive props destructure" feature that Vue 3.5 made stable is a **source transform**. It exists inside `<script setup>` and nowhere else — not in a hand-written `setup()`, not in a plain `.js` composable, not in a render function.

The fixes for hand-written `setup` are all one line, and all equivalent:

```js
setup: (props) => ({ shown: toRefs(props).max })          // a ref per key
setup: (props) => ({ shown: computed(() => props.max) })  // a getter
// or: don't destructure — a prop declared in `props` is already in the template
```

```
initial     : toRefs=1 getter=1 props=1
after change: toRefs=2 getter=2 props=2
```

---

## `computed`: the cache is the whole feature

`computed` is often introduced as "a nicer method". It is a cache with a dependency-driven invalidation, and every part of that sentence is measurable.

```js
let computes = 0;
const count = ref(1);
const doubled = computed(() => { computes++; return count.value * 2; });
```

```
created, not yet read     → computed 0 times   (lazy)
read 5× with no change    → computed 1 time
dependency changed, unread→ computed 1 time    (still lazy)
read again                → computed 2 times
```

Four states, and only one of them does work. Put it next to a method in a template that uses each three times:

```vue
<i>{{ totalComputed }} {{ totalComputed }} {{ totalComputed }}</i>
<u>{{ totalMethod() }} {{ totalMethod() }} {{ totalMethod() }}</u>
```

```
after 1 render        : computed 1 · method 3
re-render, list same  : computed 1 · method 6
re-render, list CHANGED: computed 2 · method 9
```

The method is called on every render, every time it appears. The computed is evaluated once per actual change, no matter how many places read it. For a `reduce` over a cart, that is the difference between three passes per keystroke and zero.

There's a subtler behaviour that arrived in Vue 3.4 and is worth knowing because it silently deletes work:

```js
const isBig = computed(() => count.value > 5);
watchEffect(() => { isBig.value; effectRuns++; }, { flush: 'sync' });
```

```
count 2 → 3 → 4 → 5, computed stays false → effect ran +0 times
count 5 → 6, computed flips false → true  → effect ran +1 time
```

Three dependency changes, zero downstream effect runs, because the computed's *value* never changed. A computed is therefore a legitimate tool for narrowing a noisy signal into a stable one: `computed(() => items.length > 0)` re-renders on the transition between empty and non-empty, and not on any other list edit.

---

## What the compiler actually emits

A `.vue` file is not a runtime concept. It's an input to three compilers, and the output is a plain object. `parse()` splits it:

```
parse errors  : 0
script setup? : true (lang: js)
template      : 5 lines
style         : 1 block, scoped=true
line ranges   : script 1-14 · template 16-22
```

`compileScript()` produces the `setup` function shown earlier, plus something you can't get any other way — the compiler's map of what every identifier in your script *is*:

```json
{"label":"props","max":"props","ref":"setup-const","computed":"setup-const",
 "emit":"setup-const","n":"setup-ref","left":"setup-ref","bump":"setup-const"}
```

That map is why templates don't need `.value`. The compiler knows `n` is a `setup-ref` and emits the unwrap for you. It is also why the same expression pasted into a `.js` file breaks: there was never any runtime unwrapping to inherit.

`compileTemplate()` is where the interesting output is:

```js
const _hoisted_1 = { class: "counter" }
const _hoisted_2 = ["disabled"]

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("section", _hoisted_1, [
    _cache[1] || (_cache[1] = _createElementVNode("h3", null, "Counter", -1)),
    _createElementVNode("p", null,
      _toDisplayString($props.label) + ": " + _toDisplayString($setup.n),
      1 /* TEXT */),
    _createElementVNode("button", {
      disabled: $setup.left === 0,
      onClick: _cache[0] || (_cache[0] = $event => ($setup.bump()))
    }, "+1", 8 /* PROPS */, _hoisted_2)
  ]))
}
```

Read the trailing integers. They are the contract between compiler and runtime: `1` means only the text can change, `8` means only the listed props can, `-1` means nothing can and the node is cached in `_cache`. The full set, read out of the runtime rather than copied from a blog post:

```
    1  TEXT              64  STABLE_FRAGMENT
    2  CLASS            128  KEYED_FRAGMENT
    4  STYLE            256  UNKEYED_FRAGMENT
    8  PROPS            512  NEED_PATCH
   16  FULL_PROPS      1024  DYNAMIC_SLOTS
   32  NEED_HYDRATION  2048  DEV_ROOT_FRAGMENT
```

![From SFC to render function](/deepdives/vue/sfc-to-render.svg)

Static content is hoisted out of the function body entirely — `const _hoisted_1 = { class: "counter" }` is created once per module, not once per render. The event handler gets the same treatment via `_cache[0]`, which is why an inline arrow in a Vue template doesn't cause the re-render problem that an inline arrow in JSX does.

Scoped styles are a source rewrite too, and the placement of the attribute selector matters:

```
.counter { padding: 8px }      →  .counter[data-v-abc123] { padding: 8px }
.counter h3 { color: teal }    →  .counter h3[data-v-abc123] { color: teal }
```

The attribute lands on the **last** compound selector. That's why a scoped rule can't reach into a child component's internals — the child's elements carry the child's scope id — and why `:deep()` exists.

### Directives are sugar, and the sugar is legible

The most useful thing you can do with the compiler is check your mental model of a directive against its output. `v-model` on an input:

```js
_withDirectives((_openBlock(), _createElementBlock("input", {
  "onUpdate:modelValue": $event => ((_ctx.name) = $event)
}, null, 8 /* PROPS */, _hoisted_1)), [
  [_vModelText, _ctx.name]
])
```

There is no `:value` binding in there. The usual shorthand — "`v-model` is just `:value` plus `@input`" — is wrong in a way you can see: the vnode carries an `onUpdate:modelValue` prop and a `_vModelText` **runtime directive**, and it's the directive that writes `el.value`. That's what makes IME composition work (the directive ignores input events while `isComposing` is true), and modifiers ride along in a fourth slot rather than wrapping the handler:

```js
[_vModelText, _ctx.age, void 0, { number: true, trim: true }]
```

`v-if` compiles to a nested ternary where each branch is explicitly keyed:

```js
(_ctx.a)
  ? (_openBlock(), _createElementBlock("p", { key: 0 }, "A"))
  : (_ctx.b)
    ? (_openBlock(), _createElementBlock("p", { key: 1 }, "B"))
    : (_openBlock(), _createElementBlock("p", { key: 2 }, "C"))
```

Those keys are the compiler stopping the runtime from reusing branch A's `<p>` for branch B. `v-show` is a different thing entirely:

```js
_withDirectives((_openBlock(), _createElementBlock("p", null, "hello",
  512 /* NEED_PATCH */)), [[_vShow, _ctx.on]])
```

The element is always created, always in the DOM, and a directive toggles `display`. `NEED_PATCH` is the flag that says "this node has no dynamic bindings but still needs to be visited". `v-if` vs `v-show` isn't a style preference; one is a branch in the render function and the other is a CSS property.

And `v-for`, with the difference this guide will measure in a minute:

```js
_createElementBlock(_Fragment, null, _renderList(_ctx.items, (i) => {
  return (_openBlock(), _createElementBlock("li", { key: i.id },
    _toDisplayString(i.text), 1 /* TEXT */))
}), 128 /* KEYED_FRAGMENT */)
```

Drop the `:key` and the only change in the output is `256 /* UNKEYED_FRAGMENT */`. One integer selects between two different diff algorithms.

---

## Rendering: who runs again

`setup()` runs once per component instance. The render function runs once per update. That single sentence explains most of the difference between Vue and React, and it's easy to verify with two independent counters — a probe called from inside the template, and the `updated` lifecycle hook:

```
after mount    : setup Root=1 Child=1 · render Root=1 Child=1
after 3 bumps  : setup Root=1 Child=1 · render Root=2 Child=2
updated hook   : Root=1 Child=1      (agrees with the render counter)
```

Three writes, one extra render, and `setup` never ran again. Anything expensive you do in `setup` — build a formatter, open a connection, compute a lookup table — happens once. Anything in the render function happens on every update.

Two consequences fall straight out:

```
changing a ref no template reads ×2 → renders: +0
changing a ref the template reads ×1 → renders: +1
```

```
100 mutations in one handler → 1 render
```

State nobody reads costs nothing to change. And the queue deduplicates: a hundred `n.value++` in a loop produce exactly one render. But that render hasn't happened yet when your handler returns:

```
immediately after 100 ++ : renders +0, DOM = "0"
after await nextTick()   : renders +1, DOM = "100"
```

![One state change, end to end](/deepdives/vue/update-path.svg)

This is the number one "Vue is broken" bug report, and the fix is `await nextTick()`. But it's worth being precise about what `nextTick` is, because I was about to write something looser. Queue four continuations right after a write:

```
1. immediately after the write  DOM=0
2. queueMicrotask               DOM=1
3. Promise.then                 DOM=1
4. nextTick callback            DOM=1
5. setTimeout                   DOM=1
```

The DOM was already updated in the *first* plain microtask. Vue schedules the flush with a resolved promise at the moment of the write, so anything you queue afterwards lands behind it. Reverse the order and the illusion breaks:

```
1. microtask queued BEFORE the write  DOM=0
2. microtask queued AFTER the write   DOM=1
3. await nextTick()                   DOM=1
```

So "the DOM is stale until `nextTick`" is not quite the rule. The rule is: the flush is a microtask, `nextTick()` returns a promise chained *onto that flush*, and it is therefore the only version that's correct regardless of when you ask. (If microtask ordering isn't second nature, the [event loop guide](/tech-trends/the-event-loop-callbacks-promises-and-async-await) is the prerequisite for this paragraph.)

Watchers slot into that same flush at three different points, and the DOM value proves where:

| step | DOM at that moment |
|---|---|
| `watch(…, { flush: 'sync' })` | old |
| `watch(…, { flush: 'pre' })` — the default | old |
| `onBeforeUpdate()` | old |
| render + patch | — |
| `watch(…, { flush: 'post' })` | new |
| `onUpdated()` | new |

If a watcher measures an element, it needs `flush: 'post'`. A watcher with the default `pre` flush that calls `getBoundingClientRect()` reads the previous frame's geometry, and that bug looks like a race condition when it's actually a documented ordering.

### How much DOM does one text change touch?

The patch flag says only the text can change. Counting real mutation records with a `MutationObserver`, in a card with seven elements:

```
<span>Count: {{ n }}</span> → childList 1 (1 added, 1 removed) · charData 0
<span>{{ n }}</span>        → childList 1 (1 added, 1 removed) · charData 0
v-if toggling the block     → childList 7 (1 added, 6 removed)
```

One operation versus seven. Note what it *isn't*, though: not a `characterData` mutation. Vue sets `el.textContent`, and per spec that setter replaces the element's children with one new text node — so it registers as a `childList` change, not an edit to the existing text node. I had written "it rewrites one text node's value"; the observer disagreed, and the observer is right.

Static content really is untouched. Tracking the identity of a hoisted `<h3>` across three renders:

```
distinct <h3> nodes ever seen: 1
```

---

## Keys, measured

Everyone knows to add `:key`. Fewer people know what it buys, and the usual explanation — "otherwise Vue recreates the DOM nodes" — turns out to be wrong.

A list of three rows, each row a component with its own local state (an unsaved input), and the user has typed `xxx` into row `a`. Then a new row is prepended:

| | row renders | old `<li>` reused | where `xxx` ended up | DOM text ops |
|---|---|---|---|---|
| no key | 4 | 3/3 | row **NEW** | 3 |
| `:key="i.id"` | 1 | 3/3 | row **a** | 0 |

The DOM nodes were reused in both cases — three out of three. So keys are not about node recreation. What moved was the *component state*: without a key, Vue patched position-by-position, so the component that used to render `a` now renders `NEW`, and its `draft` ref went along for the ride. The user's half-typed text is now attached to the wrong item, with no error anywhere.

Scale that up. A thousand rows, prepend one, count the row render function calls:

```
Vue, :key="r.id"  →    1
Vue, no key       → 1001
```

One integer in the compiled output — `128 /* KEYED_FRAGMENT */` versus `256` — decides between those two numbers.

---

## Vue and React, side by side

Same tree, same jsdom, same Node process. A root with three children: one whose prop changes, one whose prop doesn't, one with no props at all. Change the root's state once:

| component | Vue | React |
|---|---|---|
| Root | +1 | +1 |
| child with a changed prop | +1 | +1 |
| child with an unchanged prop | **+0** | **+1** |
| child with no props | **+0** | **+1** |
| unchanged-prop child wrapped in `memo()` | — | +0 |

![Who runs again](/deepdives/vue/who-runs-again.svg)

And the list version, which is the same finding with a bigger number:

```
Vue, keyed        →    1        React + memo()  →    1
Vue, no key       → 1001        React, plain    → 1001
```

That symmetry is the honest way to state the difference. **Vue's default is React-with-`memo()`-everywhere**, and forgetting `:key` in Vue costs precisely what forgetting `memo()` costs in React. Neither framework can do anything the other can't; they differ in which behaviour you get for free and which you have to ask for. React's compiler is closing that gap from the other side.

The consequence that's easy to underrate is where state can live. A `ref` declared at module scope, read by one deep component:

```js
const sharedCount = ref(0);   // module scope, no provider, no store
```

```
sharedCount.value++ → Root +0 · Middle +0 · Reader +1
```

The component that reads it re-renders. Its parent doesn't. The component between them doesn't. There is no context, no provider, no selector and no store — and no "everything under the provider re-renders" problem to design around. That is why Vue codebases reach for a global store later than React codebases do, and why [the state-boundary question that shapes React folder structure](/tech-trends/how-to-structure-and-organize-a-react-application) has a different answer here.

### Bytes

Same counter button, bundled with esbuild, minified, `NODE_ENV=production`:

| bundle | raw | gzip |
|---|---|---|
| `@vue/reactivity` only, hand-wired to the DOM | 12,865 B | **4,974 B** |
| Vue, runtime only, options API disabled | 52,289 B | **21,004 B** |
| Vue, runtime only, options API enabled | 60,407 B | **24,243 B** |
| React + react-dom | 192,188 B | **60,040 B** |
| Vue including the runtime template compiler | 179,055 B | **67,317 B** |

Two lines deserve attention. The first: Vue's reactivity is publishable on its own — five kilobytes gzipped, no components, no vdom, usable in any codebase. The last: shipping the template compiler to the browser nearly triples the bundle. If you write templates as strings at runtime, or use the CDN build, that's the bill. Precompiled templates via `@vitejs/plugin-vue` don't pay it. (For how to see this in your own bundle instead of taking my word for it, the [webpack guide](/tech-trends/how-to-set-up-webpack-from-scratch) covers reading a bundle honestly.)

### Time, with the caveats it deserves

A thousand-row list, seven iterations, each framework in **its own Node process**, median reported:

| | mount 1,000 rows | prepend one row |
|---|---|---|
| Vue, runtime-compiled template | 45.4 ms | 1.1 ms |
| Vue, precompiled render function | 41.9 ms | 1.2 ms |
| React | 13.8 ms | 6.4 ms |

React mounts faster; Vue updates faster. Both directions follow from the render-count table: React's mount is a leaner code path, and Vue's update calls one component function where React calls 1,001.

Now the caveat, because these numbers are the weakest measurements in this guide. This is jsdom, not a browser — no layout, no paint, no style recalculation, which is where most real time goes. The per-iteration spread is enormous: React's seven mounts were `43.7 33.9 25.2 13.8 10.8 8.9 8.5`, a 5× improvement as the JIT warms up. Any single-run number here would have been mostly noise, which is exactly how I got the wrong answer the first time (below).

---

## SSR and hydration

`renderToString` runs the same components with no DOM:

```
HTML : <main id="v-0"><h1>41</h1><p>doubled: 82</p><button>+1</button></main>
bytes: 74
server hooks that ran: ["onServerPrefetch"]     ← onMounted did NOT
```

`onMounted` never fires on the server, which is the correct place to put anything that touches `window`. `onServerPrefetch` does, and it can await — that's how the HTML above came to contain `41` instead of the initial `1`.

Which sets up the classic SSR bug. Hydrate that exact HTML with a client app that doesn't know what the server fetched:

```
(a) client doesn't know what the server fetched
    server sent <h1>41</h1> → after hydration <h1>1</h1>
    warnings: 3 — [Vue warn]: Hydration text content mismatch
    server nodes kept: <main> true · <h1> true

(b) client gets the state back via __INITIAL_STATE__
    server sent <h1>41</h1> → after hydration <h1>41</h1>
    warnings: 0
```

In case (a) the user watches the correct number get replaced by a wrong one. Not a crash, not a blank page — a visible regression plus console noise. Serialising server state into the page and using it to initialise the client app is not an optimisation; it's what makes hydration mean anything.

Also worth noting from that output: `<main>` and `<h1>` are the **same DOM nodes** before and after hydration, even in the mismatching case. Vue patched the text in place. I expected it to discard the server subtree and re-render, which is closer to what React 18 does on a mismatch — measured, Vue kept the nodes.

Clicking the button afterwards moved the counter, and the `<h1>` was still the same node, which is the actual proof that hydration attached listeners to server-rendered elements rather than replacing them.

Two smaller things. `useId()` returns the same id across independent server renders (`v-0` both times), so ids can't be a mismatch source. And SSR's byte cost is smaller than people assume:

```
  10 rows → HTML    235 B · same data as JSON    311 B · 0.76×
 100 rows → HTML   2215 B · same data as JSON   3281 B · 0.68×
1000 rows → HTML  22915 B · same data as JSON  34781 B · 0.66×
```

The HTML is *smaller* than the JSON of the same data — tags repeat and compress; JSON repeats keys. The real cost of SSR-plus-hydration is that you ship **both**: the HTML to show something immediately, and the data to make it interactive.

---

## Composables, injection, lifecycle

Lifecycle order, measured rather than recited:

```
MOUNT                UPDATE                 UNMOUNT
parent setup         parent beforeUpdate    parent beforeUnmount
parent beforeMount     child beforeUpdate     child beforeUnmount
  child setup          child updated          child unmounted
  child beforeMount  parent updated         parent unmounted
  child mounted
parent mounted
```

Parents start first and finish last. A parent's `mounted` is the earliest point at which the whole subtree exists — which is why data fetching in `mounted` on a parent is a waterfall, and why fetching in each child's `setup` is not.

A composable is a function that calls Vue's reactivity APIs. The distinction that trips people up isn't in the API, it's in where the `ref` is declared:

```js
const sharedCount = ref(0);                    // OUTSIDE — one state, shared
function useSharedCounter() {
  return { count: sharedCount, inc: () => sharedCount.value++ };
}

function useLocalCounter() {
  const count = ref(0);                        // INSIDE — one state per caller
  return { count, inc: () => count.value++ };
}
```

Four components, two using each:

```
initial       : A=0 B=0 C=0 D=0
A.inc + C.inc : A=1 B=1 C=1 D=0
```

`B` followed `A`. `D` ignored `C`. Same word, two completely different semantics, and nothing in the call site tells you which one you imported. Name them accordingly — a composable that shares state is a store, and `useSomething()` is a poor name for a store.

`provide`/`inject` is reactive if and only if you provide something reactive:

```js
provide('theme', theme);   // a ref
provide('plain', plain);   // a plain string
```

```
initial      : theme=light plain=x
after change : theme=dark  plain=x
extra renders: Root +0 · Middle +0 · Deep +1
```

The provider itself didn't re-render, the component in between didn't re-render, and the injecting descendant did. Compare that to a React context, where every consumer under the provider re-renders on a new value — the fine-grained tracking makes injection cheap enough to use casually.

Vue 3.5's `onWatcherCleanup` handles the out-of-order-response problem without an `AbortController` dance:

```js
watch(q, (val) => {
  const ctl = start(val);
  onWatcherCleanup(() => ctl.abort());
});
```

```
query changed 3× → started: [b, c, d] · cleaned up: [b, c]
```

Every run cleans up the one before it, so a slow response for `b` can't land after `d`.

### `watch` is lazy, and passing it an object means something different

`watchEffect` runs immediately and re-runs on anything it read. `watch` waits:

```js
watch(() => state.a, () => { runs++; }, { flush: 'sync' });
```

```
watch created, nothing changed yet → callback ran 0 times
state.a = 2                        → 1
state.b = 2                        → 1   (not in the getter)
```

But pass the reactive object itself instead of a getter and the semantics change:

```js
watch(state, () => { deepRuns++; });   // no getter
```

```
changing state.b → 1
```

Passing a reactive object makes the watcher **implicitly deep** — it fires on any property, at any depth. That's convenient for a form and expensive for a large tree, and the two spellings look almost identical in review.

### Effects clean themselves up

Watchers created during `setup` belong to the component and stop when it unmounts. Verified rather than assumed, because the alternative is a leak:

```
still mounted, ref changed → effect ran 2 times
after unmount, ref changed → +0
```

Outside a component you own that lifetime, and `effectScope` is how you keep it manageable:

```js
const scope = effectScope();
scope.run(() => {
  watchEffect(() => { count.value; runs++; });
  watchEffect(() => { count.value; runs++; });
});
```

```
2 effects in the scope, count++ → 4 runs total (2 initial + 2)
after scope.stop(), count++     → +0
```

That's the mechanism a Vue store is built on: one scope, stopped in one call.

`onErrorCaptured` gives you the error, the instance, and a string naming what was running:

```
caught 1 error: boom in handler · info="native event handler"
app still alive, DOM: <div><button>boom</button></div>
```

That `info` string is the most useful part and the least known — it distinguishes a failing render from a failing watcher from a failing event handler, which are three different bugs.

One last composable pattern worth measuring, because it's the one people get wrong:

```js
function useStored(key, initial) {
  const raw = localStorage.getItem(key);
  const state = ref(raw === null ? initial : JSON.parse(raw));
  watch(state, (v) => localStorage.setItem(key, JSON.stringify(v)));
  return state;
}
```

```
initial            : DOM=14 · localStorage=null
after bigger()     : DOM=16 · localStorage=16
calling it again   : 16     (reads back the stored value)
same ref, though?  : false  ⇒ each call creates a NEW ref
```

It reads back correctly, so it looks shared — but two components calling it hold two refs, and they only agree because `localStorage` is between them. Change one and the other won't update until it remounts. If you want them synchronised, the `ref` has to move outside the function, and now you're back at the previous section's distinction.

---

## When not to use Vue

This site doesn't. It's Next.js with the app router, React server components and a fair amount of server-only rendering, and Vue was never a candidate for it — not because of anything measured above, but because the framework decision here was really a *meta-framework* decision, and the routing, streaming and server-component model was the thing being chosen. Vue's equivalent (Nuxt) is a good answer to the same question; it just wasn't this project's answer. Vue is taught here in Code Lab and shows up as four domains in the interview simulator, and that's the extent of it.

More generally, the measurements above are not an argument for switching. If a team knows React, "the unchanged-prop child doesn't re-render" is worth less than everything they already know about React's ecosystem, hiring pool and existing code. Frameworks are rarely the bottleneck; the thing that decides project outcomes is usually the shape of the data layer.

Vue's real friction points, since a guide that only lists strengths is an advertisement:

- **Two API styles in the documentation.** Options API and Composition API are both current and both supported. Practically, this means a good fraction of the Vue answers you find online are for the other one, and copy-pasted code doesn't compose. Pick Composition API for new work and read the toggle in the docs before trusting a snippet.
- **The compiler is load-bearing.** Prop destructuring, `defineProps`, `defineModel`, template ref unwrapping — all compiler features. Move that code into a plain `.js` file and it silently stops working, as measured above. React has less of this asymmetry because JSX is a much thinner transform.
- **Templates are strings to your tooling.** Vue's TypeScript support in templates is genuinely good now, but it depends on `vue-tsc` and an editor plugin rather than falling out of `tsc`. An unusual build setup can leave you with untyped templates and no error telling you so.
- **Smaller ecosystem in the long tail.** The core libraries are excellent. A niche integration is more likely to have a React version only.

---

## What I got wrong measuring this

Six, ordered by how much they'd have cost a reader.

1. **"Vue 3's Proxy reactivity is faster than Vue 2's `defineProperty`."** I believed this and it's backwards. Per write: `defineProperty` **3.2 ns**, `reactive` **290 ns** — about 90× slower. What Proxy bought was *correctness* (new keys, `delete`, array indices, `Map`/`Set`) and a **17×** faster initialisation (0.31 ms vs 5.39 ms on a 1,000-node tree) because conversion became lazy. A bare Proxy with do-nothing traps already costs 182 ns, so most of that gap is the language, not the library. "Faster" was the wrong word for a real improvement.
2. **"Don't destructure a reactive object."** Only true for primitives. Destructuring a nested object or array yields the child proxy and stays reactive indefinitely — measured, +1 effect run both times. The rule I'd have written would have made readers distrust code that works.
3. **"`v-model` is `:value` plus `@input`."** The compiled vnode has no `value` prop at all: it's an `onUpdate:modelValue` prop plus a `_vModelText` runtime directive, with modifiers passed as a fourth argument to the directive. The distinction matters because the directive is what handles IME composition — the "just sugar" version of the story predicts broken Japanese input, and Vue isn't broken there.
4. **Precompiling templates makes mounting measurably faster.** My first run said it saved 8 ms on a 1,000-row mount, which was suspicious given that compiling both templates took 0.9 ms. It was suspicious because it was wrong: both frameworks were sharing one process, and the second measurement inherited a warm JIT. Re-run one process per variant, seven iterations, median — the difference disappeared (45.4 ms vs 41.9 ms, inside the noise). The lesson isn't about Vue. It's that a benchmark whose result is bigger than the work it measures is measuring something else.
5. **"A hydration mismatch makes Vue throw away the server-rendered subtree."** The `<h1>` was the same DOM node before hydration, after hydration, and after a click. Vue patched the text in place and logged. My model came from React 18's behaviour and I'd have stated it as a general fact about hydration.
6. **"Vue writes one text node's value when the text changes."** The `MutationObserver` recorded a `childList` change with one node added and one removed, and zero `characterData` changes — because `el.textContent = v` replaces children by specification. One DOM operation either way, but not the operation I claimed.

The pattern across them: five of the six are cases where I had the *outcome* roughly right and the *mechanism* wrong. That's the class of error that survives review, because nothing looks incorrect until the day the mechanism is what you need to reason about.

---

## Cheat sheet

```js
// state
ref(0)                    // default choice; .value; replaceable wholesale
reactive({})              // no .value; per-property Proxy; cannot be replaced
shallowRef / shallowReactive   // stop at the first level
toRefs(props)             // reconnect after destructuring
markRaw(instance)         // never proxy this

// derived and reactions
computed(() => …)         // cached, lazy, only notifies when the VALUE changes
watch(src, cb, { flush }) // lazy; 'pre' (default) | 'post' | 'sync'
watchEffect(fn)           // runs immediately, re-runs on any dependency
onWatcherCleanup(fn)      // cancel the previous run
await nextTick()          // past the flush; the DOM is current here
```

| Symptom | Cause |
|---|---|
| value changed, template didn't | destructured a primitive out of `reactive`/`props` |
| `[object Object]` in the template | a ref inside an array or `Map` — refs only unwrap on plain-object properties |
| reading the DOM gives the old value | you read before the flush; `await nextTick()` |
| `getBoundingClientRect` is one frame stale | watcher is on the default `pre` flush; use `flush: 'post'` |
| a helper recomputes on every render | it's a method, not a `computed` |
| replacing state does nothing | assigned to a `reactive` binding; use `ref`, or `Object.assign` |
| typed text jumps to the wrong list row | missing `:key`, so component state was patched by position |
| hydration mismatch warnings | server state never reached the client app |
| `window is not defined` on the server | browser API in `setup`; move it to `onMounted` |
| bundle 3× bigger than expected | shipping the runtime template compiler |
| a composable's state isn't shared | its `ref` is declared inside the function |
| child re-renders on every parent update | it's React, and the child isn't in `memo()` |

---

## Where to go next

- **[How to Structure and Organize a React Application](/tech-trends/how-to-structure-and-organize-a-react-application)** — the render-scope measurements this guide compares against, and the state-boundary question that both frameworks make you answer.
- **[The Event Loop, Callbacks, Promises and Async/Await](/tech-trends/the-event-loop-callbacks-promises-and-async-await)** — `nextTick` is a microtask, and the flush ordering above is unreadable without this.
- **[Code Lab](/code-lab)** — graded exercises on the Vue track: write the reactive form, then fix the component that stopped updating after someone destructured its props.
