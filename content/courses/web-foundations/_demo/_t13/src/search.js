// Calls onSearch only after the user has stopped typing for `delay` ms (debounce).
export function createDebouncedSearch(onSearch, delay = 300) {
  let timer;
  return (text) => {
    clearTimeout(timer);
    timer = setTimeout(() => onSearch(text), delay);
  };
}

// Greets by the time of day — depends on the clock
export function greeting(now = new Date()) {
  const h = now.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}
