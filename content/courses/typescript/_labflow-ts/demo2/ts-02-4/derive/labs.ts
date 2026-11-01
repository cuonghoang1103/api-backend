// ONE source of truth: the list is data (Node can loop over it) AND the type is derived from it.
export const LABS = ['BE-201', 'BE-202', 'AL-301'] as const;
export type LabCode = (typeof LABS)[number];

// The two steps of that last line, named so you can read them in the .d.ts:
export type LabsTuple = typeof LABS;          // "the type of the value LABS"
export type AnyElement = LabsTuple[number];   // "the type at any number index"

// The same list WITHOUT as const, to compare.
export const LABS_LOOSE = ['BE-201', 'BE-202', 'AL-301'];
export type LabCodeLoose = (typeof LABS_LOOSE)[number];
