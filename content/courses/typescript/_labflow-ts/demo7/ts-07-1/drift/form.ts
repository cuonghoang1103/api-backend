type Lab = { code: string; capacity: number; floor: number };

// A "form" version where every field is a string (text inputs). Hand-written — and already out of date:
// it is missing `floor`, and tsc cannot tell, because it is a separate type.
type LabForm = { code: string; capacity: string };

const form: LabForm = { code: 'BE-201', capacity: '40' }; // no error — floor silently dropped
export { form };
void (null as unknown as Lab);
