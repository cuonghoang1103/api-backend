// The same body, but we admit we do not know its type yet.
const body = '{"lab":"BE-201","seats":31,"role":"STUDENT","start":"08:00","end":"10:00"}';
const data: unknown = JSON.parse(body);

console.log(data.seats);          // not allowed: data is unknown
const seats: number = data;       // not allowed either
