/**
 * _ma (bài 12.1) — SINH TỰ ĐỘNG bằng scripts/ts/sinh-ma.mjs từ dự án LabFlow TS chạy thật (Node 22.23.3, tsc 7.0.2). Đừng sửa tay.
 */
export const CODE = {
  "reactModel": `// A tiny typed model of React's surface (the shapes @types/react provides).
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
export function useContext<T>(ctx: Context<T>): T { return ctx.defaultValue; }`,
  "component": `import type { FC } from './react.ts';
import { h } from './react.ts';

type LabProps = { code: string; seats: number };
// A component is a function of typed props returning an element.
export const LabCard: FC<LabProps> = (props) => {
  return h('div', { 'data-code': props.code }, 'Seats: ' + props.seats);
};

console.log(LabCard({ code: 'BE-201', seats: 40 }));`,
  "wrongprop": `import type { FC } from './react.ts';
import { h } from './react.ts';
type LabProps = { code: string; seats: number };
export const LabCard: FC<LabProps> = (props) => {
  // 'name' is not a declared prop — the typed component refuses it.
  return h('div', { title: props.name });
};`,
  "missingprop": `import type { FC } from './react.ts';
import { h } from './react.ts';
type LabProps = { code: string; seats: number };
const LabCard: FC<LabProps> = (props) => h('div', { 'data-code': props.code });
// Calling the component without 'seats' — a required prop is missing.
export const el = LabCard({ code: 'BE-201' });`,
  "prStart": `import type { FC } from './react.ts';
import { h } from './react.ts';
type Props = { label: string };
export const Button: FC<Props> = (props) => {
  // props has label, not text.
  return h('button', { title: props.text });
};`,
  "prSol": `import type { FC } from './react.ts';
import { h } from './react.ts';
type Props = { label: string };
export const Button: FC<Props> = (props) => {
  return h('button', { title: props.label });
};
console.log(Button({ label: 'Book' }).props);`,
};
export const OUT = {
  '11-component': `$ node demo12/ts-12-1/component/lab.ts
{
  tag: 'div',
  props: { 'data-code': 'BE-201' },
  children: [ 'Seats: 40' ]
}`,
  '12-wrongprop': `$ node_modules/.bin/tsc -p demo12/ts-12-1/wrongprop
demo12/ts-12-1/wrongprop/lab.ts(6,34): error TS2339: Property 'name' does not exist on type 'LabProps'.`,
  '13-missingprop': `$ node_modules/.bin/tsc -p demo12/ts-12-1/missingprop
demo12/ts-12-1/missingprop/lab.ts(6,27): error TS2741: Property 'seats' is missing in type '{ code: string; }' but required in type 'LabProps'.`,
  '14-pr-start': `$ node_modules/.bin/tsc -p demo12/ts-12-1/practice/start
demo12/ts-12-1/practice/start/lab.ts(6,37): error TS2339: Property 'text' does not exist on type 'Props'.`,
  '15-pr-sol': `$ node demo12/ts-12-1/practice/solution/lab.ts
{ title: 'Book' }`,
};
