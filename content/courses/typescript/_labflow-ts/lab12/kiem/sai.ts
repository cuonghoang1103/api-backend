import type { CreateBooking, BookingForm, BookingFormProps } from '../form.ts';
import { useBookingForm } from '../form.ts';

const s1: CreateBooking = { lab: 'BE-201' };                          // S1 TS2741 a create body is missing seats
const s2: CreateBooking = { lab: 'BE-201', seats: 40, id: 'bk_1' };   // S2 TS2353 a create body must not carry a server id
const s3: CreateBooking = { lab: 'BE-201', seats: 'forty' };          // S3 TS2322 seats must be a number
const s4 = useBookingForm().onSeatsChange({ value: '40' });           // S4 TS2353 a change event needs target.value, not a bare value
const s5: BookingFormProps = {};                                      // S5 TS2741 props is missing onSubmit
const s6: BookingFormProps = { onSubmit: (n: number) => { void n; } };// S6 TS2322 onSubmit takes a CreateBooking
const s7: string = useBookingForm().seats;                            // S7 TS2322 seats is a number, not a string
const s8 = useBookingForm().submit().purpose;                         // S8 TS2339 CreateBooking has no purpose
const _bf: BookingForm = useBookingForm();

export { s1, s2, s3, s4, s5, s6, s7, s8, _bf };
