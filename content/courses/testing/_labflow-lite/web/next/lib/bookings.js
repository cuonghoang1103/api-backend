// Server-side data access for the Next.js app: it calls the LabFlow Lite API with a service token.
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
}
