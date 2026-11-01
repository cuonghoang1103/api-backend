// Implicit any: tsc refuses to guess (strict ⇒ noImplicitAny).
export function minutesLabel(minutes) {
  return minutes + ' min';
}
