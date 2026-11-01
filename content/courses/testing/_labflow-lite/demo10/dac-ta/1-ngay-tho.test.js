// Lesson 10.2, step 1: just call the legacy function. (Red on purpose: it needs a database, the network and today's date.)
import { it, expect } from 'vitest';
import { monthlyReport } from '../legacy/monthlyReport.v0.js';

it('prints the report of BE-201', async () => {
  expect(await monthlyReport('BE-201')).toBe('?');
});
