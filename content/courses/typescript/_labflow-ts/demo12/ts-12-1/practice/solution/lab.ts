import type { FC } from './react.ts';
import { h } from './react.ts';
type Props = { label: string };
export const Button: FC<Props> = (props) => {
  return h('button', { title: props.label });
};
console.log(Button({ label: 'Book' }).props);
