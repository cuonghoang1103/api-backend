import type { Lab } from '../shape/lab.ts';

const withFloor: Lab = { code: 'BE-201', name: 'Backend Lab 1', capacity: 40, floor: 2 }; // a key Lab does not have
const typo: Lab = { code: 'BE-201', name: 'Backend Lab 1', capasity: 40 };                 // the admin form's typo
export { withFloor, typo };
