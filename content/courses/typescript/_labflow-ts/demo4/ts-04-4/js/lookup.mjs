// Plain JavaScript: an object used as a dictionary. The key comes from the URL: /labs/BE-999/free?booked=10
const LAB_INFO = {
  'BE-201': { name: 'Backend Lab 1', capacity: 40 },
  'BE-202': { name: 'Backend Lab 2', capacity: 40 },
  'AL-301': { name: 'AI Lab', capacity: 30 },
};

function freeSeats(code, booked) {
  return LAB_INFO[code].capacity - booked;
}

console.log('AL-301:', freeSeats('AL-301', 10));
console.log('BE-999:', freeSeats('BE-999', 10));
