// the same 300 ms of "tracking" work as slow.html, loaded with defer
const t = performance.now(); while (performance.now() - t < 300) {}
