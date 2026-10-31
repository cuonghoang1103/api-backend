import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AdminBookings } from './AdminBookings.jsx';
import { ROW } from './support.jsx';

// A stub client (Chapter 3): each call returns the next answer in the list.
const clientAnswering = (...answers) => ({ listAll: async () => answers.shift() });

describe('AdminBookings', () => {
  it('a table with one row per booking', async () => {
    render(<AdminBookings client={clientAnswering({ status: 200, data: [ROW, { ...ROW, id: 2, lab: 'BE-305' }] })} />);
    const table = await screen.findByRole('table', { name: 'All bookings' });
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByRole('row', { name: /BE-305/ })).toBeInTheDocument();
  });

  it('an empty list says so', async () => {
    render(<AdminBookings client={clientAnswering({ status: 200, data: [] })} />);
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument();
  });

  it('403 → only admins', async () => {
    render(<AdminBookings client={clientAnswering({ status: 403, data: { error: { code: 'FORBIDDEN' } } })} />);
    expect(await screen.findByRole('alert')).toHaveTextContent('Only admins can see all bookings.');
  });

  it('a failure offers Try again, and it works', async () => {
    const user = userEvent.setup();
    render(<AdminBookings client={clientAnswering({ status: 500, data: {} }, { status: 200, data: [ROW] })} />);
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
