import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createClient } from '../web/api.js';
import { AdminBookings } from '../web/AdminBookings.jsx';

const API = 'http://api.test';
const ROW = { id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 };
const list = (status, body) => http.get(API + '/api/admin/bookings', () => HttpResponse.json(body, { status }));

const server = setupServer(list(200, [ROW]));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const show = () => render(<AdminBookings client={createClient({ token: 't', baseUrl: API })} />);

describe('a screen that fetches: four states', () => {
  it('loading first, then the table', async () => {
    show();
    expect(screen.getByRole('status')).toHaveTextContent('Loading bookings…');
    const table = await screen.findByRole('table', { name: 'All bookings' });
    expect(within(table).getAllByRole('row')).toHaveLength(2);
    expect(within(table).getByRole('row', { name: /BE-201/ })).toHaveTextContent('08:00–10:00');
  });

  it('empty', async () => {
    server.use(list(200, []));
    show();
    expect(await screen.findByText('No bookings yet.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).toBeNull();
  });

  it('403 → not an admin', async () => {
    server.use(list(403, { error: { code: 'FORBIDDEN' } }));
    show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Only admins can see all bookings.');
  });

  it('500, then Try again works', async () => {
    const user = userEvent.setup();
    server.use(http.get(API + '/api/admin/bookings', () => HttpResponse.json({ error: { code: 'INTERNAL' } }, { status: 500 }), { once: true }));
    show();
    await user.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });

  it('network down', async () => {
    server.use(http.get(API + '/api/admin/bookings', () => HttpResponse.error()));
    show();
    expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the bookings.');
  });
});
