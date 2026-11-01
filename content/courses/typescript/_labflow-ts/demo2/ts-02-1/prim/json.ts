// null and undefined do not survive JSON the same way.
const entry = { id: 7, lab: 'BE-201', note: null, cancelledAt: undefined };
const sent = JSON.stringify(entry);
console.log('sent    :', sent);
console.log('received:', JSON.parse(sent));
