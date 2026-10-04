import { describe, expect, it } from 'vitest';
import { boCucNoiDungApp, CAO_CAN } from './boCucTrongApp';
import { coHopPx } from './ThanRobot';

const VUNG = { rong: 1440, cao: 870 };

describe('bố cục khung quanh con robot trong app', () => {
  it('robot ở góc dưới-phải ⇒ khung mở lên trên, canh mép phải robot', () => {
    const c = coHopPx(100);
    const b = boCucNoiDungApp({ phai: 22, duoi: 16, rong: c.rong, cao: c.cao }, VUNG, CAO_CAN.chat);
    expect(b.phia).toBe('tren');
    expect(b.ngang).toBe('phai');
    expect(b.kieu.bottom).toBe(16 + 160 + 8);
    expect(b.kieu.right).toBe(14);
  });

  it('⭐ đổi cỡ robot KHÔNG đổi vùng của khung theo tỉ lệ — chỉ dời chỗ bắt đầu', () => {
    const nho = coHopPx(20);
    const to = coHopPx(100);
    const a = boCucNoiDungApp({ phai: 22, duoi: 16, rong: nho.rong, cao: nho.cao }, VUNG, CAO_CAN.chat);
    const b = boCucNoiDungApp({ phai: 22, duoi: 16, rong: to.rong, cao: to.cao }, VUNG, CAO_CAN.chat);
    // Mép phải khung bám mép phải robot ở cả hai cỡ; phần trên vẫn trải tới lề.
    expect(a.kieu.right).toBe(b.kieu.right);
    expect(a.kieu.top).toBe(b.kieu.top);
    expect(b.kieu.bottom - a.kieu.bottom).toBe(to.cao - nho.cao);
  });

  it('robot sát mép trên ⇒ khung mở xuống dưới; robot nửa trái ⇒ canh trái', () => {
    const c = coHopPx(60);
    const b = boCucNoiDungApp({ phai: 1300, duoi: 700, rong: c.rong, cao: c.cao }, VUNG, CAO_CAN.chat);
    expect(b.phia).toBe('duoi');
    expect(b.ngang).toBe('trai');
    expect(b.kieu.top).toBe(VUNG.cao - 700 + 8);
  });
});
