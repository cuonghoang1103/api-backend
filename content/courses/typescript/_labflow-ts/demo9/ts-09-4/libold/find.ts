// Array.prototype.findLast needs the es2023 lib; with an older lib it is not known.
const labs: string[] = ['BE-201', 'BE-202', 'AL-301'];
export const found = labs.findLast((c: string) => c.startsWith('AL'));
