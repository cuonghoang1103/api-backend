import { describe, expect, it, vi } from 'vitest';

vi.mock('electron', () => ({ app: {}, BrowserWindow: class {}, dialog: {}, powerMonitor: { on: () => {} } }));
vi.mock('./store', () => ({ getSettings: () => ({}) }));

const { nenHoiThoat } = await import('./hoiThoat');

describe('robot hỏi trước khi thoát — khi nào hỏi', () => {
  it('bản đóng gói, thiết đặt mặc định ⇒ hỏi', () => {
    expect(nenHoiThoat({ daDongGoi: true, env: {}, thietDat: {} })).toBe(true);
  });
  it('tắt trong Cài đặt ⇒ không hỏi', () => {
    expect(nenHoiThoat({ daDongGoi: true, env: {}, thietDat: { robotHoiThoat: false } })).toBe(false);
  });
  it('CT_KHONG_HOI_THOAT=1 ⇒ không hỏi, kể cả bản đóng gói', () => {
    expect(nenHoiThoat({ daDongGoi: true, env: { CT_KHONG_HOI_THOAT: '1' }, thietDat: {} })).toBe(false);
  });
  it('chạy từ mã nguồn (kiểm thử/smoke) ⇒ không hỏi, trừ khi CT_HOI_THOAT=1', () => {
    expect(nenHoiThoat({ daDongGoi: false, env: {}, thietDat: {} })).toBe(false);
    expect(nenHoiThoat({ daDongGoi: false, env: { CT_HOI_THOAT: '1' }, thietDat: {} })).toBe(true);
  });
});
