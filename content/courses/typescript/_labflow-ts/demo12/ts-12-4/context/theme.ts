import { createContext, useContext } from './react.ts';
type Theme = { color: string };
// The context can be null (no provider above) — so useContext returns Theme | null.
const ThemeContext = createContext<Theme | null>(null);
export function useThemeColor(): string {
  const theme = useContext(ThemeContext);
  // Reading .color without checking — the context might be null.
  return theme.color;
}
