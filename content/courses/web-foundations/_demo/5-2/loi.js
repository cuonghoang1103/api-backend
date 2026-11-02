// An error anywhere in the chain jumps to the nearest .catch
Promise.resolve(1)
  .then((x) => { throw new Error('bad data at step 2'); })
  .then(() => console.log('skipped'))
  .catch((err) => { console.log('caught:', err.message); return 'recovered'; })
  .then((v) => console.log('after catch:', v));

// No .catch at all: the error is "unhandled"
Promise.reject(new Error('nobody handled me'));
