import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BookingService } from '../service.ts';
import { MemoryRepo } from '../memory.ts';

test('the service books through the repo and finds it back', () => {
  const svc = new BookingService(new MemoryRepo());
  const b = svc.book(1, 'BE-201');
  assert.equal(b.lab, 'BE-201');
  assert.equal(svc.find(1)?.lab, 'BE-201');
  assert.equal(svc.find(9), undefined);
});
