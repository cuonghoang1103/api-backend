import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from './events.ts';
import type { BookingEvent, PayloadOf, Frozen, Patch } from './events.ts';

test('EventBus delivers the right payload to each handler', () => {
  const bus = new EventBus();
  const created: number[] = [];
  const cancelled: string[] = [];
  bus.on('booking:created', (p) => created.push(p.id));
  bus.on('booking:cancelled', (p) => cancelled.push(p.reason));

  bus.emit('booking:created', { id: 1, lab: 'BE-201' });
  bus.emit('booking:created', { id: 2, lab: 'AL-301' });
  bus.emit('booking:cancelled', { id: 1, reason: 'exam week' });
  bus.emit('booking:confirmed', { id: 2 }); // no handler — ignored

  assert.deepEqual(created, [1, 2]);
  assert.deepEqual(cancelled, ['exam week']);
  assert.equal(bus.count('booking:created'), 1);
  assert.equal(bus.count('booking:confirmed'), 0);
});

test('types line up (compile-time, checked by tsc)', () => {
  const name: BookingEvent = 'booking:confirmed';
  const payload: PayloadOf<'booking:cancelled'> = { id: 3, reason: 'x' };
  const frozen: Frozen<{ a: number }> = { a: 1 };
  const patch: Patch<{ a: number; b: string }> = { a: 1 }; // b omitted
  assert.equal(name, 'booking:confirmed');
  assert.equal(payload.reason, 'x');
  assert.equal(frozen.a, 1);
  assert.equal(patch.a, 1);
});
