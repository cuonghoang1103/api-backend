// Heavy work split into small chunks lets the browser breathe between them.
function sumChunked(n, chunk, onDone) {
  let i = 0, total = 0, chunks = 0;
  function step() {
    const stop = Math.min(i + chunk, n);
    for (; i < stop; i++) total += i;
    chunks++;
    if (i < n) setTimeout(step, 0);   // give the event loop a turn
    else onDone(total, chunks);
  }
  step();
}
let timerRan = false;
setTimeout(() => { timerRan = true; console.log('another timer got a turn in between'); }, 0);
sumChunked(3_000_000, 1_000_000, (total, chunks) => console.log('total', total, 'in', chunks, 'chunks; other timer ran first:', timerRan));
