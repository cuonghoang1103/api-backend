import type { FC } from './react.ts';
import { h } from './react.ts';
type Props = { label: string };
export const Button: FC<Props> = (props) => {
  // props has label, not text.
  return h('button', { title: props.text });
};
