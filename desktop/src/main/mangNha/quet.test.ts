import { describe, it, expect } from 'vitest';
import { phanTichArp } from './quet';
import { tenHang, macNgauNhien } from './oui';

describe('phanTichArp — đọc bảng ARP mọi hệ điều hành', () => {
  it('macOS: octet rút gọn số 0 đầu → chuẩn hoá về 2 hex', () => {
    const raw = '? (192.168.1.1) at ab:cd:ef:1:2:3 on en0 ifscope [ethernet]';
    expect(phanTichArp(raw).get('192.168.1.1')).toBe('ab:cd:ef:01:02:03');
  });

  it('Linux: có hostname đứng trước, MAC đủ 2 hex', () => {
    const raw = 'router.lan (192.168.1.254) at 5c:a8:6a:11:22:33 [ether] on eth0';
    expect(phanTichArp(raw).get('192.168.1.254')).toBe('5c:a8:6a:11:22:33');
  });

  it('Windows: MAC ngăn bằng gạch nối → chuẩn hoá về dấu hai chấm', () => {
    const raw = '  192.168.1.5    ab-cd-ef-12-34-56    dynamic';
    expect(phanTichArp(raw).get('192.168.1.5')).toBe('ab:cd:ef:12:34:56');
  });

  it('bỏ dòng incomplete và địa chỉ quảng bá', () => {
    const raw = [
      '? (192.168.1.9) at (incomplete) on en0',
      '? (192.168.1.255) at ff:ff:ff:ff:ff:ff on en0 [ethernet]',
      '? (192.168.1.7) at 00:11:22:33:44:55 on en0 [ethernet]',
    ].join('\n');
    const map = phanTichArp(raw);
    expect(map.has('192.168.1.9')).toBe(false);
    expect(map.has('192.168.1.255')).toBe(false);
    expect(map.get('192.168.1.7')).toBe('00:11:22:33:44:55');
  });

  it('dòng rác không sinh mục', () => {
    expect(phanTichArp('Interface: 192.168.1.2 --- 0x5\nInternet Address...').size).toBe(0);
  });
});

describe('tra hãng theo OUI (offline)', () => {
  it('OUI đã biết → tên hãng', () => {
    expect(tenHang('3c:07:54:aa:bb:cc')).toBe('Apple');
    expect(tenHang('50:01:BB:11:22:33')).toBe('Samsung');
  });

  it('OUI chưa biết → trả chính chuỗi OUI, không đoán bừa', () => {
    expect(tenHang('12:34:56:78:9a:bc')).toBe('12:34:56');
  });

  it('MAC hỏng → null', () => {
    expect(tenHang('xyz')).toBeNull();
  });

  it('nhận diện MAC ngẫu nhiên hoá (bit locally-administered)', () => {
    // 0x02 bật ở byte đầu = MAC riêng tư của điện thoại đời mới.
    expect(macNgauNhien('06:11:22:33:44:55')).toBe(true);
    expect(macNgauNhien('3c:07:54:aa:bb:cc')).toBe(false);
  });
});
