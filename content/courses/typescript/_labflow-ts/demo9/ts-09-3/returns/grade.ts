// noImplicitReturns: one path falls off the end without returning.
export function grade(score: number): string | undefined {
  if (score >= 5) {
    return 'PASS';
  }
  if (score < 0) {
    return 'INVALID';
  }
}
