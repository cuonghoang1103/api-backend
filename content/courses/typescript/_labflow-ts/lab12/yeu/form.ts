import { h } from './react.ts';

export type CreateBooking = { lab: string; seats: number };
export type BookingFormProps = { onSubmit: (booking: CreateBooking) => void };
export type BookingForm = any;

export function useBookingForm(): any {
  const form: any = {
    lab: '',
    seats: 0,
    onLabChange(e: any) { form.lab = e.target.value; },
    onSeatsChange(e: any) { form.seats = Number(e.target.value); },
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView = (props: BookingFormProps) => h('form', { onSubmit: props.onSubmit });
