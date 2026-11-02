// Lesson 9.3 — a union of shapes told apart by one field ("discriminated union")
type LoadState =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; items: string[] };

function render(state: LoadState): string {
  switch (state.kind) {
    case 'loading':
      return 'Loading…';
    case 'error':
      return 'Error: ' + state.message;            // here TypeScript knows state has message
    case 'done':
      return state.items.length + ' items';        // and here, items
  }
}
console.log(render({ kind: 'error', message: 'HTTP 404' }));
console.log(render({ kind: 'done', items: ['Pen', 'Mug'] }));

type LoadState2 = LoadState | { kind: 'empty' };   // later someone adds a state…
function render2(state: LoadState2): string {
  switch (state.kind) {
    case 'loading': return 'Loading…';
    case 'error': return 'Error: ' + state.message;
    case 'done': return state.items.length + ' items';
    default: {
      const unhandled: never = state;               // …and the compiler points at every switch that forgot it
      return unhandled;
    }
  }
}
