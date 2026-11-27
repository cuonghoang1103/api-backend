/**
 * Chế độ đóng vai CT Work của phiên CuongMini (27/11/2026) — phần thuần.
 *   (cd desktop && npx vitest run src/main/agent/vaiCtwork.test.ts)
 */
import { describe, expect, it } from 'vitest';
import { datVaiCuoc, docVai, ghiChuVai, laTenTuVai, metaVai, tenPhienTheoVai, vaiCuaCuoc } from './vaiCtwork';

describe('vaiCtwork', () => {
  it('docVai: C3 / 3 / be / qa / off; lạ ⇒ undefined', () => {
    expect(docVai('C3')).toBe('C3');
    expect(docVai('3')).toBe('C3');
    expect(docVai('be')).toBe('C3');
    expect(docVai('QA')).toBe('C5');
    expect(docVai('leader')).toBe('C1');
    expect(docVai('off')).toBeNull();
    expect(docVai('')).toBeNull();
    expect(docVai('C9')).toBeUndefined();
    expect(docVai('dev')).toBeUndefined();
  });

  it('tên phiên theo vai: "<tên> · C3 BE"; nhận ra tên tự sinh để đổi theo vai mới', () => {
    expect(tenPhienTheoVai('Cường', 'C1')).toBe('Cường · C1 Leader');
    expect(tenPhienTheoVai('', 'C5')).toBe('CuongMini · C5 QA');
    expect(laTenTuVai('Cường · C1 Leader')).toBe(true);
    expect(laTenTuVai('backend api')).toBe(false);
    expect(laTenTuVai('')).toBe(false);
  });

  it('vai theo cuộc + vai cuối của tiến trình; _meta chỉ khi có vai', () => {
    datVaiCuoc('a', 'C3');
    datVaiCuoc('b', 'C5');
    expect(vaiCuaCuoc('a')).toBe('C3');
    expect(vaiCuaCuoc('b')).toBe('C5');
    expect(vaiCuaCuoc()).toBe('C5'); // không có cuộc ⇒ vai đặt cuối của tiến trình
    datVaiCuoc('b', null);
    expect(vaiCuaCuoc('b')).toBeNull();
    expect(metaVai('C2')).toEqual({ 'ctwork/vai': 'C2' });
    expect(metaVai(null)).toBeUndefined();
  });

  it('gợi ý theo vai: nói rõ một sinh viên đóng cả năm vai, C5 tập trung test', () => {
    const t = ghiChuVai('C5');
    expect(t).toMatch(/C5 QA/);
    expect(t).toMatch(/One student plays all five roles/);
    expect(t).toMatch(/test/i);
    expect(t).toMatch(/\/vai/);
  });
});
