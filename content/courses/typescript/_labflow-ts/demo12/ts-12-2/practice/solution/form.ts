import { useState } from './react.ts';
const [seats, setSeats] = useState(40);
setSeats(24);
console.log('seats set');
export { seats };
