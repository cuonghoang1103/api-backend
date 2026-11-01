import type { Lab } from '../shape/lab.ts';

const ai: Lab = { code: 'AL-301', name: 'AI Lab' };                                // forgot the capacity
const empty: Lab = { code: 'BE-202' };                                              // forgot two properties
const fromForm: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: '40' };   // a form field is text
export { ai, empty, fromForm };
