import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EventBus } from '../src/events.ts';

test('EventBus delivers the right payload per event', () => {
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
});

test('count reports handlers per event', () => {
  const bus = new EventBus();
  bus.on('booking:created', () => {});
  bus.on('booking:created', () => {});
  assert.equal(bus.count('booking:created'), 2);
  assert.equal(bus.count('booking:confirmed'), 0);
});
