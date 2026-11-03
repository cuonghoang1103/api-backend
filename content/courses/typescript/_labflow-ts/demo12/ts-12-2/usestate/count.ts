import { useState } from './react.ts';
// useState<number> infers the state and types the setter.
const [count, setCount] = useState(0);
setCount(count + 1);
console.log('next count:', count + 1);
