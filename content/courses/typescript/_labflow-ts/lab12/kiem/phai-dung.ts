import type { CreateBooking, BookingFormProps } from '../form.ts';
import { useBookingForm } from '../form.ts';

const booking: CreateBooking = { lab: 'BE-201', seats: 40 };
const props: BookingFormProps = { onSubmit: (b: CreateBooking) => { void b; } };

const form = useBookingForm();
form.onLabChange({ target: { value: 'BE-201' } });
form.onSeatsChange({ target: { value: '40' } });
const made: CreateBooking = form.submit();

export { booking, props, made };
