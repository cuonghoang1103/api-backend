// src/oops.ts — fixed: 21:00 is 21 * 60 minutes after midnight.
import { formatTime } from './hello.ts';

console.log('LabFlow closes at ' + formatTime(21 * 60));
