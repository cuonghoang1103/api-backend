'use client';

/**
 * useDebouncedValue — returns `value` after it has
 * stayed stable for `delay` ms. Used to throttle a
 * search input so the network call only fires once
 * the user pauses typing.
 *
 * Keep the delay small (200-300 ms). This is not a
 * save debounce — it just avoids one fetch per
 * keystroke.
 */
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay: number = 250): T {
 const [debounced, setDebounced] = useState(value);

 useEffect(() => {
 const t = setTimeout(() => setDebounced(value), delay);
 return () => clearTimeout(t);
 }, [value, delay]);

 return debounced;
}
