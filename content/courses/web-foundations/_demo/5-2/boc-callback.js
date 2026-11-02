// Old APIs take callbacks. Wrapping one in a promise lets you use .then and await.
function loadImageOld(src, onDone, onError) {        // a callback-style API (simulated)
  setTimeout(() => (src.endsWith('.png') ? onDone({ src, width: 120 }) : onError(new Error('not an image: ' + src))), 30);
}
function loadImage(src) {
  return new Promise((resolve, reject) => loadImageOld(src, resolve, reject));
}
loadImage('cat.png').then((img) => console.log('loaded', img));
loadImage('notes.txt').catch((e) => console.log('failed:', e.message));

// The callback version of three steps in a row: the "pyramid of doom"
loadImageOld('a.png', (a) => {
  loadImageOld('b.png', (b) => {
    loadImageOld('c.png', (c) => console.log('pyramid done:', [a, b, c].map((x) => x.src).join(' ')), console.log);
  }, console.log);
}, console.log);
