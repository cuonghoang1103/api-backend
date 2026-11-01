enum Status {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
}

class BookingRepo {
  constructor(private rows: string[]) {}
  count(): number {
    return this.rows.length;
  }
}

console.log(Status.Pending, new BookingRepo(['BE-201']).count());
