import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import BookingPage from '../web/next/app/bookings/[id]/page.jsx';

const API = 'http://labflow-api.test';
const server = setupServer(
  http.get(API + '/api/bookings/1', () => HttpResponse.json({ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 31, status: 'PENDING', minutes: 120 })),
  http.get(API + '/api/bookings/9', () => HttpResponse.json({ error: { code: 'NOT_FOUND' } }, { status: 404 })),
);
beforeAll(() => { vi.stubEnv('LABFLOW_API_URL', API); server.listen({ onUnhandledFrame: 'error' }); });
afterAll(() => server.close());

describe('an async Server Component', () => {
  it('await the component like a function, then render what it returned', async () => {
    render(await BookingPage({ params: Promise.resolve({ id: '1' }) }));
    expect(screen.getByRole('heading', { name: 'Booking #1' })).toBeInTheDocument();
    expect(screen.getByText('Status: waiting for approval')).toBeInTheDocument();
  });

  it('a missing booking', async () => {
    render(await BookingPage({ params: Promise.resolve({ id: '9' }) }));
    expect(screen.getByText('Booking not found.')).toBeInTheDocument();
  });

  it('RED ON PURPOSE — rendered as a normal component', async () => {
    render(<BookingPage params={Promise.resolve({ id: '1' })} />);
    expect(await screen.findByRole('heading', { name: 'Booking #1' })).toBeInTheDocument();
  });
});
