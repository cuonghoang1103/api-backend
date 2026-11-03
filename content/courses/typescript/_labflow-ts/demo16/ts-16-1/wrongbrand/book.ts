type LabCode = string & { readonly __brand: 'LabCode' };
function book(code: LabCode): string { return 'booked ' + code; }
// A plain string is not a LabCode — it never went through the validator.
export const r = book('BE-201');
