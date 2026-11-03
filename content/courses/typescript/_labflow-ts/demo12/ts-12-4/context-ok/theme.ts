import { createContext, useContext } from './react.ts';
type Theme = { color: string };
const ThemeContext = createContext<Theme | null>(null);
// A guard hook: throw if there is no provider, return a non-null Theme.
export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (theme === null) throw new Error('useTheme used outside <ThemeProvider>');
  return theme;
}
console.log('guard ready');
