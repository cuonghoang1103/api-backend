// An implicit any and an unguarded possibly-undefined value.
export function greet(user) {
  const name: string | undefined = user.name;
  return 'Hi ' + name.toUpperCase();
}
