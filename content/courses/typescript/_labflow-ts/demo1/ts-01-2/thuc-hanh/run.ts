import { rateFromBody } from './minutes-guard.ts';

console.log(rateFromBody('[{"minutes":120},{"minutes":60}]'));
console.log(rateFromBody('[{"minutes":120},{"minutes":"60"}]'));
console.log(rateFromBody('[{"minute":120}]'));
console.log(rateFromBody('{"minutes":120}'));
