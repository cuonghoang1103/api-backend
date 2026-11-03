import * as z from './zod.ts';
const LabInput = z.object({ code: z.string(), seats: z.number() });
type LabInput = z.Infer<typeof LabInput>;
const lab: LabInput = LabInput.parse({ code: 'BE-201', seats: 40 });
// The schema has code, not name.
export const n = lab.name;
