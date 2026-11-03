/**
 * _ma (bài 12.4) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "contextDemo": `import { createContext, useContext } from './react.ts';
type Theme = { color: string };
// The context can be null (no provider above) — so useContext returns Theme | null.
const ThemeContext = createContext<Theme | null>(null);
export function useThemeColor(): string {
  const theme = useContext(ThemeContext);
  // Reading .color without checking — the context might be null.
  return theme.color;
}`,
  "contextOk": `import { createContext, useContext } from './react.ts';
type Theme = { color: string };
const ThemeContext = createContext<Theme | null>(null);
// A guard hook: throw if there is no provider, return a non-null Theme.
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) throw new Error('useTheme used outside <ThemeProvider>');
  return theme;
}
console.log('guard ready');`,
  "generic": `import type { ReactNode } from './react.ts';
// A generic component: List<T> renders any array, render() is typed to match.
type ListProps<T> = { items: T[]; render: (item: T) => ReactNode };
function List<T>(props: ListProps<T>): ReactNode[] {
  return props.items.map(props.render);
}
// T is inferred as number from items — so n is a number inside render.
export const out = List({ items: [1, 2, 3], render: (n) => 'n=' + n.toFixed(0) });
console.log(out);`,
  "prStart": `import { createContext, useContext } from './react.ts';
type User = { id: number; name: string };
const UserContext = createContext<User>({ id: 0, name: 'guest' });
export function greeting(): string {
  const user = useContext(UserContext);
  // user has name, not fullName.
  return 'Hi ' + user.fullName;
}`,
  "prSol": `import { createContext, useContext } from './react.ts';
type User = { id: number; name: string };
const UserContext = createContext<User>({ id: 0, name: 'guest' });
export function greeting(): string {
  const user = useContext(UserContext);
  return 'Hi ' + user.name;
}
console.log(greeting());`,
};
export const OUT = {
  '11-context': `$ node_modules/.bin/tsc -p demo12/ts-12-4/context
demo12/ts-12-4/context/theme.ts(8,10): error TS18047: 'theme' is possibly 'null'.`,
  '12-context-ok': `$ node demo12/ts-12-4/context-ok/theme.ts
guard ready`,
  '13-generic': `$ node demo12/ts-12-4/generic/list.ts
[ 'n=1', 'n=2', 'n=3' ]`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo12/ts-12-4/practice/start
demo12/ts-12-4/practice/start/user.ts(7,23): error TS2339: Property 'fullName' does not exist on type 'User'.`,
  '15-pr-sol': `$ node demo12/ts-12-4/practice/solution/user.ts
Hi guest`,
};
