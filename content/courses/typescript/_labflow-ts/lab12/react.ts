// A tiny typed model of React's surface (the shapes @types/react provides).
export type ReactNode = El | string | number | boolean | null;
export type El = { tag: string; props: Record<string, unknown>; children: ReactNode[] };
export type FC<P> = (props: P) => El;
export function h(tag: string, props: Record<string, unknown> = {}, ...children: ReactNode[]): El {
  return { tag, props, children };
}
export type ChangeEvent = { target: { value: string } };
