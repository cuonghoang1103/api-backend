// GET /api/slots?lab=BE-201&date=2026-11-16 — a Next.js route handler is a function from Request to Response.
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
}
