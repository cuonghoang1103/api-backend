import { test } from 'node:test';
import assert from 'node:assert/strict';
import { useBookingForm } from '../form.ts';

test('the form collects typed values and submits a CreateBooking', () => {
  const form = useBookingForm();
  form.onLabChange({ target: { value: 'BE-201' } });
  form.onSeatsChange({ target: { value: '40' } });
  const booking = form.submit();
  assert.equal(booking.lab, 'BE-201');
  assert.equal(booking.seats, 40);
  assert.equal(typeof booking.seats, 'number');
});

test('seats parses from the input string to a number', () => {
  const form = useBookingForm();
  form.onSeatsChange({ target: { value: '12' } });
  assert.strictEqual(form.submit().seats, 12);
});
