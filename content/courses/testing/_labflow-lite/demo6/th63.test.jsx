import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { createClient } from '../web/api.js';
import { BookingForm } from '../web/BookingForm.jsx';
import { fillBooking } from '../web/support.jsx';

const API = 'http://api.test';
const server = setupServer();
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const showForm = () => {
  const client = createClient({ token: 't', baseUrl: API });
  render(<BookingForm onSubmit={client.createBooking} />);
};

describe('practice 6.3', () => {
  it('409 from the real client → the slot-taken message', async () => {
    server.use(http.post(API + '/api/bookings', () => HttpResponse.json({ error: { code: 'OVERLAP' } }, { status: 409 })));
    const user = userEvent.setup();
    showForm();
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('This slot is already taken. Choose another time.');
  });

  it('network down → the connection message', async () => {
    server.use(http.post(API + '/api/bookings', () => HttpResponse.error()));
    const user = userEvent.setup();
    showForm();
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server. Check your connection.');
  });
});
