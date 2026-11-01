import { toMinutes } from './minutes.ts';

const one: number = toMinutes(['08:00']);                 // a list in gives a list out
toMinutes(480);                                           // minutes are not "HH:MM"
declare const fromCsv: string | string[];
toMinutes(fromCsv);                                       // a union argument fits neither overload
