import { useState } from './react.ts';
const [count, setCount] = useState(0);
// The setter takes a number — a string is refused.
setCount('three');
export { count };
