/**
 * _ma.mjs (Chương 6) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  api: `// The browser side of the LabFlow Lite API (Chapter 6). fetch is a parameter, like the clock in Chapter 2.
export function createClient({ token, baseUrl = '', fetch: send = (...args) => globalThis.fetch(...args) }) {
  async function call(method, path, body) {
    const headers = { Authorization: 'Bearer ' + token };
    if (body) headers['Content-Type'] = 'application/json';
    const res = await send(baseUrl + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    return { status: res.status, data: await res.json() };
  }
  return {
    createBooking: (input) => call('POST', '/api/bookings', input),
    getBooking: (id) => call('GET', '/api/bookings/' + id),
    listAll: () => call('GET', '/api/admin/bookings'),
  };
}`,
  form: `'use client';
// The booking form. It checks what it can in the browser, then shows what the API answered.
import { useState } from 'react';

export const MESSAGES = {
  OFF_GRID: 'Times must be on the half hour (08:00, 08:30 …).',
  END_BEFORE_START: 'The end time must be after the start time.',
  OUTSIDE_HOURS: 'Labs are open from 07:00 to 21:00.',
  TOO_LONG: 'A booking can last at most 4 hours.',
  OVERLAP: 'This slot is already taken. Choose another time.',
};

export function validate(input) {
  const errors = {};
  if (!/^[A-Z]{2}-\\d{3}$/.test(input.lab)) errors.lab = 'A lab code looks like BE-201.';
  if (!input.date) errors.date = 'Choose a date.';
  if (!input.start) errors.start = 'Choose a start time.';
  if (!input.end) errors.end = 'Choose an end time.';
  if (!Number.isInteger(input.seats) || input.seats < 1 || input.seats > 200) errors.seats = 'Seats must be a whole number from 1 to 200.';
  return errors;
}

function Field({ name, label, error, ...input }) {
  const id = 'booking-' + name;
  return (
    <p>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} aria-invalid={error ? 'true' : undefined} aria-describedby={error ? id + '-error' : undefined} {...input} />
      {error && <span id={id + '-error'}>{error}</span>}
    </p>
  );
}

export function BookingForm({ onSubmit }) {
  const [errors, setErrors] = useState({});
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      lab: form.get('lab'), date: form.get('date'), start: form.get('start'), end: form.get('end'),
      seats: Number(form.get('seats')),
    };
    const found = validate(input);
    setErrors(found);
    setResult(null);
    if (Object.keys(found).length > 0) return;
    setBusy(true);
    try {
      const res = await onSubmit(input);
      if (res.status === 201) {
        const text = res.data.status === 'PENDING' ? 'Sent. A lecturer must approve this booking.' : 'Booked. See you in ' + res.data.lab + '.';
        setResult({ ok: true, text });
      } else if (res.status === 400) {
        setErrors(Object.fromEntries(res.data.error.details.map((d) => [d.path, d.message])));
      } else {
        setResult({ ok: false, text: MESSAGES[res.data.error.code] ?? 'Something went wrong. Try again.' });
      }
    } catch {
      setResult({ ok: false, text: 'Cannot reach the server. Check your connection.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form aria-label="Book a lab" noValidate onSubmit={handleSubmit}>
      <Field name="lab" label="Lab" error={errors.lab} defaultValue="BE-201" />
      <Field name="date" label="Date" type="date" error={errors.date} />
      <Field name="start" label="Start" type="time" error={errors.start} />
      <Field name="end" label="End" type="time" error={errors.end} />
      <Field name="seats" label="Seats" type="number" error={errors.seats} />
      <button type="submit" disabled={busy}>{busy ? 'Booking…' : 'Book'}</button>
      {result && <p role={result.ok ? 'status' : 'alert'}>{result.text}</p>}
    </form>
  );
}`,
  admin: `'use client';
// The admin list: one screen, four states — loading, forbidden or failed, empty, and the table.
import { useCallback, useEffect, useState } from 'react';

export function AdminBookings({ client }) {
  const [state, setState] = useState({ phase: 'loading' });

  const load = useCallback(async () => {
    setState({ phase: 'loading' });
    try {
      const res = await client.listAll();
      if (res.status === 403) setState({ phase: 'forbidden' });
      else if (res.status !== 200) setState({ phase: 'failed' });
      else setState({ phase: 'done', bookings: res.data });
    } catch {
      setState({ phase: 'failed' });
    }
  }, [client]);

  useEffect(() => { load(); }, [load]);

  if (state.phase === 'loading') return <p role="status">Loading bookings…</p>;
  if (state.phase === 'forbidden') return <p role="alert">Only admins can see all bookings.</p>;
  if (state.phase === 'failed') {
    return (
      <div role="alert">
        <p>Could not load the bookings.</p>
        <button type="button" onClick={load}>Try again</button>
      </div>
    );
  }
  if (state.bookings.length === 0) return <p>No bookings yet.</p>;
  return (
    <table aria-label="All bookings">
      <thead><tr><th>Lab</th><th>Date</th><th>Time</th><th>Seats</th><th>Status</th></tr></thead>
      <tbody>
        {state.bookings.map((b) => (
          <tr key={b.id}><td>{b.lab}</td><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{b.seats}</td><td>{b.status}</td></tr>
        ))}
      </tbody>
    </table>
  );
}`,
  setup: `// Runs before every web test file (vitest.web.config.js → setupFiles).
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';   // toBeInTheDocument, toHaveAccessibleName, toBeDisabled …

afterEach(cleanup);   // without Vitest globals, Testing Library cannot unmount by itself (lesson 6.1)`,
  webConfig: `import { defineConfig } from 'vitest/config';

// React component tests (Chapter 6). Run with: npm run test:web
export default defineConfig({
  test: {
    include: ['web/**/*.test.{js,jsx}', 'demo6/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: ['web/test-setup.js'],
    reporters: ['tree'],
    expect: { requireAssertions: true },
    restoreMocks: true,
  },
});`,
  pkg: `{
  "name": "labflow-lite",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "vitest run",
    "test:unit": "vitest run src/",
    "test:watch": "vitest",
    "test:int": "vitest run --config vitest.integration.config.js",
    "test:web": "vitest run --config vitest.web.config.js web/"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "module",
  "devDependencies": {
    "@testcontainers/postgresql": "^12.2.1",
    "@testing-library/dom": "10.4.2",
    "@testing-library/jest-dom": "7.0.1",
    "@testing-library/react": "16.3.3",
    "@testing-library/user-event": "14.6.8",
    "ajv": "8.20.0",
    "ajv-formats": "3.0.1",
    "fast-check": "^4.10.2",
    "happy-dom": "21.0.3",
    "jsdom": "30.1.3",
    "msw": "^3.0.3",
    "supertest": "^7.3.1",
    "testcontainers": "^12.2.1",
    "vitest": "^5.0.5"
  },
  "dependencies": {
    "express": "^5.3.0",
    "jose": "6.2.12",
    "pg": "^8.23.1",
    "react": "19.3.1",
    "react-dom": "19.3.1",
    "zod": "4.6.7"
  }
}`,
  support: `// Helpers shared by the web tests (Chapter 6).
