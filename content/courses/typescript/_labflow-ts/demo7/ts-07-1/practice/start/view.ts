type Booking = { id: number; lab: string; seats: number };

// A hand-written "display" type where every field is a string. It has drifted: `seats` is missing.
type BookingView = { id: string; lab: string };

const view: BookingView = { id: '1', lab: 'BE-201' };
export { view };
void (null as unknown as Booking);
