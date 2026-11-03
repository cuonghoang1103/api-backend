import { it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createDebouncedSearch, greeting } from '../src/search.js';

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

it('debounce: only the last text is searched, 300 ms after typing stops', () => {
  const onSearch = vi.fn();
  const search = createDebouncedSearch(onSearch, 300);
  search('j'); search('ja'); search('jav'); search('java');

  vi.advanceTimersByTime(299);
  expect(onSearch).not.toHaveBeenCalled();

  vi.advanceTimersByTime(1);
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenCalledWith('java');
});

it('greeting at 08:00, 14:00 and 21:00 — no waiting for the real clock', () => {
  vi.setSystemTime(new Date(2026, 10, 1, 8, 0));
  expect(greeting()).toBe('Good morning');
  vi.setSystemTime(new Date(2026, 10, 1, 14, 0));
  expect(greeting()).toBe('Good afternoon');
  vi.setSystemTime(new Date(2026, 10, 1, 21, 0));
  expect(greeting()).toBe('Good evening');
});
