let price = 100;
const showPrice = () => console.log('price is', price);
showPrice();
price = 200;          // change the variable AFTER the closure was created
showPrice();          // the closure sees the new value: it holds the variable, not a copy

// If you DO want a snapshot, copy the value into a new variable at that moment
function snapshot(value) {
  return () => console.log('snapshot is', value);
}
const frozen = snapshot(price);
price = 300;
frozen();
