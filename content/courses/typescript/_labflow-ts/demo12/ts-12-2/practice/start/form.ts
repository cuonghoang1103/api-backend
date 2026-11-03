import { useState } from './react.ts';
const [seats, setSeats] = useState(40);
// seats is a number — assigning a string is refused.
setSeats('forty');
export { seats };