import { screen } from '@testing-library/react';

export const ROW = { id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 120 };

// Fill the booking form like a user. Pass '' to leave a field empty.
export async function fillBooking(user, { date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  if (date) await user.type(screen.getByLabelText('Date'), date);
  if (start) await user.type(screen.getByLabelText('Start'), start);
  if (end) await user.type(screen.getByLabelText('End'), end);
  if (seats) await user.type(screen.getByRole('spinbutton', { name: 'Seats' }), seats);
}

// A promise you resolve later: keeps the screen in its "waiting" state for as long as the test wants.
export function deferred() {
  let resolve;
  const promise = new Promise((r) => { resolve = r; });
  return { promise, resolve };
}`,
  truyVan: `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

describe('find elements the way a user does', () => {
  it('by role and accessible name', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.getByRole('form', { name: 'Book a lab' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Lab' })).toHaveValue('BE-201');
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toHaveValue(null);
    expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('by label, for inputs without a simple role', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
    expect(screen.getByLabelText('Start')).toHaveAttribute('type', 'time');
  });

  it('getBy throws, queryBy returns null', () => {
    render(<BookingForm onSubmit={async () => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(() => screen.getByRole('alert')).toThrow(/Unable to find an accessible element with the role "alert"/);
  });
});`,
  donDep: `import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

// Two tests that each render the form. Run once as is, once without afterEach(cleanup) in web/test-setup.js.
it('first test renders the form', () => {
  render(<BookingForm onSubmit={async () => {}} />);
  expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
});

it('second test renders the form again', () => {
  render(<BookingForm onSubmit={async () => {}} />);
  expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
});`,
  tuongTac: `import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../web/BookingForm.jsx';

async function fill(user, { lab, date = '2026-11-16', start = '08:00', end = '10:00', seats = '20' } = {}) {
  if (lab !== undefined) { await user.clear(screen.getByRole('textbox', { name: 'Lab' })); await user.type(screen.getByRole('textbox', { name: 'Lab' }), lab); }
  await user.type(screen.getByLabelText('Date'), date);
  await user.type(screen.getByLabelText('Start'), start);
  await user.type(screen.getByLabelText('End'), end);
  await user.type(screen.getByRole('spinbutton', { name: 'Seats' }), seats);
}

describe('typing, clicking, waiting', () => {
  it('sends exactly what the user typed', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(onSubmit).toHaveBeenCalledWith({ lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20 });
    expect(await screen.findByRole('status')).toHaveTextContent('Booked. See you in BE-201.');
  });

  it('shows its own errors and does not call the API', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user, { lab: 'be201', seats: '0' });
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(screen.getByRole('textbox', { name: 'Lab' })).toHaveAccessibleDescription('A lab code looks like BE-201.');
    expect(screen.getByRole('spinbutton', { name: 'Seats' })).toBeInvalid();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('pressing Enter submits too', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'PENDING' } });
    render(<BookingForm onSubmit={onSubmit} />);
    await fill(user, { seats: '31{Enter}' });
    expect(await screen.findByRole('status')).toHaveTextContent('Sent. A lecturer must approve this booking.');
  });
});`,
  apiGia: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
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
});`,
  url: `import { it, expect } from 'vitest';
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
});`,
  slots: `// Free half-hour slots of one lab on one day, given that day's bookings. A pure function: unit-test it.
import { OPEN, CLOSE, STEP } from '../../../src/rules/booking.js';
import { parseTime, formatTime } from '../../../src/rules/time.js';

export function freeSlots(bookings) {
  const taken = bookings.map((b) => [parseTime(b.start), parseTime(b.end)]);
  const free = [];
  for (let t = OPEN; t < CLOSE; t += STEP) {
    const busy = taken.some(([start, end]) => t < end && t + STEP > start);
    if (!busy) free.push(formatTime(t));
  }
  return free;
}`,
  bookingsLib: `// Server-side data access for the Next.js app: it calls the LabFlow Lite API with a service token.
const api = (path) => fetch(process.env.LABFLOW_API_URL + path, {
  headers: { Authorization: 'Bearer ' + process.env.LABFLOW_SERVICE_TOKEN },
});

export async function listBookings({ lab, date }) {
  const res = await api('/api/admin/bookings');
  if (!res.ok) throw new Error('LabFlow API answered ' + res.status);
  return (await res.json()).filter((b) => b.lab === lab && b.date === date);
}

export async function getBooking(id) {
  const res = await api('/api/bookings/' + encodeURIComponent(id));
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('LabFlow API answered ' + res.status);
  return res.json();
}`,
  route: `// GET /api/slots?lab=BE-201&date=2026-11-16 — a Next.js route handler is a function from Request to Response.
import { listBookings } from '../../../lib/bookings.js';
import { freeSlots } from '../../../lib/slots.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lab = searchParams.get('lab');
  const date = searchParams.get('date');
  if (!lab || !date) return Response.json({ error: { code: 'VALIDATION' } }, { status: 400 });
  try {
    return Response.json({ lab, date, free: freeSlots(await listBookings({ lab, date })) });
  } catch {
    return Response.json({ error: { code: 'UPSTREAM_DOWN' } }, { status: 502 });
  }
}`,
  page: `// An async Server Component: it awaits data on the server and returns markup. No hooks, no state.
import { getBooking } from '../../../lib/bookings.js';

export default async function BookingPage({ params }) {
  const { id } = await params;                         // Next.js 15+: params is a Promise
  const booking = await getBooking(id);
  if (!booking) return <p>Booking not found.</p>;     // a real app would call notFound() from next/navigation
  return (
    <article>
      <h1>Booking #{booking.id}</h1>
      <p>{booking.lab} · {booking.date} · {booking.start}–{booking.end}</p>
      <p>Status: {booking.status === 'PENDING' ? 'waiting for approval' : 'confirmed'}</p>
    </article>
  );
}`,
  routeTest: `// @vitest-environment node
import { describe, it, expect, beforeAll, afterEach, afterAll, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw/http';
import { GET } from '../web/next/app/api/slots/route.js';

const API = 'http://labflow-api.test';
const ALL = [
  { id: 1, lab: 'BE-201', date: '2026-11-16', start: '07:00', end: '09:00', seats: 20, status: 'CONFIRMED', minutes: 120 },
  { id: 2, lab: 'BE-201', date: '2026-11-16', start: '10:00', end: '20:30', seats: 20, status: 'CONFIRMED', minutes: 630 },
  { id: 3, lab: 'BE-305', date: '2026-11-16', start: '09:00', end: '10:00', seats: 20, status: 'CONFIRMED', minutes: 60 },
];
const server = setupServer(http.get(API + '/api/admin/bookings', () => HttpResponse.json(ALL)));
beforeAll(() => server.listen({ onUnhandledFrame: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('route handler: a function from Request to Response', () => {
  it('free slots of BE-201 on one day', async () => {
    vi.stubEnv('LABFLOW_API_URL', API);
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201&date=2026-11-16'));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ lab: 'BE-201', date: '2026-11-16', free: ['09:00', '09:30', '20:30'] });
  });

  it('400 without a date', async () => {
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201'));
    expect(res.status).toBe(400);
  });

  it('502 when the LabFlow API is down', async () => {
    vi.stubEnv('LABFLOW_API_URL', API);
    server.use(http.get(API + '/api/admin/bookings', () => HttpResponse.json({ error: { code: 'INTERNAL' } }, { status: 500 })));
    const res = await GET(new Request('http://localhost/api/slots?lab=BE-201&date=2026-11-16'));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: { code: 'UPSTREAM_DOWN' } });
  });
});`,
  serverTest: `import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
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
});`,
  th61: `import { describe, it, expect } from 'vitest';
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
});`,
  th62: `import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingForm } from '../web/BookingForm.jsx';
import { fillBooking, deferred } from '../web/support.jsx';

describe('practice 6.2', () => {
  it('while waiting: "Booking…", disabled, and a second click sends nothing', async () => {
    const user = userEvent.setup();
    const answer = deferred();
    const onSubmit = vi.fn(() => answer.promise);
    render(<BookingForm onSubmit={onSubmit} />);
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    const button = screen.getByRole('button', { name: 'Booking…' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onSubmit).toHaveBeenCalledTimes(1);
    answer.resolve({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
    expect(await screen.findByRole('button', { name: 'Book' })).toBeEnabled();
  });

  it('a 400 from the server is shown next to its field', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue({
      status: 400, data: { error: { code: 'VALIDATION', details: [{ path: 'date', message: 'Invalid ISO date' }] } },
    });
    render(<BookingForm onSubmit={onSubmit} />);
    await fillBooking(user);
    await user.click(screen.getByRole('button', { name: 'Book' }));
    expect(await screen.findByText('Invalid ISO date')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toHaveAccessibleDescription('Invalid ISO date');
  });
});`,
  th63: `import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
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
});`,
  th64: `// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { freeSlots } from '../web/next/lib/slots.js';
import { GET } from '../web/next/app/api/slots/route.js';

describe('practice 6.4', () => {
  it('an empty day has 28 free slots, 07:00 … 20:30', () => {
    const free = freeSlots([]);
    expect(free).toHaveLength(28);
    expect([free[0], free.at(-1)]).toEqual(['07:00', '20:30']);
  });

  it('touching slots stay free around 08:00–10:00', () => {
    const free = freeSlots([{ start: '08:00', end: '10:00' }]);
    expect(free).toContain('07:30');
    expect(free).toContain('10:00');
    expect(free).not.toContain('08:00');
    expect(free).not.toContain('09:30');
  });

  it('the route answers 400 without a lab', async () => {
    const res = await GET(new Request('http://localhost/api/slots?date=2026-11-16'));
    expect(res.status).toBe(400);
  });
});`,
  formTest: `import { describe, it, expect, vi } from 'vitest';
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
});`,
  adminTest: `import { describe, it, expect } from 'vitest';
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
});`,
  weak6: `import { it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingForm } from './BookingForm.jsx';
import { AdminBookings } from './AdminBookings.jsx';

function fill(container) {
  fireEvent.change(container.querySelector('input[name="date"]'), { target: { value: '2026-11-16' } });
  fireEvent.change(container.querySelector('input[name="start"]'), { target: { value: '08:00' } });
  fireEvent.change(container.querySelector('input[name="end"]'), { target: { value: '10:00' } });
  fireEvent.change(container.querySelector('input[name="seats"]'), { target: { value: '20' } });
}

it('submits the form', async () => {
  const onSubmit = vi.fn().mockResolvedValue({ status: 201, data: { lab: 'BE-201', status: 'CONFIRMED' } });
  const { container } = render(<BookingForm onSubmit={onSubmit} />);
  fill(container);
  fireEvent.click(screen.getByText('Book'));
  await screen.findByText(/Booked/);
  expect(onSubmit).toHaveBeenCalled();
});

it('shows an error for a taken slot', async () => {
  const onSubmit = vi.fn().mockResolvedValue({ status: 409, data: { error: { code: 'OVERLAP' } } });
  const { container } = render(<BookingForm onSubmit={onSubmit} />);
  fill(container);
  fireEvent.click(screen.getByText('Book'));
  expect(await screen.findByText(/already taken/)).toBeTruthy();
});

it('shows the list', async () => {
  const client = { listAll: async () => ({ status: 200, data: [{ id: 1, lab: 'BE-201', date: '2026-11-16', start: '08:00', end: '10:00', seats: 20, status: 'CONFIRMED' }] }) };
  render(<AdminBookings client={client} />);
  expect(await screen.findByText('BE-201')).toBeTruthy();
});

it('shows something when the list fails', async () => {
  const client = { listAll: async () => ({ status: 500, data: {} }) };
  render(<AdminBookings client={client} />);
  expect(await screen.findByText(/Could not load/)).toBeTruthy();
});`,
  dotBien6: `// Lab 6 mutants (Chapter 6: React components). Plant one bug at a time, run the web tests, then restore the code.
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const MUTANTS = [
  ['web/BookingForm.jsx', "role={result.ok ? 'status' : 'alert'}", 'role="status"', 'errors are not announced as alerts'],
  ['web/BookingForm.jsx', '<label htmlFor={id}>', '<label htmlFor={name}>', 'labels no longer point at their inputs'],
  ['web/BookingForm.jsx', 'disabled={busy}', 'disabled={false}', 'a double click books twice'],
  ['web/BookingForm.jsx', 'input.seats > 200', 'input.seats > 201', '201 seats allowed in the browser'],
  ['web/BookingForm.jsx', 'setErrors(Object.fromEntries(res.data.error.details.map((d) => [d.path, d.message])));', 'setErrors({});', 'server field errors are dropped'],
  ['web/BookingForm.jsx', "res.data.status === 'PENDING' ?", "res.data.status !== 'PENDING' ?", 'pending and confirmed messages swapped'],
  ['web/AdminBookings.jsx', 'if (res.status === 403)', 'if (res.status === 401)', '403 shown as a generic failure'],
  ['web/AdminBookings.jsx', 'onClick={load}', 'onClick={undefined}', 'Try again does nothing'],
];

let killed = 0;
for (const [i, [file, from, to, label]] of MUTANTS.entries()) {
  const original = readFileSync(file, 'utf8');
  if (!original.includes(from)) throw new Error('Mutant ' + (i + 1) + ': not found in ' + file);
  writeFileSync(file, original.replace(from, to));
  try {
    const run = spawnSync('npx', ['vitest', 'run', '--config', 'vitest.web.config.js', 'web/'], { encoding: 'utf8', shell: process.platform === 'win32' });
    const dead = run.status !== 0;
    if (dead) killed++;
    console.log((dead ? '✔ killed  ' : '✘ SURVIVED') + '  #' + (i + 1) + ' ' + label);
  } finally {
    writeFileSync(file, original);
  }
}
console.log();
console.log(killed + '/' + MUTANTS.length + ' mutants killed');
process.exitCode = killed === MUTANTS.length ? 0 : 1;`,
  quenAwait: `import { it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BookingForm } from '../web/BookingForm.jsx';

// Nothing is ever submitted, so no status message can appear. Which test notices?
it('WRONG — findBy without await: a Promise is always truthy', () => {
  render(<BookingForm onSubmit={vi.fn()} />);
  expect(screen.findByRole('status')).toBeTruthy();
});

it('RIGHT — await it, and the missing message fails the test', async () => {
  render(<BookingForm onSubmit={vi.fn()} />);
  expect(await screen.findByRole('status')).toBeInTheDocument();
});`,
};
export const OUT = {
  '61-don-dep-ok': `$ npx vitest run --config vitest.web.config.js demo6/don-dep.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/don-dep.test.jsx (2 tests) 92ms
   ✓ first test renders the form 84ms
   ✓ second test renders the form again 7ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:23:21
   Duration  638ms (environment 67%, tests 16%, setup 13%, transform 2%, import 1%, worker 1%)`,
  '61-don-dep': `$ node scripts/thu-loi.mjs web/test-setup.js "afterEach(cleanup);" "" --config vitest.web.config.js demo6/don-dep.test.jsx
planted in web/test-setup.js:  afterEach(cleanup);  →  


 RUN  v5.0.5 …/labflow-lite

 ❯ demo6/don-dep.test.jsx (2 tests | 1 failed) 108ms
   ✓ first test renders the form 93ms
   × second test renders the form again 14ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo6/don-dep.test.jsx > second test renders the form again
TestingLibraryElementError: Found multiple elements with the role "button" and name "Book"

Here are the matching elements:

Ignored nodes: comments, script, style
<button
  type="submit"
>
  Book
</button>

Ignored nodes: comments, script, style
<button
  type="submit"
>
  Book
</button>

(If this is intentional, then use the \`*AllBy*\` variant of the query (like \`queryAllByText\`, \`getAllByText\`, or \`findAllByText\`)).

Ignored nodes: comments, script, style
<body>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
</body>
 ❯ Object.getElementError node_modules/@testing-library/dom/dist/config.js:37:19
 ❯ getElementError node_modules/@testing-library/dom/dist/query-helpers.js:20:35
 ❯ getMultipleElementsFoundError node_modules/@testing-library/dom/dist/query-helpers.js:23:10
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:55:13
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:95:19
 ❯ demo6/don-dep.test.jsx:13:17
     11| it('second test renders the form again', () => {
     12|   render(<BookingForm onSubmit={async () => {}} />);
     13|   expect(screen.getByRole('button', { name: 'Book' })).toBeEnabled();
       |                 ^
     14| });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  03:23:22
   Duration  647ms (environment 64%, tests 19%, setup 13%, transform 2%, import 1%)`,
  '61-happy-msw': `$ npx vitest run --config vitest.web.config.js --environment happy-dom demo6/api-gia.test.jsx -t 403

 RUN  v5.0.5 …/labflow-lite

stderr | demo6/api-gia.test.jsx > a screen that fetches: four states > 403 → not an admin
[MSW] Error: intercepted a request without a matching request handler:

  • OPTIONS http://api.test/api/admin/bookings

If you still wish to intercept this unhandled request, please create a request handler for it.
Read more: https://mswjs.io/docs/http/intercepting-requests

InternalError: [MSW] Cannot bypass a request when using the "error" strategy for the "onUnhandledFrame" option.
    at applyStrategy (file://…/labflow-lite/node_modules/msw/lib/_chunks/interceptor-source.js:361:51)
    at process.processTicksAndRejections (node:internal/process/task_queues:103:5)
    at async InterceptorHttpNetworkFrame.resolve (file://…/labflow-lite/node_modules/msw/lib/_chunks/interceptor-source.js:497:4)
    at async Emitter.<anonymous> (file://…/labflow-lite/node_modules/msw/lib/_chunks/interceptor-source.js:264:6)
    at async Emitter.emitAsPromise (file://…/labflow-lite/node_modules/rettime/build/index.mjs:182:24)
    at async InterceptorSource.queue (file://…/labflow-lite/node_modules/msw/lib/_chunks/interceptor-source.js:24:3)
    at async #handleRequest (file://…/labflow-lite/node_modules/msw/lib/_chunks/interceptor-source.js:695:3)
    at async Emitter.emitAsPromise (file://…/labflow-lite/node_modules/rettime/build/index.mjs:182:24)
    at async Emitter.forwardEvent (file://…/labflow-lite/node_modules/@mswjs/interceptors/lib/node/batch-interceptor-C3czWxt2.js:72:4)
    at async Emitter.emitAsPromise (file://…/labflow-lite/node_modules/rettime/build/index.mjs:182:24)
 ❯ demo6/api-gia.test.jsx (5 tests | 1 failed | 4 skipped) 42ms
   ❯ a screen that fetches: four states (5)
     ↓ loading first, then the table
     ↓ empty
     × 403 → not an admin 37ms
     ↓ 500, then Try again works
     ↓ network down

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo6/api-gia.test.jsx > a screen that fetches: four states > 403 → not an admin
Error: expect(element).toHaveTextContent()

Expected element to have text content:
  Only admins can see all bookings.
Received:
  Could not load the bookings.Try again
 ❯ demo6/api-gia.test.jsx:39:46
     37|     server.use(list(403, { error: { code: 'FORBIDDEN' } }));
     38|     show();
     39|     expect(await screen.findByRole('alert')).toHaveTextContent('Only a…
       |                                              ^
     40|   });
     41|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 4 skipped (5)
   Start at  03:23:27
   Duration  412ms (environment 46%, setup 21%, import 15%, tests 13%, transform 4%, worker 1%)`,
  '61-happy': `$ npx vitest run --config vitest.web.config.js --environment happy-dom web/

 RUN  v5.0.5 …/labflow-lite

 ✓ web/AdminBookings.test.jsx (4 tests) 58ms
   ✓ AdminBookings (4)
     ✓ a table with one row per booking 30ms
     ✓ an empty list says so 5ms
     ✓ 403 → only admins 4ms
     ✓ a failure offers Try again, and it works 18ms
 ✓ web/BookingForm.test.jsx (12 tests) 806ms
   ✓ BookingForm (12)
     ✓ every field is reachable by its label 19ms
     ✓ sends what the user typed, once, and says it is booked 95ms
     ✓ a PENDING booking says it waits for approval 74ms
     ✓ seats 0 → refused in the browser: true 67ms
     ✓ seats 1 → refused in the browser: false 66ms
     ✓ seats 200 → refused in the browser: false 63ms
     ✓ seats 201 → refused in the browser: true 66ms
     ✓ while waiting, the button is disabled and a second click sends nothing 77ms
     ✓ a 400 from the server is shown on its field 70ms
     ✓ 409 OVERLAP → an alert users hear 71ms
     ✓ 422 TOO_LONG → an alert users hear 69ms
     ✓ 500 INTERNAL → an alert users hear 69ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  03:23:25
   Duration  1.17s (tests 61%, environment 24%, setup 10%, import 4%, transform 1%)`,
  '61-jsdom': `$ npx vitest run --config vitest.web.config.js --environment jsdom web/

 RUN  v5.0.5 …/labflow-lite

 ✓ web/AdminBookings.test.jsx (4 tests) 138ms
   ✓ AdminBookings (4)
     ✓ a table with one row per booking 103ms
     ✓ an empty list says so 5ms
     ✓ 403 → only admins 6ms
     ✓ a failure offers Try again, and it works 23ms
 ✓ web/BookingForm.test.jsx (12 tests) 1023ms
   ✓ BookingForm (12)
     ✓ every field is reachable by its label 27ms
     ✓ sends what the user typed, once, and says it is booked 168ms
     ✓ a PENDING booking says it waits for approval 85ms
     ✓ seats 0 → refused in the browser: true 79ms
     ✓ seats 1 → refused in the browser: false 78ms
     ✓ seats 200 → refused in the browser: false 81ms
     ✓ seats 201 → refused in the browser: true 75ms
     ✓ while waiting, the button is disabled and a second click sends nothing 95ms
     ✓ a 400 from the server is shown on its field 83ms
     ✓ 409 OVERLAP → an alert users hear 86ms
     ✓ 422 TOO_LONG → an alert users hear 84ms
     ✓ 500 INTERNAL → an alert users hear 82ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  03:23:23
   Duration  1.60s (tests 54%, environment 35%, setup 7%, import 2%, transform 1%)`,
  '61-th': `$ npx vitest run --config vitest.web.config.js demo6/th61.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/th61.test.jsx (2 tests) 95ms
   ✓ practice 6.1 (2)
     ✓ while the request is pending, the screen says it is loading 67ms
     ✓ the table has the five column headers users read 27ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:23:28
   Duration  613ms (environment 66%, tests 18%, setup 13%, transform 2%, import 1%)`,
  '61-truy-van': `$ npx vitest run --config vitest.web.config.js demo6/truy-van.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/truy-van.test.jsx (3 tests) 123ms
   ✓ find elements the way a user does (3)
     ✓ by role and accessible name 97ms
     ✓ by label, for inputs without a simple role 7ms
     ✓ getBy throws, queryBy returns null 18ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  03:23:20
   Duration  643ms (environment 63%, tests 22%, setup 12%, transform 2%, import 1%)`,
  '62-quen-await': `$ npx vitest run --config vitest.web.config.js demo6/quen-await.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ❯ demo6/quen-await.test.jsx (2 tests | 1 failed) 1034ms
   ✓ WRONG — findBy without await: a Promise is always truthy 28ms
   × RIGHT — await it, and the missing message fails the test 1005ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo6/quen-await.test.jsx > RIGHT — await it, and the missing message fails the test
TestingLibraryElementError: Unable to find role="status"

Ignored nodes: comments, script, style
<body>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
</body>

Ignored nodes: comments, script, style
<body>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
</body>
 ❯ waitForWrapper node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ demo6/quen-await.test.jsx:13:23
     11| it('RIGHT — await it, and the missing message fails the test', async (…
     12|   render(<BookingForm onSubmit={vi.fn()} />);
     13|   expect(await screen.findByRole('status')).toBeInTheDocument();
       |                       ^
     14| });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯

⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯

Vitest caught 1 unhandled error during the test run.
This might cause false positive tests. Resolve unhandled errors to make sure your tests are not affected.

⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯
TestingLibraryElementError: Unable to find role="status"

Ignored nodes: comments, script, style
<body>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
</body>

Ignored nodes: comments, script, style
<body>
  <div>
    <form
      aria-label="Book a lab"
      novalidate=""
    >
      <p>
        <label
          for="booking-lab"
        >
          Lab
        </label>
        <input
          id="booking-lab"
          name="lab"
          value="BE-201"
        />
      </p>
      <p>
        <label
          for="booking-date"
        >
          Date
        </label>
        <input
          id="booking-date"
          name="date"
          type="date"
        />
      </p>
      <p>
        <label
          for="booking-start"
        >
          Start
        </label>
        <input
          id="booking-start"
          name="start"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-end"
        >
          End
        </label>
        <input
          id="booking-end"
          name="end"
          type="time"
        />
      </p>
      <p>
        <label
          for="booking-seats"
        >
          Seats
        </label>
        <input
          id="booking-seats"
          name="seats"
          type="number"
        />
      </p>
      <button
        type="submit"
      >
        Book
      </button>
    </form>
  </div>
</body>
 ❯ waitForWrapper node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ demo6/quen-await.test.jsx:8:17
      6| it('WRONG — findBy without await: a Promise is always truthy', () => {
      7|   render(<BookingForm onSubmit={vi.fn()} />);
      8|   expect(screen.findByRole('status')).toBeTruthy();
       |                 ^
      9| });
     10|
 ❯ node_modules/vitest/dist/chunks/run.BPv-BBRv.js:1632:35
 ❯ node_modules/vitest/dist/chunks/run.BPv-BBRv.js:2801:26
 ❯ node_modules/vitest/dist/chunks/run.BPv-BBRv.js:3338:20
 ❯ runWithCancel node_modules/vitest/dist/chunks/run.BPv-BBRv.js:3333:10
 ❯ node_modules/vitest/dist/chunks/run.BPv-BBRv.js:3318:20

This error originated in "demo6/quen-await.test.jsx" test file. It doesn't mean the error was thrown inside the file itself, but while it was running.
The last test to run before this error was "RIGHT — await it, and the missing message fails the test". This means either:
- the error was thrown while Vitest was running this test, or
- the error was thrown after the test completed, and this was the most recent test at that point.
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
     Errors  1 error
   Start at  03:34:21
   Duration  1.84s (tests 59%, environment 34%, setup 6%, transform 1%)`,
  '62-th': `$ npx vitest run --config vitest.web.config.js demo6/th62.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/th62.test.jsx (2 tests) 324ms
   ✓ practice 6.2 (2)
     ✓ while waiting: "Booking…", disabled, and a second click sends nothing 229ms
     ✓ a 400 from the server is shown next to its field 94ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:23:30
   Duration  853ms (environment 45%, tests 42%, setup 9%, import 3%, transform 1%)`,
  '62-tuong-tac': `$ npx vitest run --config vitest.web.config.js demo6/tuong-tac.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/tuong-tac.test.jsx (3 tests) 381ms
   ✓ typing, clicking, waiting (3)
     ✓ sends exactly what the user typed 194ms
     ✓ shows its own errors and does not call the API 111ms
     ✓ pressing Enter submits too 74ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  03:23:29
   Duration  943ms (tests 44%, environment 44%, setup 8%, import 3%, transform 1%)`,
  '63-api-gia': `$ npx vitest run --config vitest.web.config.js demo6/api-gia.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/api-gia.test.jsx (5 tests) 187ms
   ✓ a screen that fetches: four states (5)
     ✓ loading first, then the table 126ms
     ✓ empty 10ms
     ✓ 403 → not an admin 9ms
     ✓ 500, then Try again works 30ms
     ✓ network down 7ms

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Start at  03:23:32
   Duration  750ms (environment 53%, tests 28%, setup 10%, import 7%, transform 2%)`,
  '63-th': `$ npx vitest run --config vitest.web.config.js demo6/th63.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/th63.test.jsx (2 tests) 315ms
   ✓ practice 6.3 (2)
     ✓ 409 from the real client → the slot-taken message 213ms
     ✓ network down → the connection message 97ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  03:23:35
   Duration  879ms (environment 45%, tests 39%, setup 8%, import 5%, transform 2%)`,
  '63-url': `$ npx vitest run --config vitest.web.config.js demo6/url-tuong-doi.test.jsx

 RUN  v5.0.5 …/labflow-lite

 ❯ demo6/url-tuong-doi.test.jsx (2 tests | 1 failed) 1017ms
   ✓ Node’s fetch refuses a relative URL 2ms
   × RED ON PURPOSE — the screen only says “could not load” 1015ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo6/url-tuong-doi.test.jsx > RED ON PURPOSE — the screen only says “could not load”
TestingLibraryElementError: Unable to find role="table"

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      role="alert"
    >
      <p>
        Could not load the bookings.
      </p>
      <button
        type="button"
      >
        Try again
      </button>
    </div>
  </div>
</body>

Ignored nodes: comments, script, style
<body>
  <div>
    <div
      role="alert"
    >
      <p>
        Could not load the bookings.
      </p>
      <button
        type="button"
      >
        Try again
      </button>
    </div>
  </div>
</body>
 ❯ waitForWrapper node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ demo6/url-tuong-doi.test.jsx:13:23
     11| it('RED ON PURPOSE — the screen only says “could not load”', async () …
     12|   render(<AdminBookings client={createClient({ token: 't' })} />);
     13|   expect(await screen.findByRole('table')).toBeInTheDocument();
       |                       ^
     14| });
     15|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 1 passed (2)
   Start at  03:23:33
   Duration  1.56s (tests 69%, environment 25%, setup 5%, transform 1%)`,
  '64-route': `$ npx vitest run --config vitest.web.config.js demo6/route.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/route.test.js (3 tests) 34ms
   ✓ route handler: a function from Request to Response (3)
     ✓ free slots of BE-201 on one day 25ms
     ✓ 400 without a date 1ms
     ✓ 502 when the LabFlow API is down 4ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  03:23:36
   Duration  248ms (setup 43%, import 29%, tests 20%, transform 6%, worker 1%)`,
  '64-server': `$ npx vitest run --config vitest.web.config.js demo6/server-component.test.jsx

 RUN  v5.0.5 …/labflow-lite

stderr | demo6/server-component.test.jsx > an async Server Component > RED ON PURPOSE — rendered as a normal component
<BookingPage> is an async Client Component. Only Server Components can be async at the moment. This error is often caused by accidentally adding \`'use client'\` to a module that was originally written for the server.

stderr | demo6/server-component.test.jsx > an async Server Component > RED ON PURPOSE — rendered as a normal component
A component suspended inside an \`act\` scope, but the \`act\` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:

await act(() => ...)

 ❯ demo6/server-component.test.jsx (3 tests | 1 failed) 1111ms
   ❯ an async Server Component (3)
     ✓ await the component like a function, then render what it returned 96ms
     ✓ a missing booking 5ms
     × RED ON PURPOSE — rendered as a normal component 1006ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  demo6/server-component.test.jsx > an async Server Component > RED ON PURPOSE — rendered as a normal component
TestingLibraryElementError: Unable to find role="heading" and name "Booking #1"

Ignored nodes: comments, script, style
<body>
  <div />
</body>

Ignored nodes: comments, script, style
<body>
  <div />
</body>
 ❯ waitForWrapper node_modules/@testing-library/dom/dist/wait-for.js:163:27
 ❯ node_modules/@testing-library/dom/dist/query-helpers.js:86:33
 ❯ demo6/server-component.test.jsx:29:25
     27|   it('RED ON PURPOSE — rendered as a normal component', async () => {
     28|     render(<BookingPage params={Promise.resolve({ id: '1' })} />);
     29|     expect(await screen.findByRole('heading', { name: 'Booking #1' }))…
       |                         ^
     30|   });
     31| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 2 passed (3)
   Start at  03:23:37
   Duration  1.65s (tests 71%, environment 22%, setup 4%, import 2%, transform 1%)`,
  '64-th': `$ npx vitest run --config vitest.web.config.js demo6/th64.test.js

 RUN  v5.0.5 …/labflow-lite

 ✓ demo6/th64.test.js (3 tests) 15ms
   ✓ practice 6.4 (3)
     ✓ an empty day has 28 free slots, 07:00 … 20:30 2ms
     ✓ touching slots stay free around 08:00–10:00 1ms
     ✓ the route answers 400 without a lab 12ms

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  03:23:39
   Duration  180ms (setup 67%, tests 14%, transform 12%, import 4%, worker 2%)`,
  'lab6-mut-strong': `$ node scripts/dot-bien-6.mjs
✔ killed    #1 errors are not announced as alerts
✔ killed    #2 labels no longer point at their inputs
✔ killed    #3 a double click books twice
✔ killed    #4 201 seats allowed in the browser
✔ killed    #5 server field errors are dropped
✔ killed    #6 pending and confirmed messages swapped
✔ killed    #7 403 shown as a generic failure
✔ killed    #8 Try again does nothing

8/8 mutants killed`,
  'lab6-mut-weak': `$ node scripts/dot-bien-6.mjs
✘ SURVIVED  #1 errors are not announced as alerts
✘ SURVIVED  #2 labels no longer point at their inputs
✘ SURVIVED  #3 a double click books twice
✘ SURVIVED  #4 201 seats allowed in the browser
✘ SURVIVED  #5 server field errors are dropped
✔ killed    #6 pending and confirmed messages swapped
✘ SURVIVED  #7 403 shown as a generic failure
✘ SURVIVED  #8 Try again does nothing

1/8 mutants killed`,
  'lab6-ref': `$ npm run test:web

> labflow-lite@1.0.0 test:web
> vitest run --config vitest.web.config.js web/


 RUN  v5.0.5 …/labflow-lite

 ✓ web/AdminBookings.test.jsx (4 tests) 144ms
   ✓ AdminBookings (4)
     ✓ a table with one row per booking 103ms
     ✓ an empty list says so 5ms
     ✓ 403 → only admins 5ms
     ✓ a failure offers Try again, and it works 30ms
 ✓ web/BookingForm.test.jsx (12 tests) 1004ms
   ✓ BookingForm (12)
     ✓ every field is reachable by its label 27ms
     ✓ sends what the user typed, once, and says it is booked 170ms
     ✓ a PENDING booking says it waits for approval 90ms
     ✓ seats 0 → refused in the browser: true 84ms
     ✓ seats 1 → refused in the browser: false 80ms
     ✓ seats 200 → refused in the browser: false 75ms
     ✓ seats 201 → refused in the browser: true 83ms
     ✓ while waiting, the button is disabled and a second click sends nothing 87ms
     ✓ a 400 from the server is shown on its field 77ms
     ✓ 409 OVERLAP → an alert users hear 77ms
     ✓ 422 TOO_LONG → an alert users hear 76ms
     ✓ 500 INTERNAL → an alert users hear 76ms

 Test Files  2 passed (2)
      Tests  16 passed (16)
   Start at  03:23:50
   Duration  1.60s (tests 53%, environment 37%, setup 7%, import 2%, transform 1%)`,
  'lab6-unit': `$ npm run test:unit

> labflow-lite@1.0.0 test:unit
> vitest run src/


 RUN  v5.0.5 …/labflow-lite

 ✓ src/rules/days.test.js (4 tests) 4ms
   ✓ daysAheadVN (BR-05 counted in Viet Nam time) (4)
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-16 is 14 days ahead 2ms
     ✓ now 2026-11-02T23:59:00+07:00 → 2026-11-16 is 14 days ahead 0ms
     ✓ now 2026-11-03T00:00:00+07:00 → 2026-11-16 is 13 days ahead 0ms
     ✓ now 2026-11-02T06:30:00+07:00 → 2026-11-02 is 0 days ahead 0ms
 ✓ src/auth/login-guard.test.js (5 tests) 3ms
   ✓ createLoginGuard (BR-02: 5 failures → locked 15 minutes) (5)
     ✓ 4 failures do not lock 1ms
     ✓ the 5th failure locks 0ms
     ✓ still locked at 14:59.999, unlocked at exactly 15:00 0ms
     ✓ a successful login resets the counter 0ms
     ✓ locks only the account that failed 0ms
 ✓ src/lib/retry.test.js (3 tests) 10ms
   ✓ retry (3)
     ✓ returns at once when the first attempt works 4ms
     ✓ waits 1 s then 2 s between attempts 2ms
     ✓ gives up after 3 attempts and rethrows the last error 3ms
 ✓ src/rules/time.test.js (12 tests) 13ms
   ✓ parseTime (10)
     ✓ 00:00 → 0 1ms
     ✓ 07:00 → 420 0ms
     ✓ 21:30 → 1290 0ms
     ✓ 23:59 → 1439 0ms
     ✓ throws TypeError for "7:00" 0ms
     ✓ throws TypeError for "07-00" 0ms
     ✓ throws TypeError for "" 0ms
     ✓ throws TypeError for "abc" 0ms
     ✓ throws RangeError for 24:00 0ms
     ✓ throws RangeError for 07:60 0ms
   ✓ formatTime (2)
     ✓ pads to HH:MM 0ms
     ✓ round-trips with parseTime for every minute of the day 9ms
 ✓ src/rules/booking.test.js (28 tests) 11ms
   ✓ checkSlot (11)
     ✓ accepts (4)
       ✓ 07:00–08:00 (60 min) 1ms
       ✓ 20:00–21:00 (60 min) 0ms
       ✓ 08:00–08:30 (30 min) 0ms
       ✓ 08:00–12:00 (240 min) 0ms
     ✓ rejects (7)
       ✓ 06:30–08:00 with OUTSIDE_HOURS 0ms
       ✓ 20:00–21:30 with OUTSIDE_HOURS 0ms
       ✓ 08:15–09:00 with OFF_GRID 0ms
       ✓ 08:00–09:10 with OFF_GRID 0ms
       ✓ 10:00–09:00 with END_BEFORE_START 5ms
       ✓ 09:00–09:00 with END_BEFORE_START 0ms
       ✓ 08:00–12:30 with TOO_LONG 0ms
   ✓ isWithinBookingWindow (BR-05) (8)
     ✓ -1 days → false 0ms
     ✓ 0 days → true 0ms
     ✓ 14 days → true 0ms
     ✓ 15 days → false 0ms
     ✓ rejects 1.5 0ms
     ✓ rejects NaN 0ms
     ✓ rejects 3 0ms
     ✓ rejects null 0ms
   ✓ needsApproval (BR-06 decision table) (7)
     ✓ STUDENT, 30 seats → false 0ms
     ✓ STUDENT, 31 seats → true 0ms
     ✓ LECTURER, 31 seats → false 0ms
     ✓ ADMIN, 31 seats → false 0ms
     ✓ throws RangeError for 0 seats 0ms
     ✓ throws RangeError for -5 seats 0ms
     ✓ throws RangeError for 2.5 seats 0ms
   ✓ createBooking (2)
     ✓ builds a PENDING booking for 31 seats 0ms
     ✓ throws the rule code for a bad slot 1ms
 ✓ src/booking/service.test.js (6 tests) 63ms
   ✓ bookLab (6)
     ✓ stores a confirmed booking 16ms
     ✓ rejects a rule violation with its code before touching the database 1ms
     ✓ rejects an overlapping booking with OVERLAP 19ms
     ✓ accepts the slot that starts when the previous one ends 26ms
     ✓ turns a failing lookup into STORAGE_DOWN and keeps the cause 1ms
     ✓ turns a failing insert into STORAGE_DOWN 0ms
 ✓ src/notify/notify.test.js (7 tests) 56ms
   ✓ buildMail (pure) (2)
     ✓ CONFIRMED booking with 20 seats → mail to an@fpt.edu.vn 1ms
     ✓ PENDING booking with 31 seats → mail to approvals@labflow.example 0ms
   ✓ bookAndNotify (5)
     ✓ a confirmed booking e-mails the student once 13ms
     ✓ a 31-seat student booking e-mails only the approver 13ms
     ✓ a failed e-mail keeps the booking and reports notified: false 13ms
     ✓ a failed e-mail is logged with the booking id and the reason 13ms
     ✓ a rejected booking sends no e-mail 1ms
 ✓ src/lib/mailer.test.js (4 tests) 51ms
   ✓ createHttpMailer (4)
     ✓ posts { to, subject } with a Bearer key and returns the id 32ms
     ✓ 429 → RATE_LIMITED 5ms
     ✓ 400 → MAIL_FAILED with the status as the cause 5ms
     ✓ 503 → MAIL_FAILED with the status as the cause 4ms
 ✓ src/rules/cancel.test.js (4 tests) 3ms
   ✓ canCancel (Lite-3: until 60 minutes before the start) (4)
     ✓ at 07:00, a 09:00 booking can be cancelled → true 1ms
     ✓ at 08:00, a 09:00 booking can be cancelled → true 0ms
     ✓ at 08:01, a 09:00 booking can be cancelled → false 0ms
     ✓ at 09:30, a 09:00 booking can be cancelled → false 0ms
 ✓ src/api/server.test.js (12 tests) 179ms
   ✓ POST /api/bookings (4)
     ✓ 201 with Location and the public booking 38ms
     ✓ 401 without a token 4ms
     ✓ 400 VALIDATION for seats 0, and for a role in the body 6ms
     ✓ 422 for a rule, 409 for a taken slot 25ms
   ✓ who may read what (8)
     ✓ the owner reading booking 1 → 200 23ms
     ✓ another student reading booking 1 → 404 24ms
     ✓ a lecturer reading booking 1 → 404 23ms
     ✓ an admin reading booking 1 → 200 22ms
     ✓ STUDENT on the admin list → 403 2ms
     ✓ LECTURER on the admin list → 403 1ms
     ✓ ADMIN on the admin list → 200 8ms
     ✓ an expired token → 401 (clock fixed in 2030) 2ms

 Test Files  10 passed (10)
      Tests  85 passed (85)
   Start at  03:24:11
   Duration  540ms (tests 34%, transform 32%, import 32%, worker 3%)`,
  'lab6-weak-run': `$ npm run test:web

> labflow-lite@1.0.0 test:web
> vitest run --config vitest.web.config.js web/


 RUN  v5.0.5 …/labflow-lite

 ✓ web/weak6.test.jsx (4 tests) 62ms
   ✓ submits the form 40ms
   ✓ shows an error for a taken slot 9ms
   ✓ shows the list 8ms
   ✓ shows something when the list fails 4ms

 Test Files  1 passed (1)
      Tests  4 passed (4)
   Start at  03:23:40
   Duration  583ms (environment 71%, setup 13%, tests 12%, transform 2%, import 1%)`,
};
