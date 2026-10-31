'use client';
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
}
