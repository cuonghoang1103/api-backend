type Lab = { code: string; capacity: number; floor: number };

// A mapped type: for every key K of Lab, make the field a string. One line, always in sync.
type Stringify<T> = { [K in keyof T]: string };
type LabForm = Stringify<Lab>; // { code: string; capacity: string; floor: string }

const form: LabForm = { code: 'BE-201', capacity: '40', floor: '2' };
console.log(form);
