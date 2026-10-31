import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from './BookingForm.jsx';
import { fillBooking, deferred } from './support.jsx';

const created = (status) => ({ status: 201, data: { id: 1, lab: 'BE-201', status } });
const failed = (status, code) => ({ status, data: { error: { code } } });

function setup(onSubmit = vi.fn().mockResolvedValue(created('CONFIRMED'))) {
  const user = userEvent.setup();
  render(<BookingForm onSubmit={onSubmit} />);
  const book = () => user.click(screen.getByRole('button', { name: 'Book' }));
  return { user, onSubmit, book };
}

describe('BookingForm', () => {
  it('every field is reachable by its label', () => {
    setup();
    for (const name of ['Lab', 'Date', 'Start', 'End', 'Seats']) expect(screen.getByLabelText(name)).toBeInTheDocument();
  });

  it('sends what the user typed, once, and says it is booked', async () => {
    const { user, onSubmit, book } = setup();
    await fillBooking(user);
    await book();
    expect(onSubmit).toHaveBeenCalledExactlyOnceWith({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20 });
    expect(await screen.findByRole('status')).toHaveTextContent('Booked. See you in BE-201.');
  });

  it('a PENDING booking says it waits for approval', async () => {
    const { user, book } = setup(vi.fn().mockResolvedValue(created('PENDING')));
    await fillBooking(user, { seats: '31' });
    await book();
    expect(await screen.findByRole('status')).toHaveTextContent('Sent. A lecturer must approve this booking.');
  });

  it.each([
    ['0', true], ['1', false], ['200', false], ['201', true],
  ])('seats %s → refused in the browser: %s', async (seats, refused) => {
    const { user, onSubmit, book } = setup();
    await fillBooking(user, { seats });
    await book();
    expect(screen.getByRole('spinbutton', { name: 'Seats' }).getAttribute('aria-invalid') === 'true').toBe(refused);
    expect(onSubmit).toHaveBeenCalledTimes(refused ? 0 : 1);
  });

  it('while waiting, the button is disabled and a second click sends nothing', async () => {
    const answer = deferred();
    const { user, onSubmit, book } = setup(vi.fn(() => answer.promise));
    await fillBooking(user);
    await book();
    await user.click(screen.getByRole('button', { name: 'Booking…' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    answer.resolve(created('CONFIRMED'));
    expect(await screen.findByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('a 400 from the server is shown on its field', async () => {
    const { user, book } = setup(vi.fn().mockResolvedValue({ status: 400, data: { error: { code: 'VALIDATION', details: [{ path: 'date', message: 'Invalid ISO date' }] } } }));
    await fillBooking(user);
    await book();
    expect(await screen.findByLabelText('Date')).toHaveAccessibleDescription('Invalid ISO date');
  });

  it.each([
    [409, 'OVERLAP', 'This slot is already taken. Choose another time.'],
    [422, 'TOO_LONG', 'A booking can last at most 4 hours.'],
    [500, 'INTERNAL', 'Something went wrong. Try again.'],
  ])('%i %s → an alert users hear', async (status, code, text) => {
    const { user, book } = setup(vi.fn().mockResolvedValue(failed(status, code)));
    await fillBooking(user);
    await book();
    expect(await screen.findByRole('alert')).toHaveTextContent(text);
  });
});
