'use client';
// My bookings (Chapter 11, US-11): the student's own bookings, with a Cancel button on each one that is still active.
// The server decides who may cancel and until when (Lite-3); this screen shows what it answered.
import { useCallback, useEffect, useState } from 'react';

export const CANCEL_MESSAGES = {
  TOO_LATE_TO_CANCEL: 'Too late to cancel: the booking starts in less than 1 hour.',
  ALREADY_CANCELLED: 'This booking was already cancelled.',
  NOT_FOUND: 'This booking no longer exists.',
};

export function MyBookings({ client }) {
  const [state, setState] = useState({ phase: 'loading' });
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState(null);

  const load = useCallback(async () => {
    setState({ phase: 'loading' });
    try {
      const res = await client.listMine();
      setState(res.status === 200 ? { phase: 'done', bookings: res.data } : { phase: 'failed' });
    } catch {
      setState({ phase: 'failed' });
    }
  }, [client]);

  useEffect(() => { load(); }, [load]);

  const replace = (row) => setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.id === row.id ? row : b)) }));

  async function cancel(booking) {
    setBusyId(booking.id);
    setNotice(null);
    try {
      const res = await client.cancelBooking(booking.id);
      if (res.status === 200) {
        replace(res.data);
        setNotice({ ok: true, text: 'Cancelled ' + booking.lab + ' on ' + booking.date + ', ' + booking.start + '–' + booking.end + '.' });
      } else {
        const code = res.data.error.code;
        if (code === 'ALREADY_CANCELLED') replace({ ...booking, status: 'CANCELLED' });   // the server knows better: show it
        setNotice({ ok: false, text: CANCEL_MESSAGES[code] ?? 'Could not cancel. Try again.' });
      }
    } catch {
      setNotice({ ok: false, text: 'Cannot reach the server. Check your connection.' });
    } finally {
      setBusyId(null);
    }
  }

  if (state.phase === 'loading') return <p role="status">Loading your bookings…</p>;
  if (state.phase === 'failed') {
    return (
      <div role="alert">
        <p>Could not load your bookings.</p>
        <button type="button" onClick={load}>Try again</button>
      </div>
    );
  }
  if (state.bookings.length === 0) return <p>You have no bookings yet.</p>;
  return (
    <>
      <table aria-label="My bookings">
        <thead><tr><th>Lab</th><th>Date</th><th>Time</th><th>Seats</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {state.bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.lab}</td><td>{b.date}</td><td>{b.start}–{b.end}</td><td>{b.seats}</td><td>{b.status}</td>
              <td>
                {b.status !== 'CANCELLED' && (
                  <button type="button" disabled={busyId !== null} aria-label={'Cancel ' + b.lab + ' on ' + b.date + ' at ' + b.start}
                    onClick={() => cancel(b)}>
                    {busyId === b.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {notice && <p role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    </>
  );
}
