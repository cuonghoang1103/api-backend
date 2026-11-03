import type { FC } from './react.ts';
import { h } from './react.ts';
type LabProps = { code: string; seats: number };
export const LabCard: FC<LabProps> = (props) => {
  // 'name' is not a declared prop — the typed component refuses it.
  return h('div', { title: props.name });
};
