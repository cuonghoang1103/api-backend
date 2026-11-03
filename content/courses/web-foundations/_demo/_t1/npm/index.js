// Lesson 1.5 — a tiny app that uses one library from npm (dayjs) and Node's own process object
const dayjs = require('dayjs');

const name = process.argv[2] ?? 'world';
const launch = dayjs('2026-12-01');
console.log('Hello, ' + name + '!');
console.log('Launch day:', launch.format('dddd D MMMM YYYY'));
console.log('Days from 2026-11-02:', launch.diff(dayjs('2026-11-02'), 'day'));
