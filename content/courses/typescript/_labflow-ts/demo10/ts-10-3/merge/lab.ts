export interface Lab { code: string; }
export interface Lab { seats: number; }   // merges with the one above
const be: Lab = { code: 'BE-201', seats: 40 };  // must have BOTH fields
console.log(be.code, be.seats);
