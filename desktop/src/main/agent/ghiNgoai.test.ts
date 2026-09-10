/**
 * Kiểm ranh giới của `ghi_file_ngoai`.
 *
 * Tool này cố ý ĐI RA NGOÀI ngục — nên nó là chỗ duy nhất trong app mà một lỗi
 * kiểm đường dẫn không dừng lại ở "sửa nhầm file dự án". Mọi phép kiểm dưới
 * đây canh đúng một câu hỏi: ghi được ở đâu, và tuyệt đối không ở đâu.
 */
import { describe, expect, it } from 'vitest';
import os from 'node:os';
import path from 'node:path';

import { kiemDuongDanNgoai, LoiGhiNgoai } from './ghiNgoai';

const NHA = os.homedir();

describe('bắt buộc tuyệt đối', () => {
  it('⛔ đường dẫn TƯƠNG ĐỐI bị từ chối', () => {
    // Tương đối ở đây là mơ hồ: tương đối so với cái gì? Và người duyệt không
    // đọc ra được nó sẽ rơi vào đâu.
    expect(() => kiemDuongDanNgoai('cau-hinh.txt')).toThrow(LoiGhiNgoai);
    expect(() => kiemDuongDanNgoai('../ra-ngoai.txt')).toThrow(/TUYỆT ĐỐI/);
  });

  it('rỗng cũng bị từ chối', () => {
    expect(() => kiemDuongDanNgoai('')).toThrow(/Thiếu/);
    expect(() => kiemDuongDanNgoai('   ')).toThrow(/Thiếu/);
  });
});

describe('file bí mật vẫn cấm — ra khỏi dự án thì lý do MẠNH LÊN', () => {
  for (const ten of ['.env', '.env.local', 'id_rsa', 'credentials.json']) {
    it(`⛔ ${ten}`, () => {
      expect(() => kiemDuongDanNgoai(path.join(NHA, 'thu-muc', ten))).toThrow(LoiGhiNgoai);
    });
  }
});

describe('chỗ chạy tự động và thư mục hệ điều hành', () => {
  const cam = [
    path.join(NHA, '.ssh', 'config'),
    path.join(NHA, '.gnupg', 'gpg.conf'),
    path.join(NHA, 'Library', 'LaunchAgents', 'x.plist'),
    path.join(NHA, '.config', 'systemd', 'user', 'x.service'),
    '/etc/hosts',
    '/usr/local/bin/x',
    'C:\\Windows\\System32\\drivers\\etc\\hosts',
    'C:\\Program Files\\x\\y.cfg',
  ];
  for (const d of cam) {
    it(`⛔ ${d}`, () => { expect(() => kiemDuongDanNgoai(d)).toThrow(LoiGhiNgoai); });
  }

  it('⛔⛔ `..` KHÔNG lách được danh sách cấm', () => {
    // Kiểm trên chuỗi CHƯA gộp `..` là tự lừa mình: chuỗi dưới đây không khớp
    // mẫu `.ssh` nào cho tới khi `path.normalize` gộp xong.
    const lach = path.join(NHA, 'Documents', '..', '.ssh', 'config');
    expect(() => kiemDuongDanNgoai(lach)).toThrow(/chạy tự động|hệ điều hành/);
  });
});

describe('chỗ ĐƯỢC ghi', () => {
  it('tệp cấu hình thường trong HOME thì cho', () => {
    const d = path.join(NHA, 'Documents', 'settings.txt');
    expect(kiemDuongDanNgoai(d).duongDan).toBe(d);
  });

  it('rút gọn HOME thành `~` cho thẻ duyệt dễ đọc', () => {
    // Thẻ duyệt của tool này khác `create_file` ở đúng một điểm: thứ quan
    // trọng nhất là file NẰM Ở ĐÂU. Một đường dẫn dài loằng ngoằng thì người
    // dùng bấm cho xong.
    const r = kiemDuongDanNgoai(path.join(NHA, 'Downloads', 'a.txt'));
    expect(r.hienThi.startsWith(`~${path.sep}`)).toBe(true);
    expect(r.hienThi).toContain('a.txt');
  });

  it('ngoài HOME thì hiện nguyên đường dẫn, không rút gọn nhầm', () => {
    const d = path.join(os.tmpdir(), 'ct-thu', 'a.txt');
    expect(kiemDuongDanNgoai(d).hienThi).toBe(path.normalize(d));
  });
});
