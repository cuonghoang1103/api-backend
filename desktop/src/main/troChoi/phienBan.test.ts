import { describe, expect, it } from 'vitest';
import { docPhienBan, kiemHoTro, macosTuDarwin, namTrong, phanGiaiUrl } from './phienBan';

const GOC = 'https://github.com/cuonghoang1103/cuongthai-desktop/releases/download/flying-pencil-latest/phien_ban.json';
const HOP_LE = {
  version: '0.1.0-man1',
  url: 'https://github.com/cuonghoang1103/cuongthai-desktop/releases/download/flying-pencil-0.1.0/FlyingPencil-0.1.0-man1-mac-arm64.zip',
  sha256: 'a'.repeat(64),
  size: 150_000_000,
  ngay: '2026-10-08',
  ghi_chu: { vi: 'Bản thử', en: 'Preview' },
  yeu_cau: 'macOS 13+, Apple Silicon',
  ten_app: 'FlyingPencil.app',
  media: [
    { loai: 'anh', url: 'anh/1.webp', nho: 'anh/1_nho.webp', nguon: 'game' },
    { loai: 'video', url: 'javascript:alert(1)', nguon: 'phim' },
  ],
};

describe('docPhienBan', () => {
  it('nhận tệp hợp lệ, phân giải media tương đối theo URL phien_ban.json, bỏ mục hỏng', () => {
    const b = docPhienBan(HOP_LE, GOC);
    expect(b.version).toBe('0.1.0-man1');
    expect(b.kienTruc).toEqual(['arm64']);
    expect(b.media).toHaveLength(1);
    expect(b.media[0]!.url).toBe('https://github.com/cuonghoang1103/cuongthai-desktop/releases/download/flying-pencil-latest/anh/1.webp');
  });

  it('chặn version bẻ đường dẫn', () => {
    expect(() => docPhienBan({ ...HOP_LE, version: '../../..' }, GOC)).toThrow(/sai dạng/);
    expect(() => docPhienBan({ ...HOP_LE, version: 'a/b' }, GOC)).toThrow(/sai dạng/);
  });

  it('chặn ten_app có dấu /', () => {
    expect(() => docPhienBan({ ...HOP_LE, ten_app: '../x.app' }, GOC)).toThrow(/sai dạng/);
  });

  it('từ chối zip http ngoài máy mình, nhận http cục bộ để thử', () => {
    expect(() => docPhienBan({ ...HOP_LE, url: 'http://evil.example/x.zip' }, GOC)).toThrow(/https/);
    const b = docPhienBan({ ...HOP_LE, url: undefined, tep: 'x.zip' }, 'http://127.0.0.1:8765/phien_ban.json');
    expect(b.url).toBe('http://127.0.0.1:8765/x.zip');
  });

  it('sha256 sai dạng bị từ chối', () => {
    expect(() => docPhienBan({ ...HOP_LE, sha256: 'xyz' }, GOC)).toThrow();
  });
});

describe('namTrong', () => {
  it('chỉ đúng khi con nằm hẳn trong cha', () => {
    expect(namTrong('/a/games/fp', '/a/games/fp/0.1.0/X.app')).toBe(true);
    expect(namTrong('/a/games/fp', '/a/games/fp')).toBe(false);
    expect(namTrong('/a/games/fp', '/a/games/fp/../other')).toBe(false);
    expect(namTrong('/a/games/fp', '/a/games/fpx/1')).toBe(false);
  });
});

describe('phanGiaiUrl', () => {
  it('file:/data: bị chặn', () => {
    expect(phanGiaiUrl('file:///etc/passwd', GOC)).toBeNull();
    expect(phanGiaiUrl('data:text/plain,x', GOC)).toBeNull();
  });
});

describe('kiemHoTro', () => {
  it('macOS theo Darwin', () => {
    expect(macosTuDarwin('22.1.0')).toBe(13);
    expect(macosTuDarwin('24.0.0')).toBe(15);
    expect(macosTuDarwin('25.0.0')).toBe(26);
    expect(macosTuDarwin('27.0.0')).toBe(28);
  });
  it('từ chối Windows, Intel, macOS cũ; nhận Apple Silicon mới', () => {
    expect(kiemHoTro(null, { nenTang: 'win32', kienTruc: 'x64', darwin: '' }).ok).toBe(false);
    expect(kiemHoTro(null, { nenTang: 'darwin', kienTruc: 'x64', darwin: '23.0.0' }).ok).toBe(false);
    expect(kiemHoTro(null, { nenTang: 'darwin', kienTruc: 'arm64', darwin: '21.0.0' }).ok).toBe(false);
    expect(kiemHoTro(null, { nenTang: 'darwin', kienTruc: 'arm64', darwin: '27.0.0' }).ok).toBe(true);
  });
});
