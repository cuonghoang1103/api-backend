/**
 * Shim `next/navigation` — kiểm phần LOGIC không cần React.
 *
 * Ba hook đều dựa vào `useAppState`, nên kiểm chúng đầy đủ cần dựng cả cây
 * provider. Thứ đáng kiểm nhất ở đây lại là hai thứ thuần: kho chuỗi truy vấn
 * (đã từng là nguồn của vòng vẽ vô tận) và cách lùi về đường dẫn cha.
 */
import { describe, expect, it } from 'vitest';
import { chupTruyVan, datTruyVanCho, theoDoiTruyVan } from './next-navigation';

/** Bản sao phép tính "lùi về cha" trong `useRouter().back()`. */
function duongCha(route: string): string {
  return route.replace(/\/[^/]+$/, '') || '/dashboard';
}

describe('lùi khi ngăn xếp rỗng', () => {
  it('về đúng đường dẫn cha', () => {
    expect(duongCha('/language/ja/vocab')).toBe('/language/ja');
    expect(duongCha('/language/ja')).toBe('/language');
    expect(duongCha('/roadmap/frontend')).toBe('/roadmap');
  });

  it('ở gốc thì về bảng điều khiển, KHÔNG trả chuỗi rỗng', () => {
    // Chuỗi rỗng làm `navigate('')` — route không khớp gì, và app hiện màn
    // hình "Không tìm thấy" ngay khi người dùng bấm nút Quay lại.
    expect(duongCha('/language')).toBe('/dashboard');
  });
});

describe('kho chuỗi truy vấn', () => {
  it('đặt rồi đọc lại đúng giá trị, theo từng đường dẫn', () => {
    datTruyVanCho('/language/ja/vocab', 'level=N5');
    datTruyVanCho('/language/zh/vocab', 'level=HSK1');
    expect(chupTruyVan('/language/ja/vocab')).toBe('level=N5');
    expect(chupTruyVan('/language/zh/vocab')).toBe('level=HSK1');
    expect(chupTruyVan('/khong-co')).toBe('');
  });

  /**
   * Chốt QUAN TRỌNG NHẤT của tệp này.
   *
   * `useSearchParams` đọc qua `useSyncExternalStore`, vốn so ảnh chụp bằng
   * `Object.is`. Nếu đặt lại CÙNG giá trị mà vẫn bắn thông báo, React gọi lại
   * getSnapshot → vẽ lại → gọi lại… vòng vẽ vô tận, và app đơ mà không có lỗi
   * nào để thấy. Đếm số lần báo là cách duy nhất bắt được nó ở tầng này.
   */
  it('đặt lại CÙNG giá trị thì KHÔNG báo cho người nghe', () => {
    datTruyVanCho('/x', 'a=1');
    let dem = 0;
    const thoi = theoDoiTruyVan(() => { dem += 1; });

    datTruyVanCho('/x', 'a=1');          // y hệt — phải im
    expect(dem).toBe(0);

    datTruyVanCho('/x', 'a=2');          // khác — phải báo
    expect(dem).toBe(1);

    datTruyVanCho('/x', '');             // xoá — cũng là một thay đổi
    expect(dem).toBe(2);
    expect(chupTruyVan('/x')).toBe('');

    datTruyVanCho('/x', '');             // xoá lần nữa — phải im
    expect(dem).toBe(2);

    thoi();
    datTruyVanCho('/x', 'a=9');
    expect(dem, 'huỷ theo dõi rồi mà vẫn nhận báo').toBe(2);
  });

  it('ảnh chụp là CÙNG một chuỗi khi không đổi', () => {
    datTruyVanCho('/y', 'q=1');
    expect(Object.is(chupTruyVan('/y'), chupTruyVan('/y'))).toBe(true);
  });
});
