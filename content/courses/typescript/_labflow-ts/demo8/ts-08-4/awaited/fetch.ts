type Booking = { id: number; lab: string };
async function fetchBooking(id: number): Promise<Booking> {
  return { id, lab: 'BE-201' };
}

// Awaited unwraps the Promise — the type you actually have after await.
type Loaded = Awaited<ReturnType<typeof fetchBooking>>;
async function main() {
  const b: Loaded = await fetchBooking(1);
  console.log(b.id, b.lab);
}
main();
