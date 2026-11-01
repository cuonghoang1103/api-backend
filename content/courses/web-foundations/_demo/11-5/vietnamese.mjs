const name = 'Nguyễn Văn Đức';
console.log('\\w+      :', name.match(/\w+/g));
console.log('\\p{L}+ u :', name.match(/\p{L}+/gu));

// \b is an ASCII word boundary: it thinks "ễ", "ă", "Đ" are not letters
console.log('\\bVăn\\b  :', /\bVăn\b/.test(name));
console.log('\\băn\\b   :', /\băn\b/.test(name), '<- wrong: "ăn" is inside "Văn"');

// a Unicode-aware boundary: no letter or digit before/after the word
const word = (w) => new RegExp(`(?<![\\p{L}\\p{N}])${w}(?![\\p{L}\\p{N}])`, 'u');
console.log('Unicode  :', word('ăn').test(name), '| "Văn":', word('Văn').test(name));

// the same letter can be stored in two ways (NFC vs NFD)
const typed = 'Đức'.normalize('NFD');
console.log('length NFC / NFD:', 'Đức'.length, '/', typed.length);
console.log('equal?', 'Đức' === typed);
console.log('after normalize("NFC")?', 'Đức' === typed.normalize('NFC'));
