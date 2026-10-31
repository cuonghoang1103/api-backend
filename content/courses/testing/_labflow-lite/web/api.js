// The browser side of the LabFlow Lite API (Chapter 6). fetch is a parameter, like the clock in Chapter 2.
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
}
