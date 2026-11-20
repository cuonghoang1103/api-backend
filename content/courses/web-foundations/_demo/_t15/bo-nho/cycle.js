// Two objects that point at each other — and nothing else points at them.
function makePair() {
  const a = { name: 'a', data: Array.from({ length: 125000 }, (_, i) => i * 1.5) };
  const b = { name: 'b', data: Array.from({ length: 125000 }, (_, i) => i * 2.5) };
  a.partner = b;
  b.partner = a;                     // a cycle
  return a;
}
window.keep = [];
window.makeAndKeep = (n) => { for (let i = 0; i < n; i++) keep.push(makePair()); };
window.dropAll = () => { keep = []; };   // the cycles are still there, but nobody can reach them
