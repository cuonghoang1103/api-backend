// The erasable way: a union of string literals + an ordinary field.
type Status = 'PENDING' | 'CONFIRMED';

class BookingRepo {
  private rows: string[];
  constructor(rows: string[]) {
    this.rows = rows;
  }
  count(): number {
    return this.rows.length;
  }
}

const s: Status = 'PENDING';
console.log(s, new BookingRepo(['BE-201']).count());
