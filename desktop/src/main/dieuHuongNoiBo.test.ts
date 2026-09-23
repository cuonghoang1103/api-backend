import { describe, expect, it } from 'vitest';
import { duongNoiBoTuUrl } from './dieuHuongNoiBo';

const GOC = ['app://cuongthai', 'http://localhost:5273'];

describe('duongNoiBoTuUrl', () => {
  it('nhận đường CT Work trên origin của app, kèm truy vấn', () => {
    expect(duongNoiBoTuUrl('app://cuongthai/work/acme/WEB/issue/12', GOC))
      .toEqual({ path: '/work/acme/WEB/issue/12', query: '' });
    expect(duongNoiBoTuUrl('app://cuongthai/work?new=1', GOC))
      .toEqual({ path: '/work', query: '?new=1' });
    expect(duongNoiBoTuUrl('http://localhost:5273/work/acme', GOC))
      .toEqual({ path: '/work/acme', query: '' });
  });

  it('KHÔNG nhận đường ngoài danh sách — giữ nguyên luồng cũ', () => {
    expect(duongNoiBoTuUrl('app://cuongthai/', GOC)).toBeNull();
    expect(duongNoiBoTuUrl('app://cuongthai/index.html', GOC)).toBeNull();
    expect(duongNoiBoTuUrl('app://cuongthai/login?callbackUrl=%2Fwork', GOC)).toBeNull();
    expect(duongNoiBoTuUrl('app://cuongthai/workout', GOC)).toBeNull();
  });

  it('KHÔNG nhận origin lạ, kể cả khi đường giống hệt', () => {
    expect(duongNoiBoTuUrl('https://cuongthai.com/work/acme', GOC)).toBeNull();
    expect(duongNoiBoTuUrl('https://evil.example/work', GOC)).toBeNull();
    expect(duongNoiBoTuUrl('khong phai url', GOC)).toBeNull();
  });
});
