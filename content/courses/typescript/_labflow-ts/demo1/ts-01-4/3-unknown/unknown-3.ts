// A leak to know about: Array.isArray turns unknown into any[].
const data: unknown = JSON.parse('[{"minute":60}]');

if (Array.isArray(data)) {
  const total: string = data[0].minutes;   // no error — the elements are any
  console.log(total);
}
