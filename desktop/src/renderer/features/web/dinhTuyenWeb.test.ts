import { describe, expect, it } from 'vitest';
import { TUYEN_WEB, khopTuyenWeb, thuocCayWeb } from './dinhTuyenWeb';

describe('khopTuyenWeb', () => {
  it('khớp đường dẫn tĩnh', () => {
    expect(khopTuyenWeb('/language')?.tuyen.mau).toBe('/language');
    expect(khopTuyenWeb('/roadmap')?.tuyen.mau).toBe('/roadmap');
    expect(khopTuyenWeb('/interview')?.tuyen.mau).toBe('/interview');
  });

  it('rút được tham số động', () => {
    expect(khopTuyenWeb('/language/ja')?.thamSo).toEqual({ code: 'ja' });
    expect(khopTuyenWeb('/roadmap/frontend')?.thamSo).toEqual({ slug: 'frontend' });
    const s = khopTuyenWeb('/language/zh/hanzi');
    expect(s?.tuyen.mau).toBe('/language/:code/hanzi');
    expect(s?.thamSo).toEqual({ code: 'zh' });
  });

  /**
   * Chốt quan trọng nhất của tệp này. `/language/notebook` cùng hình dạng với
   * `/language/:code`; nhận nhầm là trang sổ tay gọi API với `code=notebook`
   * rồi hiện "không tìm thấy ngôn ngữ" — hỏng câm, không lỗi nào để thấy.
   */
  it('TĨNH thắng ĐỘNG: /language/notebook không bị đọc thành mã ngôn ngữ', () => {
    const k = khopTuyenWeb('/language/notebook');
    expect(k?.tuyen.mau).toBe('/language/notebook');
    expect(k?.thamSo).toEqual({});
  });

  it('cùng lý do: các trang con có tên cố định thắng /language/:code', () => {
    // `/language/:code` dài 2 đoạn, `/language/:code/vocab` dài 3 — nhưng nếu
    // ai đó thêm `/language/:code/:muc` thì thứ tự mảng là thứ giữ đúng.
    expect(khopTuyenWeb('/language/ja/vocab')?.tuyen.mau).toBe('/language/:code/vocab');
  });

  /*
   * Cây Phỏng vấn có hai đường TĨNH hai đoạn (`drill`, `history`) và hai đường
   * ĐỘNG ba đoạn (`session/:id`, `report/:id`). Chúng không tranh nhau vì
   * `khopTuyenWeb` đòi bằng SỐ ĐOẠN — nhưng đó là thứ dễ vô tình phá khi ai đó
   * thêm `/interview/:x`, nên chốt lại ở đây.
   */
  it('Phỏng vấn: tĩnh 2 đoạn và động 3 đoạn không lẫn nhau', () => {
    expect(khopTuyenWeb('/interview/drill')?.tuyen.mau).toBe('/interview/drill');
    expect(khopTuyenWeb('/interview/drill')?.thamSo).toEqual({});
    expect(khopTuyenWeb('/interview/history')?.tuyen.mau).toBe('/interview/history');

    const s = khopTuyenWeb('/interview/session/42');
    expect(s?.tuyen.mau).toBe('/interview/session/:id');
    expect(s?.thamSo).toEqual({ id: '42' });

    const r = khopTuyenWeb('/interview/report/42');
    expect(r?.tuyen.mau).toBe('/interview/report/:id');
    expect(r?.thamSo).toEqual({ id: '42' });
  });

  it('CV Builder: tám màn tĩnh và một màn động', () => {
    expect(khopTuyenWeb('/cv')?.tuyen.mau).toBe('/cv');
    for (const m of ['import', 'intake', 'profile', 'recruiter-view', 'review', 'target', 'xem']) {
      expect(khopTuyenWeb(`/cv/${m}`)?.tuyen.mau, `/cv/${m}`).toBe(`/cv/${m}`);
      expect(khopTuyenWeb(`/cv/${m}`)?.thamSo).toEqual({});
    }
    const b = khopTuyenWeb('/cv/builder/7');
    expect(b?.tuyen.mau).toBe('/cv/builder/:id');
    expect(b?.thamSo).toEqual({ id: '7' });
  });

  /*
   * ⚠️ BỐN chỗ TĨNH ĐỤNG ĐỘNG của đợt 22/08 — nhiều hơn mọi cây trước cộng lại.
   * Mỗi cặp có CÙNG số đoạn, nên `khopTuyenWeb` chỉ phân biệt được nhờ THỨ TỰ
   * MẢNG. Đảo thứ tự thì trang tĩnh bị đọc thành tham số động: trang mở ra,
   * gọi API với `slug="search"`, rồi hiện "không tìm thấy" — hỏng CÂM, không
   * lỗi nào để thấy. Đúng bài học `/language/notebook`.
   */
  it('TĨNH thắng ĐỘNG ở cả bốn chỗ mới', () => {
    const cap: [string, string, string][] = [
      ['/projects/search', '/projects/search', '/projects/:slug'],
      ['/games/leaderboard', '/games/leaderboard', '/games/:slug'],
      ['/finance/debts/calendar', '/finance/debts/calendar', '/finance/debts/:id'],
    ];
    for (const [duong, mauDung, mauSai] of cap) {
      const k = khopTuyenWeb(duong);
      expect(k?.tuyen.mau, `${duong} bị đọc thành ${mauSai}`).toBe(mauDung);
      expect(k?.thamSo, `${duong} không được sinh tham số nào`).toEqual({});
    }
    /*
     * `/games/love-me` bị BỎ HẲN (xem chú thích trong `dinhTuyenWeb.ts`). Nó
     * KHÔNG được lặng lẽ rơi vào `/games/:slug` — làm thế thì trang chi tiết
     * mở ra với `slug="love-me"`, gọi API, rồi báo "không có game này". Chốt
     * lại ở đây để ai đó thêm lại thì phải thêm CÓ Ý THỨC.
     */
    expect(khopTuyenWeb('/games/love-me')?.tuyen.mau,
      '`/games/love-me` đã bị bỏ — không được rơi vào trang chi tiết')
      .not.toBe('/games/love-me');

    // Và bản ĐỘNG vẫn phải khớp bình thường với giá trị thật.
    expect(khopTuyenWeb('/projects/mot-du-an')?.thamSo).toEqual({ slug: 'mot-du-an' });
    expect(khopTuyenWeb('/games/co-vua')?.thamSo).toEqual({ slug: 'co-vua' });
    expect(khopTuyenWeb('/finance/debts/12')?.thamSo).toEqual({ id: '12' });
  });

  it('mười cây mới: gốc và một đường con tiêu biểu đều khớp', () => {
    const goc = ['/maker-lab', '/creator', '/projects', '/repos', '/exp-hub',
                 '/games', '/finance', '/forum', '/saved', '/profile'];
    for (const g of goc) expect(khopTuyenWeb(g)?.tuyen.mau, g).toBe(g);
    expect(khopTuyenWeb('/creator/projects/7')?.thamSo).toEqual({ id: '7' });
    expect(khopTuyenWeb('/repos/tag/react')?.thamSo).toEqual({ slug: 'react' });
    expect(khopTuyenWeb('/profile/9/v2')?.thamSo).toEqual({ id: '9' });
    expect(khopTuyenWeb('/finance/wallets/3')?.thamSo).toEqual({ id: '3' });
  });

  it('không khớp thì trả null, không đoán bừa', () => {
    expect(khopTuyenWeb('/language/ja/khong-co-trang-nay')).toBeNull();
    expect(khopTuyenWeb('/chat')).toBeNull();
    expect(khopTuyenWeb('/')).toBeNull();
  });

  it('giải mã đoạn có ký tự đặc biệt', () => {
    expect(khopTuyenWeb('/roadmap/c%2B%2B')?.thamSo).toEqual({ slug: 'c++' });
  });

  it('mọi mẫu trong bảng đều tự khớp lại chính nó', () => {
    for (const t of TUYEN_WEB) {
      const mau = t.mau.replace(/:([a-z]+)/g, 'x');
      const k = khopTuyenWeb(mau);
      expect(k, `không khớp lại: ${t.mau}`).not.toBeNull();
    }
  });

  it('không có mẫu nào trùng nhau', () => {
    const thay = new Set<string>();
    for (const t of TUYEN_WEB) {
      expect(thay.has(t.mau), `mẫu trùng: ${t.mau}`).toBe(false);
      thay.add(t.mau);
    }
    expect(thay.size).toBe(73);
  });
});

