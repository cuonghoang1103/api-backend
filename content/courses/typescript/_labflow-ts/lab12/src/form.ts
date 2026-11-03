import { h } from './react.ts';

// TODO: replace the 'any' types with real ones (CreateBooking, BookingFormProps, BookingForm).
export type CreateBooking = any;
export type BookingFormProps = any;
export type BookingForm = any;

export function useBookingForm(): any {
  const form: any = {
    lab: '',
    seats: 0,
    onLabChange(e: any) { form.lab = e.target.value; },
    onSeatsChange(e: any) { form.seats = e.target.value; },   // bug: forgot Number()
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView: any = (props: any) => h('form', {});
