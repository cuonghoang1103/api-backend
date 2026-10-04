import { describe, expect, it } from 'vitest';
import { phimDoiCo } from './useRobotChung';

describe('↑/↓ trong chế độ chỉnh', () => {
  it('↑ +5%, ↓ −5%', () => {
    expect(phimDoiCo('ArrowUp', 50)).toBe(55);
    expect(phimDoiCo('ArrowDown', 50)).toBe(45);
  });
  it('kẹp 20–100%', () => {
    expect(phimDoiCo('ArrowUp', 100)).toBe(100);
    expect(phimDoiCo('ArrowDown', 20)).toBe(20);
  });
  it('phím khác không đụng tới cỡ', () => {
    expect(phimDoiCo('ArrowLeft', 50)).toBeNull();
    expect(phimDoiCo('a', 50)).toBeNull();
  });
});
