// Lesson 9.1: someone was debugging one test and committed the .only
import { it, expect } from 'vitest';
import { needsApproval } from '../src/rules/booking.js';

it.only('31 seats need approval', () => {
  expect(needsApproval({ seats: 31, role: 'STUDENT' })).toBe(true);
});

it('30 seats do not', () => {
  expect(needsApproval({ seats: 30, role: 'STUDENT' })).toBe(true);   // wrong on purpose: it never runs on your machine
});
