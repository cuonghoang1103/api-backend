type Booking = { id: number; lab: string; seats: number };

type Stringify<T> = { [K in keyof T]: string };
type BookingView = Stringify<Booking>;

const view: BookingView = { id: '1', lab: 'BE-201', seats: '40' };
console.log(view);
