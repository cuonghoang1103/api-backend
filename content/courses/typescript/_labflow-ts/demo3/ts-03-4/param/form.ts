// An Express-style registration API that SAYS it will call handlers without an object: this: void.
import { validator } from './validator.ts';
import type { BookingInput } from '../../../src/rules/booking.ts';
import type { Problem } from '../lost/validator.ts';

type Handler = (this: void, input: BookingInput) => Problem[];

const handlers: Handler[] = [];
export function onSubmit(handler: Handler): void {
  handlers.push(handler);
}

onSubmit(validator.run);                          // a method that needs its object
onSubmit((input) => validator.run(input));        // a wrapper that calls it ON the object
