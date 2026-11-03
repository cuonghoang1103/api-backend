// Two shapes with no shared label: narrow with the `in` operator.
type Contact = { email: string } | { phone: string };

export function reach(c: Contact): string {
  if ('email' in c) return 'mail ' + c.email; // c: { email: string }
  return 'call ' + c.phone;                    // c: { phone: string }
}

console.log(reach({ email: 'an.nv@fpt.edu.vn' }));
console.log(reach({ phone: '0905-123-456' }));
