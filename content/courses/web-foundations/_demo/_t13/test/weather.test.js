import { it, expect, vi } from 'vitest';
import { getTemperature } from '../src/weather.js';

// A fake Response with only what our code uses
const reply = (status, body) => ({ ok: status >= 200 && status < 300, status, json: async () => body });

it('returns the temperature from the API', async () => {
  const fakeFetch = vi.fn().mockResolvedValue(reply(200, { tempC: 31 }));
  await expect(getTemperature('Hà Nội', fakeFetch)).resolves.toBe(31);
  expect(fakeFetch).toHaveBeenCalledTimes(1);
  expect(fakeFetch).toHaveBeenCalledWith('/api/weather?city=H%C3%A0%20N%E1%BB%99i');
});

it('throws a clear error when the service answers 500', async () => {
  const fakeFetch = vi.fn().mockResolvedValue(reply(500, {}));
  await expect(getTemperature('Huế', fakeFetch)).rejects.toThrow('weather service failed: 500');
});

it('lets a network failure through as a TypeError', async () => {
  const fakeFetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
  await expect(getTemperature('Huế', fakeFetch)).rejects.toThrow(TypeError);
});
