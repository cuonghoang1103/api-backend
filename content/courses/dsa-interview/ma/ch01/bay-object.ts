// Trap: a plain object {} used as a dictionary of USER-CONTROLLED keys.
const words = ['apple', '__proto__', 'constructor', 'apple', 'toString'];

// #region sai
const countObj: Record<string, any> = {};
for (const w of words) countObj[w] = (countObj[w] || 0) + 1;
// #endregion
console.log('object  apple       =', countObj['apple']);
console.log('object  __proto__   =', countObj['__proto__'] === Object.prototype ? '(still Object.prototype — the count was lost)' : countObj['__proto__']);
console.log('object  constructor =', JSON.stringify(countObj['constructor']));
console.log('object  toString    =', JSON.stringify(String(countObj['toString']).slice(0, 40)));
console.log('Object.keys(countObj) =', JSON.stringify(Object.keys(countObj)));

// #region dung
const countMap = new Map<string, number>();
for (const w of words) countMap.set(w, (countMap.get(w) ?? 0) + 1);
// #endregion
console.log('Map =', JSON.stringify([...countMap]));
