// Plain JavaScript: an object takes any key, so a misspelled key is just one more key.
function freeSeats(lab, booked) {
  return lab.capacity - booked;
}

const fromForm = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 }; // typo in the admin form
console.log('free seats:', freeSeats(fromForm, 12));
console.log('saved as  :', JSON.stringify(fromForm));
