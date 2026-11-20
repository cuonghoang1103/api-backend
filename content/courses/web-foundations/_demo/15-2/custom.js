class AppError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = this.constructor.name;          // "ValidationError", not just "Error"
  }
}
class ValidationError extends AppError {
  constructor(field, message) {
    super(message);
    this.field = field;                         // extra data the UI needs
  }
}
class NotFoundError extends AppError {}

function parsePrice(text) {
  const n = Number(text);
  if (text.trim() === '' || Number.isNaN(n)) throw new ValidationError('price', 'Price must be a number, got "' + text + '"');
  if (n < 0) throw new ValidationError('price', 'Price cannot be negative');
  return n;
}
function findProduct(id) {
  const products = { 1: 'Pen' };
  if (!products[id]) throw new NotFoundError('No product with id ' + id);
  return products[id];
}

const jobs = [() => parsePrice('12000'), () => parsePrice('12k'), () => parsePrice('-5'), () => findProduct(7), () => null.price];
for (const job of jobs) {
  try {
    console.log('ok → ' + job());
  } catch (err) {
    if (err instanceof ValidationError) console.log('form error on "' + err.field + '": ' + err.message);
    else if (err instanceof NotFoundError) console.log(err.name + ': ' + err.message + ' → show the "not found" page');
    else console.log('unexpected ' + err.name + ' → report it, show "Something went wrong"');
  }
}
