// any turns off checking — this compiles, and crashes at run time.
const data: any = { lab: 'BE-201' };
console.log(data.seats.toFixed(0));
