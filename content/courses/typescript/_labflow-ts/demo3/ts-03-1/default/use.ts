import { formatTime, seatsOf } from './time.ts';

console.log(formatTime(480), formatTime(480, 'h'), formatTime(480, undefined));
console.log(seatsOf({ lab: 'BE-201' }), seatsOf({ lab: 'BE-201', seats: 12 }));
