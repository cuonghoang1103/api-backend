import * as z from './zod.ts';
export const UserInput = z.object({ email: z.string() });
// Derive the type from the schema instead of hand-writing it.
type UserManual = z.Infer<typeof UserInput>;
const parsed: z.Infer<typeof UserInput> = UserInput.parse({ email: 'a@b.com' });
export const u: UserManual = parsed;
console.log(u.email);
