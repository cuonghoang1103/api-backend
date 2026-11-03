type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode { return s as LabCode; }
function book(code: LabCode): string { return 'booked ' + code; }
console.log(book(labCode('CS-101')));
