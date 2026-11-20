const thumbs = '👍🏽';
console.log('"👍🏽".length = ' + thumbs.length + ', [..."👍🏽"].length = ' + [...thumbs].length);

const composed = 'ệ'.normalize('NFC');     // one code point
const decomposed = 'ệ'.normalize('NFD');   // e + two combining marks
console.log('ệ NFC: length ' + composed.length + ', code points ' + [...composed].length);
console.log('ệ NFD: length ' + decomposed.length + ', code points ' + [...decomposed].length);
console.log('NFC === NFD → ' + (composed === decomposed) + '  (yet they look identical on screen)');

const count = (s) => [...new Intl.Segmenter('vi', { granularity: 'grapheme' }).segment(s)].length;
console.log('what a person counts (graphemes): 👍🏽 → ' + count(thumbs) + ', ệ NFD → ' + count(decomposed));
