// An async Server Component: it awaits data on the server and returns markup. No hooks, no state.
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
}
