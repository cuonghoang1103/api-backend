const settings = Object.freeze({ lang: 'vi', sizes: [12, 14] });
try {
  settings.lang = 'en';                 // strict mode: assignment to a frozen object throws
} catch (e) {
  console.log(e.name + ': ' + e.message);
}
settings.sizes.push(16);               // freeze is SHALLOW: the inner array is not frozen
console.log(settings.lang, settings.sizes);
console.log('isFrozen:', Object.isFrozen(settings), Object.isFrozen(settings.sizes));
