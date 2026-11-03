const labs: string[] = ['BE-201', 'BE-202', 'AL-301'];
export const found = labs.findLast((c: string) => c.startsWith('AL')); // the course lib (es2024) knows findLast
console.log(found);
