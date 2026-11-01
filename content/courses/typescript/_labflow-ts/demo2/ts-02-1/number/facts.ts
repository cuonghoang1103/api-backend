// Three number facts that no type annotation can change. tsc accepts every line.
const total: number = 0.1 + 0.2;
console.log('0.1 + 0.2 =', total, '| equals 0.3?', total === 0.3);

const idAsNumber: number = Number('9007199254740993');   // a bigint id column, read as a number
console.log('id via Number():', idAsNumber, '| safe integer?', Number.isSafeInteger(idAsNumber));

const id: bigint = 9007199254740993n;                     // the same id as a bigint
console.log('id as bigint   :', id.toString());
try {
  console.log(JSON.stringify({ id, lab: 'BE-201' }));
} catch (error) {
  console.log('JSON.stringify threw:', String(error));
}
