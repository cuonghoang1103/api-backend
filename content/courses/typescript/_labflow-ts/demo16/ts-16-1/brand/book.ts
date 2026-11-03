// A branded type: a string the compiler tracks as a LabCode, not any string.
type LabCode = string & { readonly __brand: 'LabCode' };
function labCode(s: string): LabCode {
  if (!/^[A-Z]{2}-\d{3}$/.test(s)) throw new Error('bad lab code: ' + s);
  return s as LabCode;
}
function book(code: LabCode): string { return 'booked ' + code; }
// You must go through the validator — a raw string is not a LabCode.
console.log(book(labCode('BE-201')));
