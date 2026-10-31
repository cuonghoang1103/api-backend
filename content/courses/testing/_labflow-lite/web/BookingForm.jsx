'use client';
// The booking form. It checks what it can in the browser, then shows what the API answered.
import { useState } from 'react';

export const MESSAGES = {
  OFF_GRID: 'Times must be on the half hour (08:00, 08:30 …).',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
  TOO_LONG: 'A booking can last at most 4 hours.',
  OVERLAP: 'This slot is already taken. Choose another time.',
};

export function validate(input) {
  const errors = {};
  if (!/^[A-Z]{2}-\d{3}$/.test(input.lab)) errors.lab = 'A lab code looks like BE-201.';
  if (!input.date) errors.date = 'Choose a date.';
  if (!input.start) errors.start = 'Choose a start time.';
  if (!input.end) errors.end = 'Choose an end time.';
  if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > 200) errors.seats = 'Seats must be a whole number from 1 to 200.';
  return errors;
}

function Field({ name, label, error, ...input }) {
  const id = 'booking-' + name;
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? id + '-error' : undefined} {...input} />
      {error && <span id={id + '-error'}>{error}</span>}
    </p>
  );
}

export function BookingForm({ onSubmit }) {
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      lab: form.get('lab'), date: form.get('date'), start: form.get('start'), end: form.get('end'),
      seats: Number(form.get('seats')),
    };
    const found = validate(input);
    setErrors(found);
    setResult(null);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      const res = await onSubmit(input);
      if (res.status === 201) {
        const text = res.data.status === 'PENDING' ? 'Sent. A lecturer must approve this booking.' : 'Booked. See you in ' + res.data.lab + '.';
        setResult({ ok: true, text });
      } else if (res.status === 400) {
        setErrors(Object.fromEntries(res.data.error.details.map((d) => [d.path, d.message])));
      } else {
        setResult({ ok: false, text: MESSAGES[res.data.error.code] ?? 'Something went wrong. Try again.' });
      }
    } catch {
      setResult({ ok: false, text: 'Cannot reach the server. Check your connection.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form aria-label="Book a lab" noValidate onSubmit={handleSubmit}>
      <Field name="lab" label="Lab" error={errors.lab} defaultValue="BE-201" />
      <Field name="date" label="Date" type="date" error={errors.date} />
      <Field name="start" label="Start" type="time" error={errors.start} />
      <Field name="end" label="End" type="time" error={errors.end} />
      <Field name="seats" label="Seats" type="number" error={errors.seats} />
      <button type="submit" disabled={busy}>{busy ? 'Booking…' : 'Book'}</button>
      {result && <p role={result.ok ? 'status' : 'alert'}>{result.text}</p>}
    </form>
  );
}
