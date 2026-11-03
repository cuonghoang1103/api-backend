import * as z from './zod.ts';
export const UserInput = z.object({ email: z.string() });
// A hand-written type that drifted: it claims a 'name' the schema never had.
type UserManual = { email: string; name: string };
const parsed: z.Infer<typeof UserInput> = UserInput.parse({ email: 'a@b.com' });
export const u: UserManual = parsed;
