type BookingAction = 'created' | 'confirmed' | 'cancelled';
type BookingEvent = `booking:${BookingAction}`;

const bad: BookingEvent = 'booking:creatd'; // a typo in the action
export { bad };
