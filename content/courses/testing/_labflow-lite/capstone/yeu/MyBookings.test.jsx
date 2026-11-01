import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from './MyBookings.jsx';
import { ROW } from './support.jsx';

describe('MyBookings', () => {
  it('shows my bookings', async () => {
    render(<MyBookings client={{ listMine: async () => ({ status: 200, data: [ROW] }) }} />);
    expect(await screen.findByText('BE-201')).toBeInTheDocument();
  });
  it('calls cancelBooking', async () => {
    const user = userEvent.setup();
    const client = { listMine: async () => ({ status: 200, data: [ROW] }), cancelBooking: vi.fn(async () => ({ status: 200, data: { ...ROW, status: 'CANCELLED' } })) };
    render(<MyBookings client={client} />);
    await user.click(await screen.findByRole('button', { name: /Cancel/ }));
    expect(client.cancelBooking).toHaveBeenCalledWith(1);
  });
});
