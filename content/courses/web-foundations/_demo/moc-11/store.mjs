// Milestone 11 starter: a tiny store. State is private (closure), changes are immutable,
// lookups use a Map, tags use a Set, input rules are regular expressions.
function createStore(initial) {
  let state = initial;                       // nobody outside can reassign this
  const listeners = new Set();
  return {
    get: () => state,
    update(change) {
      const next = change(state);
      if (next === state) return;            // nothing changed: nobody re-renders
      state = next;
      listeners.forEach((fn) => fn(state));
    },
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },   // returns "unsubscribe"
  };
}

const RULES = {
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  minutes: /^[1-9]\d{0,3}$/,
  email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
};
const valid = (rule, text) => RULES[rule].test(String(text));

const store = createStore({ recipes: [{ id: 1, name: 'Pho bo', tags: ['soup'] }] });
const unsubscribe = store.subscribe((s) => console.log('render:', s.recipes.map((r) => r.name).join(', ')));

const before = store.get();
store.update((s) => ({ ...s, recipes: [...s.recipes, { id: 2, name: 'Bun cha', tags: ['grill', 'pork', 'grill'] }] }));
console.log('old state untouched:', before.recipes.length, '| new state:', store.get().recipes.length);

store.update((s) => s);                      // same object back: no render line
store.update((s) => ({ ...s, recipes: s.recipes.map((r) => (r.id === 1 ? { ...r, name: 'Pho bo tai' } : r)) }));

const byId = new Map(store.get().recipes.map((r) => [r.id, r]));
console.log('byId.get(2):', byId.get(2).name, '| byId.has(99):', byId.has(99));
console.log('unique tags:', [...new Set(store.get().recipes.flatMap((r) => r.tags))]);

for (const [rule, text] of [['slug', 'pho-bo'], ['slug', 'Pho Bo'], ['minutes', '90'], ['minutes', '090'], ['email', 'an@example.com'], ['email', 'an@example']]) {
  console.log(rule, JSON.stringify(text), valid(rule, text));
}

unsubscribe();
store.update((s) => ({ ...s, recipes: [] }));
console.log('after unsubscribe the store has', store.get().recipes.length, 'recipes and printed no render line');
