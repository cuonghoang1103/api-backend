type BookingAction = 'created' | 'confirmed' | 'cancelled';

// A template literal type builds strings from other types. Each action becomes "booking:<action>".
type BookingEvent = `booking:${BookingAction}`; // 'booking:created' | 'booking:confirmed' | 'booking:cancelled'

const e1: BookingEvent = 'booking:created';
const e2: BookingEvent = 'booking:cancelled';
console.log(e1, e2);
