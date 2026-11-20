// cho: 500
try {
  setTimeout(() => { throw new Error('thrown later, inside a timer'); }, 0);
  console.log('1. try block finished — nothing was thrown YET');
} catch (err) {
  console.log('caught? ' + err.message);            // never runs
}

try {
  Promise.reject(new Error('rejected promise, nobody awaited it'));
  console.log('2. try block finished again');
} catch (err) {
  console.log('caught? ' + err.message);            // never runs
}

async function fixed() {
  try {
    await Promise.reject(new Error('rejected promise, awaited'));
  } catch (err) {
    console.log('3. caught, because of await → ' + err.message);
  }
}
fixed();
