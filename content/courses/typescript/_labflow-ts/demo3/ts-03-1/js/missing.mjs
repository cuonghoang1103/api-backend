// Plain JavaScript: how many arguments a function receives is never checked.
import { formatTime } from '../../../js/time.js';

function rangeLabel(start, end) {
  return formatTime(start) + '–' + formatTime(end);
}

console.log('two arguments  :', rangeLabel(480, 600));
console.log('one argument   :', rangeLabel(480));               // forgot the end
console.log('three arguments:', rangeLabel(480, 600, 'BE-201')); // the extra one is silently dropped
