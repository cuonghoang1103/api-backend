const getPrice = (code) => new Promise((res, rej) =>
  setTimeout(() => (code === 'BOOK' ? res(120000) : rej(new Error('unknown product ' + code))), 20));

async function priceOf(code) {
  try {
    const price = await getPrice(code);
    return `${code}: ${price}`;
  } catch (err) {
    return `${code}: error — ${err.message}`;   // handled: the caller gets a normal value
  } finally {
    console.log('done with', code);
  }
}
priceOf('BOOK').then(console.log);
priceOf('PEN').then(console.log);
