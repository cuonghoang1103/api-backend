// A tiny imitation of how React decides whether to re-render: Object.is(old, new)
let state = { items: ['milk'] };
function setState(next) {
  if (Object.is(next, state)) {
    console.log('  same reference -> React skips the re-render');
    return;
  }
  state = next;
  console.log('  new reference  -> re-render with', JSON.stringify(state.items));
}

console.log('mutate, then set the same object:');
state.items.push('eggs');
setState(state);

console.log('build a new object:');
setState({ ...state, items: [...state.items, 'bread'] });
