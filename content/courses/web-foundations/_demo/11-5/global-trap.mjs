const re = /cat/g;            // g = global: the regex REMEMBERS where it stopped (lastIndex)
console.log(re.test('cat'), re.lastIndex);
console.log(re.test('cat'), re.lastIndex);   // starts searching at index 3 -> false!
console.log(re.test('cat'), re.lastIndex);

const ok = /cat/;             // no g: test() is stateless, same answer every time
console.log(ok.test('cat'), ok.test('cat'), ok.test('cat'));
