type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode { return s as LabCode; }
function book(code: LabCode): string { return 'booked ' + code; }
// A raw string is not a LabCode.
export const r = book('CS-101');
