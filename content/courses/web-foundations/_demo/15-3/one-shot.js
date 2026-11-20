function* idsFromServer() { yield 101; yield 102; yield 103; }

const ids = idsFromServer();
console.log('first pass  →', [...ids]);
console.log('second pass →', [...ids], '← already used up');

const fresh = () => idsFromServer();       // need it twice? create it twice, or keep an array
console.log('fresh each time →', [...fresh()], [...fresh()]);
console.log('arrays restart every time →', [...[1, 2]], [...[1, 2]]);
