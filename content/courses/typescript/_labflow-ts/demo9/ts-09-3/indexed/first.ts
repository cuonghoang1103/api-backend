type Lab = { code: string };
const labs: Lab[] = [{ code: 'BE-201' }];

// noUncheckedIndexedAccess: labs[0] might be undefined, so reading .code is refused.
export function firstCode(): string {
  const first = labs[0];
  return first.code;
}