describe('thuocCayWeb', () => {
  it('nhận cả gốc lẫn trang con', () => {
    expect(thuocCayWeb('/language')).toBe(true);
    expect(thuocCayWeb('/language/ja/vocab')).toBe(true);
    expect(thuocCayWeb('/roadmap/frontend')).toBe(true);
  });

  it('nhận cả cây Phỏng vấn', () => {
    expect(thuocCayWeb('/interview')).toBe(true);
    expect(thuocCayWeb('/interview/history')).toBe(true);
    expect(thuocCayWeb('/interview/report/42')).toBe(true);
  });

  it('nhận cả cây CV', () => {
    expect(thuocCayWeb('/cv')).toBe(true);
    expect(thuocCayWeb('/cv/intake')).toBe(true);
    expect(thuocCayWeb('/cv/builder/7')).toBe(true);
  });

  it('nhận cả mười cây mới', () => {
    for (const d of ['/finance/debts/12', '/games/leaderboard', '/profile/9/v2',
                     '/saved', '/forum/3', '/exp-hub/abc']) {
      expect(thuocCayWeb(d), d).toBe(true);
    }
  });

  it('KHÔNG nhận route chỉ trùng tiền tố chuỗi', () => {
    // `/languages` bắt đầu bằng `/language` nếu so chuỗi trần — phải so theo
    // ranh giới đoạn, không thì một route khác bị nuốt vào cây Ngoại ngữ.
    expect(thuocCayWeb('/languages')).toBe(false);
    expect(thuocCayWeb('/roadmapper')).toBe(false);
    expect(thuocCayWeb('/interviews')).toBe(false);
    expect(thuocCayWeb('/cvs')).toBe(false);
    expect(thuocCayWeb('/games-x')).toBe(false);
    expect(thuocCayWeb('/financeer')).toBe(false);
    expect(thuocCayWeb('/chat')).toBe(false);
  });
});
