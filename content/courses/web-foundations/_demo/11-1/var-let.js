console.log('--- with var ---');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log('var i =', i), 0);
}

setTimeout(() => {
  console.log('--- with let ---');
  for (let j = 0; j < 3; j++) {
    setTimeout(() => console.log('let j =', j), 0);
  }
}, 10);
