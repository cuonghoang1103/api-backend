type Pending = { status: 'PENDING' };
type Confirmed = { status: 'CONFIRMED'; approvedBy: string };
export type BookingState = Pending | Confirmed;

// A type alias can combine anything with &; an interface can only extend a shape whose members are known.
export type StateWithLab = BookingState & { lab: string };
export interface StateWithLabI extends BookingState {
  lab: string;
}
