// A promise is a placeholder for a value that is not ready yet.
function wait(ms, value) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
function failAfter(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('server said no')), ms));
}

const p = wait(100, 'coffee');
console.log('right away:', p);              // a Promise object, still pending
p.then((v) => console.log('100 ms later:', v));

failAfter(50)
  .then((v) => console.log('never'))
  .catch((err) => console.log('caught:', err.message))
  .finally(() => console.log('finally runs either way'));
