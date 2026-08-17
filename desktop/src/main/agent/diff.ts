/**
 * Diff theo DÒNG, để người dùng nhìn trước khi bấm duyệt.
 *
 * Tự viết thay vì thêm thư viện: nhu cầu ở đây là dựng bảng +/- cho một lần
 * sửa nhỏ, và mỗi phụ thuộc mới là một thứ phải vá khi có CVE — trong một tiến
 * trình có quyền ghi file trên máy người dùng thì cái giá đó rõ ràng hơn hẳn.
 *
 * Thuật toán: dãy con chung dài nhất (LCS) theo dòng, quy hoạch động. O(n·m)
 * bộ nhớ, nên có TRẦN: quá lớn thì trả về diff "cả khối" thay vì cố tính.
 * Một lần sửa của agent bình thường chỉ vài chục dòng; file khổng lồ rơi vào
 * đây nghĩa là có gì đó không bình thường, và lúc đó đứng hình trình duyệt là
 * cách phản hồi tệ nhất có thể.
 */

export type LoaiDong = 'giu' | 'them' | 'bo';

export interface DongDiff {
  loai: LoaiDong;
  /** Số dòng ở bản CŨ (với dòng thêm mới thì là null). */
  soCu: number | null;
  /** Số dòng ở bản MỚI (với dòng bị bỏ thì là null). */
  soMoi: number | null;
  text: string;
}

export interface KetQuaDiff {
  dong: DongDiff[];
  soThem: number;
  soBo: number;
  /** Quá lớn để tính LCS ⇒ hiện dạng thô. Giao diện nên nói rõ điều này. */
  quaLon: boolean;
}

/** Trần cho tích số dòng hai bên. 4 triệu ô ≈ vài chục MB — vẫn tính nổi, hơn nữa thì không. */
const TRAN_O = 4_000_000;
/** Số dòng ngữ cảnh giữ quanh mỗi cụm thay đổi. */
const NGU_CANH = 3;

/**
 * So hai chuỗi theo dòng.
 *
 * `rutGon: true` thì cắt bớt những vùng KHÔNG đổi, chỉ giữ ±3 dòng quanh chỗ
 * sửa. Không cắt thì một thay đổi 2 dòng trong file 800 dòng hiện ra thành 800
 * dòng, và người dùng phải tự đi tìm chỗ khác nhau — tức là họ sẽ bấm duyệt mà
 * không đọc, và cả tầng xin phép mất tác dụng.
 */
export function soSanhDong(cu: string, moi: string, opts: { rutGon?: boolean } = {}): KetQuaDiff {
  const a = cu.split('\n');
  const b = moi.split('\n');

  if (a.length * b.length > TRAN_O) {
    return {
      dong: [
        ...a.map((text, i) => ({ loai: 'bo' as const, soCu: i + 1, soMoi: null, text })),
        ...b.map((text, i) => ({ loai: 'them' as const, soCu: null, soMoi: i + 1, text })),
      ],
      soThem: b.length,
      soBo: a.length,
      quaLon: true,
    };
  }

  // LCS: bang[i][j] = độ dài dãy chung của a[i..] và b[j..]
  const bang: number[][] = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      bang[i]![j] = a[i] === b[j]
        ? bang[i + 1]![j + 1]! + 1
        : Math.max(bang[i + 1]![j]!, bang[i]![j + 1]!);
    }
  }

  const dong: DongDiff[] = [];
  let i = 0;
  let j = 0;
  let soThem = 0;
  let soBo = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) {
      dong.push({ loai: 'giu', soCu: i + 1, soMoi: j + 1, text: a[i]! });
      i++; j++;
    } else if (bang[i + 1]![j]! >= bang[i]![j + 1]!) {
      dong.push({ loai: 'bo', soCu: i + 1, soMoi: null, text: a[i]! });
      soBo++; i++;
    } else {
      dong.push({ loai: 'them', soCu: null, soMoi: j + 1, text: b[j]! });
      soThem++; j++;
    }
  }
  while (i < a.length) { dong.push({ loai: 'bo', soCu: i + 1, soMoi: null, text: a[i]! }); soBo++; i++; }
  while (j < b.length) { dong.push({ loai: 'them', soCu: null, soMoi: j + 1, text: b[j]! }); soThem++; j++; }

  return {
    dong: opts.rutGon === false ? dong : rutGonNguCanh(dong),
    soThem,
    soBo,
    quaLon: false,
  };
}

/**
 * Bỏ những vùng không đổi ở xa chỗ sửa.
 *
 * Vùng bị bỏ được thay bằng một dòng `giu` có `text` rỗng và cả hai số dòng là
 * null — giao diện vẽ nó thành dải "…". Dùng cùng kiểu dữ liệu thay vì thêm
 * một loại thứ tư để chỗ vẽ không phải xử lý thêm nhánh nào.
 */
function rutGonNguCanh(dong: DongDiff[]): DongDiff[] {
  const giuLai = new Set<number>();
  dong.forEach((d, k) => {
    if (d.loai === 'giu') return;
    for (let x = Math.max(0, k - NGU_CANH); x <= Math.min(dong.length - 1, k + NGU_CANH); x++) {
      giuLai.add(x);
    }
  });
  if (giuLai.size === 0) return [];

  const ra: DongDiff[] = [];
  let dangCat = false;
  dong.forEach((d, k) => {
    if (giuLai.has(k)) {
      ra.push(d);
      dangCat = false;
    } else if (!dangCat) {
      ra.push({ loai: 'giu', soCu: null, soMoi: null, text: '' });
      dangCat = true;
    }
  });
  return ra;
}
