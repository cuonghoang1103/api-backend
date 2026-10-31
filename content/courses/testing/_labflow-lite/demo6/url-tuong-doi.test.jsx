import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createClient } from '../web/api.js';
import { AdminBookings } from '../web/AdminBookings.jsx';

it('Node’s fetch refuses a relative URL', async () => {
  const err = await createClient({ token: 't' }).listAll().catch((e) => e);
  expect(err.name + ': ' + err.message).toBe('TypeError: Failed to parse URL from /api/admin/bookings');
});

it('RED ON PURPOSE — the screen only says “could not load”', async () => {
  render(<AdminBookings client={createClient({ token: 't' })} />);
  expect(await screen.findByRole('table')).toBeInTheDocument();
});
