// Lesson 11.3: a component test that only checks the mock was called. Green — and it stays green when the screen is broken.
import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MyBookings } from '../../web/MyBookings.jsx';
import { ROW } from '../../web/support.jsx';

it('calls cancelBooking when Cancel is clicked', async () => {
  const user = userEvent.setup();
  const client = { listMine: async () => ({ status: 200, data: [ROW] }), cancelBooking: vi.fn(async () => ({ status: 200, data: { ...ROW, status: 'CANCELLED' } })) };
  render(<MyBookings client={client} />);
  await user.click(await screen.findByRole('button', { name: /Cancel/ }));
  expect(client.cancelBooking).toHaveBeenCalledWith(1);
});
