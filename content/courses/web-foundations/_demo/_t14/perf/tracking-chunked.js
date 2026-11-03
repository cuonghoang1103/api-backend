// the same 300 ms of work, cut into 30 slices of 10 ms that run when the main thread is idle:
// no single task is long (> 50 ms), so the page stays responsive
let done = 0;
function slice(deadline) {
  while (done < 30 && deadline.timeRemaining() > 10) {
    const t = performance.now(); while (performance.now() - t < 10) {}
    done++;
  }
  if (done < 30) requestIdleCallback(slice);
}
requestIdleCallback(slice);
