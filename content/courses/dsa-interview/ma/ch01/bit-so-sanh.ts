// Why src/services/otp.service.ts compares OTP codes with XOR instead of ===: count the work each guess costs.

// #region so-sanh
function naiveEqual(a: string, b: string): { eq: boolean; steps: number } {
  let steps = 0;
  if (a.length !== b.length) return { eq: false, steps };
  for (let i = 0; i < a.length; i++) {
    steps++;
    if (a[i] !== b[i]) return { eq: false, steps };   // stops at the FIRST wrong character
  }
  return { eq: true, steps };
}

function constantTimeEqual(a: string, b: string): { eq: boolean; steps: number } {
  let steps = 0;
  if (a.length !== b.length) return { eq: false, steps };
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    steps++;
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);      // 0 only if every pair of characters is equal
  }
  return { eq: result === 0, steps };                 // always a.length steps
}
// #endregion

const secret = '493817';
for (const g of ['000000', '400000', '490000', '493000', '493817']) {
  const a = naiveEqual(secret, g), b = constantTimeEqual(secret, g);
  console.log(`guess ${g}: naive ${a.steps} steps (${a.eq}), constant-time ${b.steps} steps (${b.eq})`);
}
