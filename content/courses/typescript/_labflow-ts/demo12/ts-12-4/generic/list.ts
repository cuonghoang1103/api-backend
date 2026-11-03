import type { ReactNode } from './react.ts';
// A generic component: List<T> renders any array, render() is typed to match.
type ListProps<T> = { items: T[]; render: (item: T) => ReactNode };
function List<T>(props: ListProps<T>): ReactNode[] {
  return props.items.map(props.render);
}
// T is inferred as number from items — so n is a number inside render.
export const out = List({ items: [1, 2, 3], render: (n) => 'n=' + n.toFixed(0) });
console.log(out);
