// A tiny typed model of React's surface (the shapes @types/react provides).
export type ReactNode = El | string | number | boolean | null;
export type El = { tag: string; props: Record<string, unknown>; children: ReactNode[] };
export type FC<P> = (props: P) => El;
export function h(tag: string, props: Record<string, unknown> = {}, ...children: ReactNode[]): El {
  return { tag, props, children };
}
export function useState<S>(initial: S): [S, (next: S) => void] {
  const cell = { value: initial };
  return [cell.value, (next: S) => { cell.value = next; }];
}
export type Ref<T> = { current: T | null };
export function useRef<T>(initial: T | null): Ref<T> { return { current: initial }; }
export type ChangeEvent = { target: { value: string } };
export type Context<T> = { readonly defaultValue: T };
export function createContext<T>(defaultValue: T): Context<T> { return { defaultValue }; }
export function useContext<T>(ctx: Context<T>): T { return ctx.defaultValue; }
