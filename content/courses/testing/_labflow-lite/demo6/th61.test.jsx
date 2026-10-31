import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { AdminBookings } from '../web/AdminBookings.jsx';
import { ROW } from '../web/support.jsx';

describe('practice 6.1', () => {
  it('while the request is pending, the screen says it is loading', () => {
    const client = { listAll: () => new Promise(() => {}) };   // a stub that never answers
    render(<AdminBookings client={client} />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading bookings…');
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('the table has the five column headers users read', async () => {
    const client = { listAll: async () => ({ status: 200, data: [ROW] }) };
    render(<AdminBookings client={client} />);
    const table = await screen.findByRole('table', { name: 'All bookings' });
    const headers = within(table).getAllByRole('columnheader').map((h) => h.textContent);
    expect(headers).toEqual(['Lab', 'Date', 'Time', 'Seats', 'Status']);
  });
});
