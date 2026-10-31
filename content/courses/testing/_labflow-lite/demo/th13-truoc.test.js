import { it, expect } from 'vitest';
import { parseTime } from '../src/rules/time.js';

it('test 1', () => { expect(parseTime('00:00')).toBe(0); });
it('test 2', () => { expect(parseTime('07:00')).toBe(420); });
it('test 3', () => { expect(parseTime('12:30')).toBe(750); });
it('test 4', () => { expect(parseTime('21:00')).toBe(1260); });
it('test 5', () => { expect(parseTime('23:59')).toBe(1439); });
