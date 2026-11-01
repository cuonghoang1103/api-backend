type Role = 'STUDENT' | 'LECTURER' | 'ADMIN';

const role: Role = 'student';                              // line 3
const seats: number = Number('31');                        // line 4
const minutes: number = JSON.parse('{"m":"90"}').m;        // line 5
console.log('half:', minutes / 2, 'role:', role);          // line 6
const lab = { code: 'BE-201' } as unknown as { name: string };
console.log(lab.name.toUpperCase());                       // line 8
