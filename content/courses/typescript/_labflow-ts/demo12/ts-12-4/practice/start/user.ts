import { createContext, useContext } from './react.ts';
type User = { id: number; name: string };
const UserContext = createContext<User>({ id: 0, name: 'guest' });
export function greeting(): string {
  const user = useContext(UserContext);
  // user has name, not fullName.
  return 'Hi ' + user.fullName;
}
