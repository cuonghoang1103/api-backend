import type { FC } from './react.ts';
import { h } from './react.ts';
type LabProps = { code: string; seats: number };
const LabCard: FC<LabProps> = (props) => h('div', { 'data-code': props.code });
// Calling the component without 'seats' — a required prop is missing.
export const el = LabCard({ code: 'BE-201' });
