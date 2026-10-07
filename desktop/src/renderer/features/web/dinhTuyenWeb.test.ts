import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { TUYEN_WEB, khopTuyenWeb, thuocCayWeb } from './dinhTuyenWeb';

/** Mọi `page.tsx` dưới một thư mục của `frontend/src/app`, đổi thành mẫu `:ten`. */
function mauTuCayWeb(goc: string): string[] {
  const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../../frontend/src/app');
  const ra: string[] = [];
  const di = (thuMuc: string): void => {
    for (const m of fs.readdirSync(thuMuc, { withFileTypes: true })) {
      const p = path.join(thuMuc, m.name);
      if (m.isDirectory()) di(p);
      else if (m.name === 'page.tsx') {
        const tuongDoi = path.relative(app, path.dirname(p)).split(path.sep);
        ra.push(`/${tuongDoi.map((d) => d.replace(/^\[(.+)\]$/, ':$1')).join('/')}`);
      }
    }
  };
  di(path.join(app, goc.replace(/^\//, '')));
  return ra.sort();
}

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
    expect(khopTuyenWeb('/language/ja/dekiru')?.tuyen.mau).toBe('/language/:code/dekiru');
    expect(khopTuyenWeb('/language/en/ielts')?.tuyen.mau).toBe('/language/:code/ielts');
  });

  it('mục IELTS riêng: /ielts… mở đúng trang web IELTS với code = en', () => {
    expect(khopTuyenWeb('/ielts')?.thamSo).toEqual({ code: 'en' });
    expect(khopTuyenWeb('/ielts/phong-thi')?.tuyen.mau).toBe('/ielts/phong-thi');
    expect(khopTuyenWeb('/ielts/luyen-them')?.thamSo).toEqual({ code: 'en' });
    expect(khopTuyenWeb('/language/en/ielts/phong-thi')?.tuyen.mau).toBe('/language/:code/ielts/phong-thi');
    expect(thuocCayWeb('/ielts/phong-thi')).toBe(true);
    // Đợt 1 nâng cấp (07/10/2026): phòng thi máy tính, flashcard, sổ lỗi.
    for (const t of ['thi-may', 'the-tu', 'so-loi']) {
      expect(khopTuyenWeb(`/ielts/${t}`)?.thamSo).toEqual({ code: 'en' });
      expect(khopTuyenWeb(`/language/en/ielts/${t}`)?.tuyen.mau).toBe(`/language/:code/ielts/${t}`);
      expect(thuocCayWeb(`/ielts/${t}`)).toBe(true);
    }
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
    /* Cả cây `/games` và `/repos` đã bị gỡ vì là SERVER COMPONENT — xem chú
       thích trong `dinhTuyenWeb.ts`. Chốt lại để ai đó thêm lại thì phải thêm
       CÓ Ý THỨC, sau khi đã viết lại chúng thành client component. */
    for (const d of ['/games', '/games/leaderboard', '/games/love-me', '/games/co-vua',
                     '/repos', '/repos/12', '/repos/tag/react']) {
      expect(khopTuyenWeb(d), `${d} là server component, phải KHÔNG có tuyến`).toBeNull();
    }
    /* `/projects/:slug` ĐÃ đưa lại (04/10/2026): nạp thẳng phần client
       `ProjectPageClient`, không qua vỏ server `page.tsx`. */
    expect(khopTuyenWeb('/projects/mot-du-an')?.thamSo).toEqual({ slug: 'mot-du-an' });
    // `/exp-hub/:slug` cũng đưa lại cùng ngày — nạp `ChiTietSnippetClient`.
    expect(khopTuyenWeb('/exp-hub/abc')?.thamSo).toEqual({ slug: 'abc' });

    // Và bản ĐỘNG vẫn phải khớp bình thường với giá trị thật.
    expect(khopTuyenWeb('/finance/debts/12')?.thamSo).toEqual({ id: '12' });
  });

  it('mười cây mới: gốc và một đường con tiêu biểu đều khớp', () => {
    const goc = ['/maker-lab', '/creator', '/projects', '/exp-hub',
                 '/finance', '/forum', '/saved', '/profile'];
    for (const g of goc) expect(khopTuyenWeb(g)?.tuyen.mau, g).toBe(g);
    expect(khopTuyenWeb('/creator/projects/7')?.thamSo).toEqual({ id: '7' });
    expect(khopTuyenWeb('/creator/quay-khoa-hoc')?.tuyen.mau).toBe('/creator/quay-khoa-hoc');
    expect(khopTuyenWeb('/creator/y-tuong-ai')?.tuyen.mau).toBe('/creator/y-tuong-ai');
    expect(khopTuyenWeb('/profile/9/v2')?.thamSo).toEqual({ id: '9' });
    expect(khopTuyenWeb('/finance/wallets/3')?.thamSo).toEqual({ id: '3' });
  });

  /*
   * CT Work (23/09/2026). Ba đường TĨNH cùng hình dạng với đường ĐỘNG:
   * `/work/developer` ~ `/work/:ws`, `/work/invite/:token` và
   * `/work/share/:token` ~ `/work/:ws/:key`, cộng `/work/:ws/settings` ~
   * `/work/:ws/:key`. Đảo thứ tự là "developer" thành slug không gian, "invite"
   * thành slug và mã mời thành mã dự án — trang mở ra, gọi API sai, hiện
   * "not found". Hỏng CÂM.
   */
  it('CT Work: tĩnh thắng động ở cả bốn chỗ', () => {
    const cap: [string, string, Record<string, string>][] = [
      ['/work', '/work', {}],
      ['/work/developer', '/work/developer', {}],
      ['/work/search', '/work/search', {}],
      ['/work/invite/abc123', '/work/invite/:token', { token: 'abc123' }],
      ['/work/share/tok-9', '/work/share/:token', { token: 'tok-9' }],
      ['/work/acme/settings', '/work/:ws/settings', { ws: 'acme' }],
    ];
    for (const [duong, mau, thamSo] of cap) {
      const k = khopTuyenWeb(duong);
      expect(k?.tuyen.mau, duong).toBe(mau);
      expect(k?.thamSo, duong).toEqual(thamSo);
    }
  });

  it('CT Work: rút đủ ws · key · num · cycleId', () => {
    expect(khopTuyenWeb('/work/acme')?.thamSo).toEqual({ ws: 'acme' });
    const d = khopTuyenWeb('/work/acme/WEB');
    expect(d?.tuyen.mau).toBe('/work/:ws/:key');
    expect(d?.thamSo).toEqual({ ws: 'acme', key: 'WEB' });

    for (const v of ['board', 'backlog', 'list', 'timeline', 'releases', 'reports',
                     'dashboards', 'tests', 'settings', 'spec']) {
      const k = khopTuyenWeb(`/work/acme/WEB/${v}`);
      expect(k?.tuyen.mau, v).toBe(`/work/:ws/:key/${v}`);
      expect(k?.thamSo, v).toEqual({ ws: 'acme', key: 'WEB' });
    }

    expect(khopTuyenWeb('/work/acme/WEB/portal')?.tuyen.mau).toBe('/work/:ws/:key/portal');
    expect(khopTuyenWeb('/work/acme/WEB/portal/uat/5')?.thamSo).toEqual({ ws: 'acme', key: 'WEB', aid: '5' });
    // Đợt S3b.
    expect(khopTuyenWeb('/work/acme/WEB/meetings/3')?.thamSo).toEqual({ ws: 'acme', key: 'WEB', num: '3' });
    expect(khopTuyenWeb('/work/acme/WEB/changes/7')?.tuyen.mau).toBe('/work/:ws/:key/changes/:num');
    expect(khopTuyenWeb('/work/acme/WEB/raid')?.tuyen.mau).toBe('/work/:ws/:key/raid');
    // Đợt S4.
    expect(khopTuyenWeb('/work/acme/WEB/finance')?.tuyen.mau).toBe('/work/:ws/:key/finance');
    expect(khopTuyenWeb('/work/acme/WEB/present')?.thamSo).toEqual({ ws: 'acme', key: 'WEB' });
    const dd = khopTuyenWeb('/work/acme/WEB/docs/12');
    expect(dd?.tuyen.mau).toBe('/work/:ws/:key/docs/:num');
    expect(dd?.thamSo).toEqual({ ws: 'acme', key: 'WEB', num: '12' });
    expect(khopTuyenWeb('/work/acme/WEB/docs')?.tuyen.mau).toBe('/work/:ws/:key/docs');

    const i = khopTuyenWeb('/work/acme/WEB/issue/42');
    expect(i?.tuyen.mau).toBe('/work/:ws/:key/issue/:num');
    expect(i?.thamSo).toEqual({ ws: 'acme', key: 'WEB', num: '42' });

    const t = khopTuyenWeb('/work/acme/WEB/tests/7');
    expect(t?.tuyen.mau).toBe('/work/:ws/:key/tests/:num');
    expect(t?.thamSo).toEqual({ ws: 'acme', key: 'WEB', num: '7' });

    const c = khopTuyenWeb('/work/acme/WEB/tests/cycles/3');
    expect(c?.tuyen.mau).toBe('/work/:ws/:key/tests/cycles/:cycleId');
    expect(c?.thamSo).toEqual({ ws: 'acme', key: 'WEB', cycleId: '3' });

    // Không có trang cho màn con lạ — không được rơi bừa vào màn nào.
    expect(khopTuyenWeb('/work/acme/WEB/khong-co')).toBeNull();
  });

  /* Cây CT Work đang lớn nhanh (nhiều phiên cùng thêm trang). Trang mới trên
     web mà quên thêm vào bảng thì trong app bấm vào là "Không tìm thấy" — nên
     đối chiếu THẲNG với thư mục, không với một con số chép tay. */
  it('Code Lab: mọi page.tsx đều có tuyến; tĩnh thắng động ở hai chỗ', () => {
    const tuThuMuc = mauTuCayWeb('/code-lab');
    const trongBang = TUYEN_WEB.map((t) => t.mau).filter((m) => m === '/code-lab' || m.startsWith('/code-lab/')).sort();
    expect(trongBang).toEqual(tuThuMuc);
    expect(khopTuyenWeb('/code-lab/search')?.tuyen.mau).toBe('/code-lab/search');
    expect(khopTuyenWeb('/code-lab/phong-lab')?.tuyen.mau).toBe('/code-lab/phong-lab');
    expect(khopTuyenWeb('/code-lab/phong-lab/5')?.thamSo).toEqual({ id: '5' });
    const b = khopTuyenWeb('/code-lab/lab211/p0071');
    expect(b?.tuyen.mau).toBe('/code-lab/:trackSlug/:exerciseSlug');
    expect(b?.thamSo).toEqual({ trackSlug: 'lab211', exerciseSlug: 'p0071' });
    expect(thuocCayWeb('/code-lab/lab211')).toBe(true);
    expect(thuocCayWeb('/code-labs')).toBe(false);
  });

  it('CT Work: mọi page.tsx dưới frontend/src/app/work đều có tuyến, và ngược lại', () => {
    const tuThuMuc = mauTuCayWeb('/work');
    expect(tuThuMuc.length, 'không đọc được cây /work — bộ kiểm hỏng').toBeGreaterThan(10);
    const trongBang = TUYEN_WEB.map((t) => t.mau).filter((m) => m === '/work' || m.startsWith('/work/')).sort();
    expect(trongBang).toEqual(tuThuMuc);
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
    /* Con số CỐ Ý viết cứng: nó là dây bẫy, buộc người thêm tuyến phải mở tệp
       này ra và nhìn lại danh sách. 65 → 73 ngày 07/09/2026 khi cây
       `/tech-trends` (8 tuyến) được dùng lại từ web. 73 → 75 ngày 15/09/2026:
       hai trang tư vấn của Học viện (`/academy/tu-van-nganh`,
       `/academy/so-do-mon-hoc`) — app trước đó không có chúng. 75 → 94 ngày
       23/09/2026: cây CT Work (`/work`, 19 trang). 24/09: `/work/search` ⇒ 95. */
    // 28/09/2026: +2 khoá học kiểu sách (/language/:code/ielts, /language/:code/dekiru).
    // 02/10/2026: +2 Huấn luyện học kỳ (/hoc-tap, /hoc-tap/mon/:id).
    // 03/10/2026: +5 IELTS — Phòng thi & Kho luyện dưới /language/:code/ielts, và
    // mục riêng /ielts, /ielts/phong-thi, /ielts/luyen-them (code cố định 'en').
    // 04/10/2026: +4 CT Work lớp studio S1 (teams, teams/:teamId, stages, approvals).
    // 04/10/2026: +6 Code Lab (cả cây web thay màn native).
    // 04/10/2026: +2 CT Work Đợt S2a — tài liệu dự án (docs, docs/:num).
    // 04/10/2026: +2 Content Creator AI (/creator/quay-khoa-hoc, /creator/y-tuong-ai).
    // 04/10/2026: +2 CT Work Đợt S3a (/work/:ws/portfolio, /work/:ws/workload).
    // 04/10/2026: +2 CT Work Đợt S2b — cổng khách (/work/:ws/:key/portal, /work/:ws/:key/portal/uat/:aid).
    // 04/10/2026: +1 chi tiết dự án (/projects/:slug → ProjectPageClient).
    // 04/10/2026: +5 CT Work Đợt S3b (meetings, meetings/:num, changes, changes/:num, raid).
    // 04/10/2026: +2 CT Work Đợt S4 (finance, present).
    // 04/10/2026: +1 Thông báo (/notifications).
    // 04/10/2026: +1 CT Work Đợt S5a (desk — service desk & SLA).
    // 04/10/2026: +1 chi tiết EXP_Hub (/exp-hub/:slug).
    // 04/10/2026: +1 hồ sơ & tên đăng nhập (/ho-so).
    // 04/10/2026: +1 cài đặt thông báo (/settings/notifications).
    // 04/10/2026: +2 rà toàn bộ trang thiếu (/language/:code/dekiru/sach-goc, /finance/phan-tich).
    // 05/10/2026: +1 CT Work Đợt S6 (spec — Spec quality).
    // 06/10/2026: +1 CT Work Resources (thư viện link của dự án).
    // 07/10/2026: +6 IELTS đợt 1 (thi-may · the-tu · so-loi, mỗi trang 2 đường /ielts… và /language/:code/ielts…).
    expect(thay.size).toBe(151);
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
    for (const d of ['/finance/debts/12', '/profile/9/v2',
                     '/saved', '/forum/3', '/exp-hub/abc']) {
      expect(thuocCayWeb(d), d).toBe(true);
    }
  });

  it('nhận cả cây CT Work, kể cả hai đường công khai', () => {
    for (const d of ['/work', '/work/acme', '/work/acme/WEB/board',
                     '/work/invite/abc', '/work/share/abc']) {
      expect(thuocCayWeb(d), d).toBe(true);
    }
    expect(thuocCayWeb('/workout')).toBe(false);
    expect(thuocCayWeb('/works')).toBe(false);
    expect(thuocCayWeb('/notes/graph')).toBe(true);
    expect(thuocCayWeb('/notesx')).toBe(false);
  });

  it('KHÔNG nhận route chỉ trùng tiền tố chuỗi', () => {
    // `/languages` bắt đầu bằng `/language` nếu so chuỗi trần — phải so theo
    // ranh giới đoạn, không thì một route khác bị nuốt vào cây Ngoại ngữ.
    expect(thuocCayWeb('/languages')).toBe(false);
    expect(thuocCayWeb('/roadmapper')).toBe(false);
    expect(thuocCayWeb('/interviews')).toBe(false);
    expect(thuocCayWeb('/cvs')).toBe(false);
    expect(thuocCayWeb('/financeer')).toBe(false);
    expect(thuocCayWeb('/chat')).toBe(false);
  });
});
