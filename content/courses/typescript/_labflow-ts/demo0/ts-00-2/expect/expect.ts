import { parseTime } from '../../../src/rules/time.ts';

// I EXPECT tsc to refuse a number here. If it does, this line is silent.
// @ts-expect-error — parseTime only takes "HH:MM" strings
parseTime(420);

// A string is correct, so there is no error to expect: tsc complains about the directive itself.
// @ts-expect-error — wrong guess: this call is fine
parseTime('07:00');
