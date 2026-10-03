import { describe, expect, it } from 'vitest';

import { duongCuaLuot } from './epCucBo';

const co = { choPhepChay: true, tuDungKhiMatMang: true, coModel: true };

describe('/offline — đường của một lượt', () => {
  it('KHÔNG ép + có mạng ⇒ luôn máy chủ (ranh giới 1 của gói ngoại tuyến)', () => {
    expect(duongCuaLuot({ ...co, ep: false, matMang: false })).toBe('mayChu');
  });
  it('ép tay + có mạng ⇒ chạy trên máy, kể cả khi tắt "Tự dùng khi mất mạng"', () => {
    expect(duongCuaLuot({ ...co, ep: true, matMang: false, tuDungKhiMatMang: false })).toBe('cucBo');
  });
  it('ép tay nhưng công tắc "Cho phép" tắt ⇒ daTat (tôn trọng Cài đặt)', () => {
    expect(duongCuaLuot({ ...co, ep: true, matMang: false, choPhepChay: false })).toBe('daTat');
  });
  it('ép tay mà máy chưa có model ⇒ chuaCai', () => {
    expect(duongCuaLuot({ ...co, ep: true, matMang: false, coModel: false })).toBe('chuaCai');
  });
  it('không ép + mất mạng ⇒ hành vi cũ của gói ngoại tuyến', () => {
    expect(duongCuaLuot({ ...co, ep: false, matMang: true, tuDungKhiMatMang: false })).toBe('daTat');
    expect(duongCuaLuot({ ...co, ep: false, matMang: true })).toBe('cucBo');
  });
});
