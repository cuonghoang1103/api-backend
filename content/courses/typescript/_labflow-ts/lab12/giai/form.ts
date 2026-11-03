import type { ChangeEvent, FC } from './react.ts';
import { h } from './react.ts';

export type CreateBooking = { lab: string; seats: number };
export type BookingFormProps = { onSubmit: (booking: CreateBooking) => void };
export type BookingForm = {
  lab: string;
  seats: number;
  onLabChange(e: ChangeEvent): void;
  onSeatsChange(e: ChangeEvent): void;
  submit(): CreateBooking;
};

export function useBookingForm(): BookingForm {
  const form: BookingForm = {
    lab: '',
    seats: 0,
    onLabChange(e) { form.lab = e.target.value; },
    onSeatsChange(e) { form.seats = Number(e.target.value); },
    submit() { return { lab: form.lab, seats: form.seats }; },
  };
  return form;
}

export const BookingFormView: FC<BookingFormProps> = (props) => {
  const form = useBookingForm();
  return h('form', { onSubmit: props.onSubmit, 'data-lab': form.lab }, 'seats: ' + form.seats);
};
