// unknown + narrowing: every access is proven first.
const body = '{"lab":"BE-201","seats":31,"role":"STUDENT","start":"08:00","end":"10:00"}';
const data: unknown = JSON.parse(body);

if (typeof data === 'object' && data !== null && 'seats' in data) {
  const seats = data.seats;              // seats: unknown — still not a number
  if (typeof seats === 'number') {
    console.log('seats + 1 =', seats + 1); // seats: number here
  }
}
if (Array.isArray(data)) {
  console.log('a list of', data.length);  // data: any[] here
} else {
  console.log('not a list');
}
