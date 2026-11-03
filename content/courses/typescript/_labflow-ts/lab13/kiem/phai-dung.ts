import type { BookingInput, Created } from '../schema.ts';
import { createBooking } from '../schema.ts';

const booking: BookingInput = { lab: 'BE-201', seats: 40 };
const ok: Created = { success: true, data: booking };

const result = createBooking({ lab: 'BE-201', seats: 40 });
const lab: string = result.success ? result.data.lab : 'none';

export { booking, ok, lab };
