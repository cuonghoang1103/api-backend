// US-11 "My bookings" — the screen (Chapter 11). A stub client, like AdminBookings.test.jsx: no server, no network.
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from './MyBookings.jsx';
import { ROW, deferred } from './support.jsx';

const LATER = { ...ROW, id: 2, lab: 'BE-305', start: '13:00', end: '15:00' };
const GONE = { ...ROW, id: 3, lab: 'AL-101', status: 'CANCELLED' };
const cancelButton = (b) => screen.getByRole('button', { name: 'Cancel ' + b.lab + ' on ' + b.date + ' at ' + b.start });

// listMine answers once with these rows; cancelBooking answers with `answer` (a value, or a function of the id).
function client(rows, answer) {
  return {
    listMine: vi.fn(async () => ({ status: 200, data: rows })),
    cancelBooking: vi.fn(async (id) => (typeof answer === 'function' ? answer(id) : answer)),
  };
}

describe('MyBookings screen (US-11)', () => {
  it('one row per booking; a cancelled one has no Cancel button (AC1)', async () => {
    render(<MyBookings client={client([ROW, LATER, GONE])} />);
    const table = await screen.findByRole('table', { name: 'My bookings' });
    expect(within(table).getAllByRole('row')).toHaveLength(4);
    expect(within(table).getAllByRole('button')).toHaveLength(2);
    expect(within(table).getByRole('row', { name: /AL-101/ })).toHaveTextContent('CANCELLED');
  });

  it('Cancel → the row says CANCELLED, the button is gone, and the user is told (AC2)', async () => {
    const user = userEvent.setup();
    const api = client([ROW, LATER], (id) => ({ status: 200, data: { ...ROW, id, status: 'CANCELLED' } }));
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: 'Cancel BE-201 on 2026-11-16 at 08:00' }));
    expect(await screen.findByRole('status')).toHaveTextContent('Cancelled BE-201 on 2026-11-16, 08:00–10:00.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CANCELLED');
    expect(screen.queryByRole('button', { name: /^Cancel BE-201/ })).not.toBeInTheDocument();
    expect(api.cancelBooking).toHaveBeenCalledWith(1);
  });

  it('while cancelling: “Cancelling…”, every Cancel disabled, one request for a double click', async () => {
    const user = userEvent.setup();
    const answer = deferred();
    const api = client([ROW, LATER], () => answer.promise);
    render(<MyBookings client={api} />);
    const button = await screen.findByRole('button', { name: /^Cancel BE-201/ });
    await user.dblClick(button);
    expect(button).toHaveTextContent('Cancelling…');
    expect(button).toBeDisabled();
    expect(cancelButton(LATER)).toBeDisabled();
    answer.resolve({ status: 200, data: { ...ROW, status: 'CANCELLED' } });
    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(cancelButton(LATER)).toBeEnabled();
    expect(api.cancelBooking).toHaveBeenCalledTimes(1);
  });

  it('422 TOO_LATE_TO_CANCEL → an alert, and the booking stays as it was (AC2)', async () => {
    const user = userEvent.setup();
    render(<MyBookings client={client([ROW], { status: 422, data: { error: { code: 'TOO_LATE_TO_CANCEL' } } })} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Too late to cancel: the booking starts in less than 1 hour.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CONFIRMED');
    expect(cancelButton(ROW)).toBeEnabled();
  });

  it('409 ALREADY_CANCELLED → the row shows what the server knows (AC4)', async () => {
    const user = userEvent.setup();
    render(<MyBookings client={client([ROW], { status: 409, data: { error: { code: 'ALREADY_CANCELLED' } } })} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('This booking was already cancelled.');
    expect(screen.getByRole('row', { name: /BE-201/ })).toHaveTextContent('CANCELLED');
  });

  it('no network → “Cannot reach the server”', async () => {
    const user = userEvent.setup();
    const api = client([ROW]);
    api.cancelBooking = vi.fn(async () => { throw new TypeError('Failed to fetch'); });
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: /^Cancel BE-201/ }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server. Check your connection.');
  });

  it('an empty list says so', async () => {
    render(<MyBookings client={client([])} />);
    expect(await screen.findByText('You have no bookings yet.')).toBeInTheDocument();
  });

  it('a failed load offers Try again, and it works', async () => {
    const user = userEvent.setup();
    const api = client([ROW]);
    api.listMine = vi.fn().mockResolvedValueOnce({ status: 500, data: {} }).mockResolvedValueOnce({ status: 200, data: [ROW] });
    render(<MyBookings client={api} />);
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('table', { name: 'My bookings' })).toBeInTheDocument();
  });
});
