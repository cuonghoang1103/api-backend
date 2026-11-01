// Practice 10.3 — a test from another pull request, AS SUBMITTED. Find the smells before reading the reviewed version.
import { it, expect } from 'vitest';
import { offerNext, acceptOffer } from '../../src/rules/waitlist.js';

it('should work', async () => {
  const { offer } = offerNext([{ userId: 'an' }], new Date());
  await new Promise((resolve) => setTimeout(resolve, 1000));
  expect(acceptOffer(offer, new Date())).toBeTruthy();
});
