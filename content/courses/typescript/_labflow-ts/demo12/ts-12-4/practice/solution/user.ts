import { createContext, useContext } from './react.ts';
type User = { id: number; name: string };
const UserContext = createContext<User>({ id: 0, name: 'guest' });
export function greeting(): string {
  const user = useContext(UserContext);
  return 'Hi ' + user.name;
}
console.log(greeting());
