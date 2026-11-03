import type { FC } from './react.ts';
import { h } from './react.ts';

type LabProps = { code: string; seats: number };
// A component is a function of typed props returning an element.
export const LabCard: FC<LabProps> = (props) => {
  return h('div', { 'data-code': props.code }, 'Seats: ' + props.seats);
};

console.log(LabCard({ code: 'BE-201', seats: 40 }));
