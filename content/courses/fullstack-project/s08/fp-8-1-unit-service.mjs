/**
 * 8.1 — Unit test cho tầng service (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: Node 22.22.2, Vitest 5.1.1, @vitest/coverage-v8 5.1.1, sharp 0.35.5, jose 6.2.18, argon2 0.45.2.
 * Dự án mẫu ChiaSe tag ch7 + nhánh ch8/test (mã test CHƯA commit — tệp trong cây làm việc).
 * Phát hiện thật 24/11: lần chạy đầu văng "Thiếu biến môi trường WEB_ORIGIN" (config.ts đọc env lúc import) ⇒ test/moi-truong.ts
 * (không đọc .env dev); 3 test phát gộp lượt thích đỏ vì Map trạng thái cấp module + hẹn giờ giả chưa chạy rò sang test sau
 * ⇒ afterEach runAllTimersAsync; phá quyền xoá bình luận (bỏ OR trong WHERE) ⇒ 43/43 unit test VẪN XANH; bỏ revokedAt: null
 * ⇒ 1 test đỏ nhưng chỉ vì test chép lại câu lệnh Prisma; tsconfig.json chỉ include src ⇒ test không được tsc kiểm ⇒ tsconfig.test.json.
 * Nguồn (GET 200, 24/11/2026): CrowdStrike "External Technical Root Cause Analysis — Channel File 291" (PDF, 06/08/2024);
 * Wikipedia "2024 CrowdStrike-related IT outages"; Vitest docs (mocking, fake timers).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const THIEU_ENV = `
 RUN  v5.1.1 /home/…/chiase/apps/api

 ❯ test/unit/tokens.test.ts (0 test)

⎯⎯⎯⎯⎯⎯ Failed Suites 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/unit/tokens.test.ts [ test/unit/tokens.test.ts ]
Error: Thiếu biến môi trường WEB_ORIGIN — chép .env.example thành .env rồi điền
 ❯ batBuoc src/config.ts:4:17
      2| function batBuoc(ten: string): string {
      3|   const v = process.env[ten];
      4|   if (!v) throw new Error(\`Thiếu biến môi trường \${ten} — chép .env.ex…
       |                 ^
      5|   return v;
      6| }
 ❯ src/config.ts:18:14

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  no tests
   Start at  23:22:56
   Duration  489ms (worker 96%, environment 4%)`;

const MOI_TRUONG = `// Môi trường RIÊNG cho test — KHÔNG đọc .env của máy dev: test tích hợp xoá sạch bảng, trỏ nhầm vào CSDL dev là mất dữ liệu.
// Chạy TRƯỚC mọi tệp test (setupFiles) ⇒ trước khi src/config.ts đọc process.env.
// ??= : CI (Chương 10) hoặc người chạy có thể đặt sẵn giá trị khác.
process.env.WEB_ORIGIN ??= 'http://localhost:41811';
process.env.JWT_ACCESS_SECRET ??= 'khoa-chi-de-test-khong-dung-o-dau-khac-0123456789';
// Unit test KHÔNG được chạm CSDL: cổng 1 không có gì nghe ⇒ lỡ gọi thật là lỗi ngay, không lặng lẽ ghi vào đâu đó.
process.env.DATABASE_URL ??= 'postgresql://khong:khong@127.0.0.1:1/khong-co';
process.env.S3_ENDPOINT ??= 'http://127.0.0.1:1';
process.env.S3_BUCKET ??= 'chiase-test';
process.env.S3_ACCESS_KEY_ID ??= 'test';
process.env.S3_SECRET_ACCESS_KEY ??= 'test';
process.env.MEDIA_BASE_URL ??= 'http://anh.test/chiase';
// Bộ giới hạn đăng nhập (10 lần/15 phút/IP) đếm trong bộ nhớ: test đăng nhập hàng chục lần từ 127.0.0.1 ⇒ nới ra.
// Tệp test chính giới hạn (gioi-han.api.test.ts) tự đặt lại số nhỏ.
process.env.AUTH_RATE_LIMIT ??= '1000';`;

const VITEST_DAU = `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['test/moi-truong.ts'],
    include: ['test/unit/**/*.test.ts'],
  },
});`;

const TOKENS_TEST = `import { afterEach, describe, it, expect, vi } from 'vitest';
import { SignJWT } from 'jose';
import { kyAccessToken, kiemAccessToken, taoRefreshToken, bamToken } from '../../src/lib/tokens.js';

const b64 = (o: object) =&gt; Buffer.from(JSON.stringify(o)).toString('base64url');

describe('access token', () =&gt; {
  afterEach(() =&gt; vi.useRealTimers());

  it('ký rồi kiểm lại được đúng userId', async () =&gt; {
    const token = await kyAccessToken('u-1');
    expect(await kiemAccessToken(token)).toEqual({ ok: true, userId: 'u-1' });
  });

  it('quá 15 phút ⇒ HET_HAN (client biết đường gọi refresh)', async () =&gt; {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-24T08:00:00Z'));
    const token = await kyAccessToken('u-1');
    vi.setSystemTime(new Date('2026-11-24T08:15:01Z'));
    expect(await kiemAccessToken(token)).toEqual({ ok: false, lyDo: 'HET_HAN' });
  });

  it('token tự khai alg "none" (không chữ ký) ⇒ KHONG_HOP_LE', async () =&gt; {
    const that = await kyAccessToken('u-1');
    const [, than] = that.split('.');
    const gia = \`\${b64({ alg: 'none', typ: 'JWT' })}.\${than}.\`;
    expect(await kiemAccessToken(gia)).toEqual({ ok: false, lyDo: 'KHONG_HOP_LE' });
  });

  it('sửa sub (đổi người) mà giữ chữ ký cũ ⇒ KHONG_HOP_LE', async () =&gt; {
    const [dau, than, ky] = (await kyAccessToken('u-1')).split('.');
    const p = JSON.parse(Buffer.from(than!, 'base64url').toString());
    const gia = \`\${dau}.\${b64({ ...p, sub: 'u-admin' })}.\${ky}\`;
    expect(await kiemAccessToken(gia)).toEqual({ ok: false, lyDo: 'KHONG_HOP_LE' });
  });`;

const CURSOR_TEST = `  it('mã hoá rồi giải mã ra đúng vị trí (giữ cả mili giây)', () =&gt; {
    expect(giaiMaCursor(maHoaCursor(vt(7)))).toEqual(vt(7));
  });

  it.each([
    ['không phải base64 JSON', 'abc'],
    ['JSON thiếu id', Buffer.from('{"t":"2026-11-24T08:00:00.000Z"}').toString('base64url')],
    [
      'id không phải uuid',
      Buffer.from('{"t":"2026-11-24T08:00:00.000Z","id":"1 OR 1=1"}').toString('base64url'),
    ],
    [
      'thừa trường',
      Buffer.from(
        JSON.stringify({ ...JSON.parse(Buffer.from(maHoaCursor(vt(1)), 'base64url').toString()), x: 1 }),
      ).toString('base64url'),
    ],
  ])('cursor hỏng (%s) ⇒ HttpError 400 CURSOR_SAI, không phải lỗi 500', (_ten, s) =&gt; {
    const loi = (() =&gt; {
      try {
        giaiMaCursor(s);
      } catch (e) {
        return e;
      }
    })();
    expect(loi).toBeInstanceOf(HttpError);
    expect(loi).toMatchObject({ status: 400, code: 'CURSOR_SAI' });`;

const AUTH_MOCK = `import { beforeEach, describe, it, expect, vi } from 'vitest';

// Thay MODULE db/prisma.js bằng một vật giả chỉ có đúng các hàm service này gọi. vi.mock được "kéo" lên đầu tệp
// (hoisted) ⇒ chạy TRƯỚC các import bên dưới ⇒ auth.service nhận bản giả. vi.hoisted để biến dùng được trong vi.mock.
const db = vi.hoisted(() =&gt; ({
  user: { create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
  refreshToken: { create: vi.fn(), findUnique: vi.fn(), updateMany: vi.fn() },
}));
vi.mock('../../src/db/prisma.js', () =&gt; ({ prisma: db }));

import { Prisma } from '../../src/generated/prisma/client.js';
import { dangKy, dangNhap, lamMoi } from '../../src/services/auth.service.js';
import { bamToken } from '../../src/lib/tokens.js';

const loiPrisma = (code: string) =&gt;
  new Prisma.PrismaClientKnownRequestError('giả', { code, clientVersion: '7.10.1' });

beforeEach(() =&gt; {
  vi.resetAllMocks(); // mỗi test bắt đầu với hàm giả trắng: không mang kết quả/lần gọi của test trước
  vi.spyOn(console, 'warn').mockImplementation(() =&gt; {});
});`;

const AUTH_LAMMOI = `  it('token hợp lệ ⇒ đánh dấu đã dùng CÓ ĐIỀU KIỆN revokedAt = null, cấp cặp mới CÙNG họ', async () =&gt; {
    db.refreshToken.findUnique.mockResolvedValueOnce(rt());
    db.refreshToken.updateMany.mockResolvedValueOnce({ count: 1 });
    const kq = await lamMoi('token-cu');
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { id: 'rt-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(db.refreshToken.create.mock.calls[0]![0].data).toMatchObject({ userId: 'u-1', familyId: 'ho-1' });
    expect(kq.refreshToken).not.toBe('token-cu');
  });

  it('token ĐÃ DÙNG xuất hiện lại ⇒ thu hồi CẢ HỌ + 401 REFRESH_DUNG_LAI, không cấp gì', async () =&gt; {
    db.refreshToken.findUnique.mockResolvedValueOnce(rt({ revokedAt: new Date() }));
    db.refreshToken.updateMany.mockResolvedValueOnce({ count: 2 });
    await expect(lamMoi('token-cu')).rejects.toMatchObject({ status: 401, code: 'REFRESH_DUNG_LAI' });
    expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
      where: { familyId: 'ho-1', revokedAt: null },
      data: { revokedAt: expect.any(Date) },
    });
    expect(db.refreshToken.create).not.toHaveBeenCalled();
  });

  it('hai request cùng token: request THUA (updateMany đếm 0) ⇒ 401, không cấp cặp thứ hai', async () =&gt; {
    db.refreshToken.findUnique.mockResolvedValueOnce(rt());
    db.refreshToken.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(lamMoi('token-cu')).rejects.toMatchObject({ code: 'REFRESH_DUNG_LAI' });
    expect(db.refreshToken.create).not.toHaveBeenCalled();
  });`;

const CMT_NGHE = `
// KHÔNG mock su-kien.ts: nó là mã CỦA MÌNH và đã có sẵn chỗ cắm (ganNguoiNghe) ⇒ gắn một người nghe thật để ghi lại.
let daPhat: SuKien[] = [];
beforeEach(() =&gt; {
  vi.resetAllMocks();
  daPhat = [];
  ganNguoiNghe((e) =&gt; daPhat.push(e));
});
afterEach(() =&gt; ganNguoiNghe(() =&gt; {}));

const BL = {
  id: 'c-1',
  body: 'Hay quá',
  createdAt: new Date('2026-11-24T08:00:00.123Z'),
  author: { id: 'u-2', displayName: 'Bình' },
};

describe('taoBinhLuan', () =&gt; {
  it('ghi xong ⇒ phát ĐÚNG MỘT sự kiện binh-luan:moi, createdAt là chuỗi ISO (hình dạng trên dây)', async () =&gt; {
    db.post.findUnique.mockResolvedValueOnce({ authorId: 'u-1', status: 'published' });
    db.comment.create.mockResolvedValueOnce(BL);
    await taoBinhLuan('p-1', 'u-2', { body: 'Hay quá' });
    expect(daPhat).toEqual([
      {
        ten: 'binh-luan:moi',
        duLieu: { postId: 'p-1', binhLuan: { ...BL, createdAt: '2026-11-24T08:00:00.123Z' } },
      },
    ]);
  });

  it('ghi LỖI ⇒ KHÔNG phát gì (người khác không được thấy bình luận không tồn tại)', async () =&gt; {
    db.post.findUnique.mockResolvedValueOnce({ authorId: 'u-1', status: 'published' });
    db.comment.create.mockRejectedValueOnce(new Error('mất kết nối CSDL'));
    await expect(taoBinhLuan('p-1', 'u-2', { body: 'x' })).rejects.toThrow('mất kết nối CSDL');
    expect(daPhat).toEqual([]);
  });`;

const LIKE_TEST = `import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

const db = vi.hoisted(() =&gt; ({
  post: { findUnique: vi.fn() },
  like: { createMany: vi.fn(), deleteMany: vi.fn(), count: vi.fn() },
}));
vi.mock('../../src/db/prisma.js', () =&gt; ({ prisma: db }));

import { thich, boThich } from '../../src/services/like.service.js';
import { ganNguoiNghe, type SuKien } from '../../src/lib/su-kien.js';

let daPhat: SuKien[] = [];
beforeEach(() =&gt; {
  vi.resetAllMocks();
  vi.useFakeTimers(); // setTimeout 100 ms của phần "phát gộp" chạy khi TA bảo, không phải đợi thật
  daPhat = [];
  ganNguoiNghe((e) =&gt; daPhat.push(e));
  db.post.findUnique.mockResolvedValue({ authorId: 'u-1', status: 'published' });
  db.like.count.mockResolvedValue(40);
});
// trangThai (Map cấp module trong like.service) SỐNG QUA các test trong cùng tệp. Test trước để lại một hẹn giờ chưa chạy
// ⇒ bài đó kẹt ở 'cho' mãi ⇒ test sau không bao giờ thấy sự kiện (đo thật: 3 test đỏ). Chạy hết hẹn giờ còn treo rồi mới trả đồng hồ thật.
afterEach(async () =&gt; {
  await vi.runAllTimersAsync();
  vi.useRealTimers();
  ganNguoiNghe(() =&gt; {});
});

describe('thich / boThich', () =&gt; {
  it('PUT idempotent: dùng createMany skipDuplicates (ON CONFLICT DO NOTHING), không bắt lỗi trùng', async () =&gt; {
    await expect(thich('p-1', 'u-2')).resolves.toEqual({ liked: true, likeCount: 40 });
    expect(db.like.createMany).toHaveBeenCalledWith({
      data: [{ postId: 'p-1', userId: 'u-2' }],
      skipDuplicates: true,
    });
  });

  it('bài chưa đăng ⇒ 409, không ghi', async () =&gt; {
    db.post.findUnique.mockResolvedValue({ authorId: 'u-2', status: 'draft' });
    await expect(thich('p-1', 'u-2')).rejects.toMatchObject({ status: 409 });
    expect(db.like.createMany).not.toHaveBeenCalled();
  });
});

describe('phát gộp lượt thích', () =&gt; {
  it('40 người bấm cùng lúc ⇒ sau 100 ms phát ĐÚNG MỘT sự kiện với số tuyệt đối', async () =&gt; {
    await Promise.all(Array.from({ length: 40 }, (_, i) =&gt; thich('p-1', \`u-\${i}\`)));
    expect(daPhat).toEqual([]); // chưa tới 100 ms
    await vi.advanceTimersByTimeAsync(100);
    expect(daPhat).toEqual([{ ten: 'luot-thich', duLieu: { postId: 'p-1', likeCount: 40 } }]);
  });`;

const LIKE_RO_RI = `
 RUN  v5.1.1 /home/…/chiase/apps/api

 ❯ test/unit/like.service.test.ts (5 tests | 3 failed) 5032ms
   ❯ phát gộp lượt thích (3)
     × 40 người bấm cùng lúc ⇒ sau 100 ms phát ĐÚNG MỘT sự kiện với số tuyệt đối 11ms
     × có người bấm TRONG LÚC đang đếm ⇒ đếm thêm một lượt, số cuối là số sau lần ghi cuối 5003ms
     × hai bài khác nhau ⇒ hai sự kiện riêng 8ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; 40 người bấm cùng lúc ⇒ sau 100 ms phát ĐÚNG MỘT sự kiện với số tuyệt đối
AssertionError: expected [] to deeply equal [ { ten: 'luot-thich', …(1) } ]

- Expected
+ Received

- [
-   {
-     "duLieu": {
-       "likeCount": 40,
-       "postId": "p-1",
-     },
-     "ten": "luot-thich",
-   },
- ]
+ []

 ❯ test/unit/like.service.test.ts:47:20
     45|     expect(daPhat).toEqual([]); // chưa tới 100 ms
     46|     await vi.advanceTimersByTimeAsync(100);
     47|     expect(daPhat).toEqual([{ ten: 'luot-thich', duLieu: { postId: 'p-…
       |                    ^
     48|   });
     49|

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; có người bấm TRONG LÚC đang đếm ⇒ đếm thêm một lượt, số cuối là số sau lần ghi cuối
TestTimeoutError: Test timed out in 5000ms.
If this is a long-running test, pass a timeout value as the last argument or configure it globally with "testTimeout".
 ❯ test/unit/like.service.test.ts:50:3
     48|   });
     49|
     50|   it('có người bấm TRONG LÚC đang đếm ⇒ đếm thêm một lượt, số cuối là …
       |   ^
     51|     let xongDem!: (n: number) =&gt; void;
     52|     db.like.count

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; hai bài khác nhau ⇒ hai sự kiện riêng
AssertionError: expected [ 'p-2' ] to deeply equal [ 'p-1', 'p-2' ]

- Expected
+ Received

  [
-   "p-1",
    "p-2",
  ]

 ❯ test/unit/like.service.test.ts:72:55
     70|     await thich('p-2', 'u-2');
     71|     await vi.advanceTimersByTimeAsync(100);
     72|     expect(daPhat.map((e) =&gt; e.duLieu.postId).sort()).toEqual(['p-1', …
       |                                                       ^
     73|   });
     74| });

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯`;

const ANH_GIA = `import { beforeEach, describe, it, expect, vi } from 'vitest';
import sharp from 'sharp';

// Kho S3 là dịch vụ NGOÀI (mạng) ⇒ thay bằng một kho GIẢ trong bộ nhớ (fake: một Map chạy thật, không phải hàm trả số
// đóng sẵn). sharp là thư viện chạy TẠI CHỖ và chính là thứ cần kiểm ⇒ để THẬT.
const kho = vi.hoisted(
  () =&gt; new Map&lt;string, { Body: Uint8Array; ContentType?: string; CacheControl?: string }&gt;(),
);
vi.mock('../../src/lib/storage.js', () =&gt; ({
  BUCKET: 'chiase-test',
  s3: {
    send: async (lenh: { constructor: { name: string }; input: Record&lt;string, unknown&gt; }) =&gt; {
      const key = lenh.input.Key as string;
      const vat = kho.get(key);
      switch (lenh.constructor.name) {
        case 'HeadObjectCommand':
          if (!vat) throw Object.assign(new Error('NotFound'), { name: 'NotFound' });
          return { ContentLength: vat.Body.length };
        case 'GetObjectCommand':
          return { Body: { transformToByteArray: async () =&gt; vat!.Body } };
        case 'PutObjectCommand':
          kho.set(key, lenh.input as never);
          return {};
        case 'DeleteObjectCommand':
          kho.delete(key);
          return {};
      }
      throw new Error(\`kho giả chưa hỗ trợ \${lenh.constructor.name}\`);
    },
  },
}));

import { duyetAnh, nhanDangAnh } from '../../src/services/image.service.js';`;

const ANH_TEST = `  it('tệp LAI: 3 byte đầu JPEG + HTML ⇒ qua magic bytes nhưng chết khi giải mã ⇒ 400 ANH_HONG, không lộ lỗi libvips', async () =&gt; {
    const k = keyTam();
    dat(k, Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.from('&lt;html&gt;&lt;script&gt;alert(1)&lt;/script&gt;')]));
    const loi = await duyetAnh(U, k).catch((e) =&gt; e);
    expect(loi).toMatchObject({ status: 400, code: 'ANH_HONG', message: 'Tệp không phải ảnh đọc được' });
    expect(kho.size).toBe(0);
  });`;

const UNIT_CHAY = ` RUN  v5.1.1 /home/…/chiase/apps/api
 ✓ |unit| test/unit/tokens.test.ts &gt; access token &gt; ký rồi kiểm lại được đúng userId 37ms
 ✓ |unit| test/unit/tokens.test.ts &gt; access token &gt; quá 15 phút ⇒ HET_HAN (client biết đường gọi refresh) 13ms
 ✓ |unit| test/unit/tokens.test.ts &gt; access token &gt; token tự khai alg "none" (không chữ ký) ⇒ KHONG_HOP_LE 2ms
 ✓ |unit| test/unit/tokens.test.ts &gt; access token &gt; sửa sub (đổi người) mà giữ chữ ký cũ ⇒ KHONG_HOP_LE 5ms
 ✓ |unit| test/unit/tokens.test.ts &gt; access token &gt; ký bằng khoá khác (môi trường khác, kẻ tự ký) ⇒ KHONG_HOP_LE 2ms
 ✓ |unit| test/unit/tokens.test.ts &gt; refresh token &gt; 32 byte ngẫu nhiên ⇒ 43 ký tự base64url, hai lần tạo không trùng 1ms
 ✓ |unit| test/unit/tokens.test.ts &gt; refresh token &gt; lưu mã băm SHA-256 (hex 64 ký tự), cùng token ⇒ cùng mã băm 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; cursor &gt; mã hoá rồi giải mã ra đúng vị trí (giữ cả mili giây) 6ms
 ✓ |unit| test/unit/cursor.test.ts &gt; cursor &gt; cursor hỏng (không phải base64 JSON) ⇒ HttpError 400 CURSOR_SAI, không phải lỗi 500 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; cursor &gt; cursor hỏng (JSON thiếu id) ⇒ HttpError 400 CURSOR_SAI, không phải lỗi 500 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; cursor &gt; cursor hỏng (id không phải uuid) ⇒ HttpError 400 CURSOR_SAI, không phải lỗi 500 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; cursor &gt; cursor hỏng (thừa trường) ⇒ HttpError 400 CURSOR_SAI, không phải lỗi 500 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; catTrang (lấy limit + 1 dòng) &gt; đủ limit + 1 ⇒ cắt còn limit, nextCursor trỏ phần tử CUỐI trang 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; catTrang (lấy limit + 1 dòng) &gt; vừa đúng limit ⇒ hết trang, nextCursor null (không hứa trang rỗng) 0ms
 ✓ |unit| test/unit/cursor.test.ts &gt; catTrang (lấy limit + 1 dòng) &gt; danh sách rỗng ⇒ nextCursor null 0ms
 ✓ |unit| test/unit/cursor.test.ts &gt; dieuKienSau &gt; feed (giảm dần): createdAt &lt;= t VÀ (createdAt &lt; t HOẶC cùng t mà id nhỏ hơn) 1ms
 ✓ |unit| test/unit/cursor.test.ts &gt; dieuKienSau &gt; bình luận (tăng dần): đảo hết dấu so sánh 0ms
 ✓ |unit| test/unit/health.service.test.ts &gt; kiemSucKhoe &gt; CSDL TREO (không trả lời) ⇒ sau đúng 2 s báo lỗi, health check không treo theo 29ms
 ✓ |unit| test/unit/health.service.test.ts &gt; kiemSucKhoe &gt; lỗi kết nối ⇒ log mã thật (ECONNREFUSED), không phải message rỗng 11ms
 ✓ |unit| test/unit/like.service.test.ts &gt; thich / boThich &gt; PUT idempotent: dùng createMany skipDuplicates (ON CONFLICT DO NOTHING), không bắt lỗi trùng 8ms
 ✓ |unit| test/unit/like.service.test.ts &gt; thich / boThich &gt; bài chưa đăng ⇒ 409, không ghi 3ms
 ✓ |unit| test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; 40 người bấm cùng lúc ⇒ sau 100 ms phát ĐÚNG MỘT sự kiện với số tuyệt đối 3ms
 ✓ |unit| test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; có người bấm TRONG LÚC đang đếm ⇒ đếm thêm một lượt, số cuối là số sau lần ghi cuối 4ms
 ✓ |unit| test/unit/like.service.test.ts &gt; phát gộp lượt thích &gt; hai bài khác nhau ⇒ hai sự kiện riêng 1ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; taoBinhLuan &gt; ghi xong ⇒ phát ĐÚNG MỘT sự kiện binh-luan:moi, createdAt là chuỗi ISO (hình dạng trên dây) 5ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; taoBinhLuan &gt; ghi LỖI ⇒ KHÔNG phát gì (người khác không được thấy bình luận không tồn tại) 6ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; taoBinhLuan &gt; bài bị xoá ngay giữa lúc kiểm và lúc ghi (P2003) ⇒ 404, không phải 500 2ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; taoBinhLuan &gt; bài nháp của NGƯỜI KHÁC ⇒ 404 (như không tồn tại); bài nháp của mình ⇒ 409 BAI_CHUA_DANG 1ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; taoBinhLuan &gt; sự kiện realtime ném lỗi ⇒ request HTTP VẪN thành công 2ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; xoaBinhLuan &gt; xoá được (count 1) ⇒ xong 1ms
 ✓ |unit| test/unit/comment.service.test.ts &gt; xoaBinhLuan &gt; không xoá được mà bình luận còn ⇒ 403; không còn ⇒ 404 1ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; dangKy &gt; email đã có (P2002) ⇒ trả CÙNG câu như đăng ký mới, không lộ "email đã tồn tại" 70ms
 ✓ |unit| test/unit/password.test.ts &gt; mật khẩu &gt; băm bằng argon2id với tham số OWASP, mỗi lần một muối 137ms
 ✓ |unit| test/unit/password.test.ts &gt; mật khẩu &gt; gõ "Mật khẩu ậ" dạng NFD (máy khác) vẫn khớp mã băm tạo từ dạng NFC 79ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; dangKy &gt; lỗi CSDL khác (vd P2039 vi phạm CHECK) ⇒ ném tiếp, KHÔNG nuốt 34ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; dangKy &gt; chuẩn hoá email (khoảng trắng, chữ hoa) trước khi ghi 27ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; dangNhap &gt; email không tồn tại và sai mật khẩu ⇒ CÙNG lỗi 401 SAI_THONG_TIN 23ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; token hợp lệ ⇒ đánh dấu đã dùng CÓ ĐIỀU KIỆN revokedAt = null, cấp cặp mới CÙNG họ 18ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; token ĐÃ DÙNG xuất hiện lại ⇒ thu hồi CẢ HỌ + 401 REFRESH_DUNG_LAI, không cấp gì 1ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; hai request cùng token: request THUA (updateMany đếm 0) ⇒ 401, không cấp cặp thứ hai 2ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; hết hạn ⇒ 401 REFRESH_HET_HAN 2ms
 ✓ |unit| test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; không có cookie / token lạ ⇒ 401 với mã riêng 3ms
 ✓ |unit| test/unit/password.test.ts &gt; mật khẩu &gt; sai mật khẩu ⇒ false 61ms
 ✓ |unit| test/unit/password.test.ts &gt; mật khẩu &gt; mã băm hỏng hoặc "!" (tài khoản khoá) ⇒ false, KHÔNG ném lỗi 1ms
 ✓ |unit| test/unit/password.test.ts &gt; mật khẩu &gt; mã băm tham số cũ (yếu hơn) ⇒ cần băm lại; tham số hiện tại ⇒ không 27ms
 ✓ |unit| test/unit/image.service.test.ts &gt; nhanDangAnh (magic bytes) &gt; jpeg 4ms
 ✓ |unit| test/unit/image.service.test.ts &gt; nhanDangAnh (magic bytes) &gt; png 1ms
 ✓ |unit| test/unit/image.service.test.ts &gt; nhanDangAnh (magic bytes) &gt; webp 0ms
 ✓ |unit| test/unit/image.service.test.ts &gt; nhanDangAnh (magic bytes) &gt; HTML/SVG/GIF ⇒ null (dù đuôi tệp là .jpg) 1ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; ảnh thật có GPS ⇒ bản WebP sạch ở posts/, không còn EXIF, cạnh ≤ 1600, bản tmp đã xoá 166ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; khoá của NGƯỜI KHÁC hoặc tự bịa ⇒ 400 ANH_KHONG_HOP_LE, không đọc kho 2ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; chưa tải lên ⇒ 400 ANH_CHUA_TAI_LEN 0ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; HTML đội lốt ảnh ⇒ 400 ANH_SAI_DINH_DANG, bản tmp bị xoá 0ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; tệp LAI: 3 byte đầu JPEG + HTML ⇒ qua magic bytes nhưng chết khi giải mã ⇒ 400 ANH_HONG, không lộ lỗi libvips 2ms
 ✓ |unit| test/unit/image.service.test.ts &gt; duyetAnh &gt; bom điểm ảnh: 8000×5001 (&gt; 40 triệu điểm) ⇒ 400 ANH_QUA_LON trước khi giải mã hết 403ms
 Test Files  8 passed (8)
      Tests  55 passed (55)
   Start at  23:46:30
   Duration  1.57s (import 45%, tests 38%, transform 11%, setup 4%, worker 3%)`;

const PHA_QUYEN_DIFF = `diff --git a/apps/api/src/services/comment.service.ts b/apps/api/src/services/comment.service.ts
index 77371a9..bcd6ac5 100644
--- a/apps/api/src/services/comment.service.ts
+++ b/apps/api/src/services/comment.service.ts
@@ -63,7 +63,7 @@ export async function taoBinhLuan(postId: string, tacGia: string, { body }: TaoB
 // Điều kiện quyền nằm NGAY TRONG câu DELETE (như bài 4.1) — kiểm và xoá là một câu lệnh.
 export async function xoaBinhLuan(id: string, nguoiLam: string) {
   const { count } = await prisma.comment.deleteMany({
-    where: { id, OR: [{ authorId: nguoiLam }, { post: { authorId: nguoiLam } }] },
+    where: { id },
   });
   if (count === 1) return;
   const con = await prisma.comment.findUnique({ where: { id }, select: { id: true } });`;

const PHA_QUYEN = ` Test Files  6 passed (6)
      Tests  43 passed (43)
   Start at  23:25:02
   Duration  989ms (import 44%, tests 31%, transform 17%, setup 5%, worker 3%)`;

const PHA_DUA = ` RUN  v5.1.1 /home/…/chiase/apps/api
 ❯ test/unit/auth.service.test.ts (9 tests | 1 failed) 223ms
   ❯ lamMoi (xoay vòng refresh token) (5)
     × token hợp lệ ⇒ đánh dấu đã dùng CÓ ĐIỀU KIỆN revokedAt = null, cấp cặp mới CÙNG họ 20ms
⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯
 FAIL  test/unit/auth.service.test.ts &gt; lamMoi (xoay vòng refresh token) &gt; token hợp lệ ⇒ đánh dấu đã dùng CÓ ĐIỀU KIỆN revokedAt = null, cấp cặp mới CÙNG họ
AssertionError: expected "vi.fn()" to be called with arguments: [ { …(2) } ]
Received:
  1st vi.fn() call:
@@ -3,9 +3,8 @@
      "data": {
        "revokedAt": 2026-11-24T16:25:10.823Z,
      },
      "where": {
        "id": "rt-1",
-       "revokedAt": null,
      },
    },
  ]
Number of calls: 1
 ❯ test/unit/auth.service.test.ts:69:40
     67|     db.refreshToken.updateMany.mockResolvedValueOnce({ count: 1 });
     68|     const kq = await lamMoi('token-cu');
     69|     expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
       |                                        ^
     70|       where: { id: 'rt-1', revokedAt: null },
     71|       data: { revokedAt: expect.any(Date) },
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯
 Test Files  1 failed | 5 passed (6)
      Tests  1 failed | 42 passed (43)`;

const TSCONFIG_TEST = `{
  // Kiểm kiểu CHO TEST. Vitest chỉ BÓC kiểu rồi chạy (như tsx) — test gõ sai kiểu vẫn chạy được, nên tsc phải kiểm riêng.
  // Tách khỏi tsconfig.json vì tệp đó còn dùng để BUILD (rootDir src ⇒ dist/); test không được lọt vào bản build.
  "extends": "./tsconfig.json",
  "compilerOptions": { "rootDir": ".", "noEmit": true },
  "include": ["src", "test", "vitest.config.ts"]
}`;


const MERMAID = `flowchart TB
  E2E["Checkpoint 1–7: trình duyệt thật + API thật<br/>(vài phút, ít, đắt)"]
  API["8.3 Test API: Supertest + Postgres thật<br/>(giây)"]
  TH["8.2 Tích hợp: service + Postgres thật<br/>(giây)"]
  U["8.1 Unit: hàm thuần + service với CSDL giả<br/>(mili giây, nhiều)"]
  E2E --> API --> TH --> U`;

const MERMAID_EN = `flowchart TB
  E2E["Checkpoints 1–7: real browser + real API<br/>(minutes, few, expensive)"]
  API["8.3 API tests: Supertest + real Postgres<br/>(seconds)"]
  TH["8.2 Integration: services + real Postgres<br/>(seconds)"]
  U["8.1 Unit: pure functions + services with a fake DB<br/>(milliseconds, many)"]
  E2E --> API --> TH --> U`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-1-1-cau-truc', title: 'Testing 1.1 — Giải phẫu một test: chuẩn bị, hành động, khẳng định', sub: 'Nền của mọi test trong chương này: AAA, một lý do để đỏ.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-1-phan-loai', title: 'Testing 3.1 — Stub, mock, spy, fake: mỗi loại là gì', sub: 'Kho S3 giả trong bài là một "fake"; Prisma giả là "stub + spy".', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-3-3-qua-da', title: 'Testing 3.3 — Khi mock làm test vô giá trị', sub: 'Đúng hiện tượng 43 test xanh với lỗi phân quyền ở mục 7.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-2-2-thoi-gian', title: 'Testing 2.2 — Kiểm soát thời gian: fake timers', sub: 'advanceTimersByTimeAsync, setSystemTime, và bẫy hẹn giờ còn treo.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-14-2-unit-test', title: 'Node.js 14.2 — Test đơn vị, hàng giả, và những bài test không kiểm gì', sub: 'Góc nhìn Node thuần cho cùng chủ đề.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📄', 'CrowdStrike — External Technical Root Cause Analysis, Channel File 291 (06/08/2024)', 'crowdstrike.com (PDF)', 'https://www.crowdstrike.com/wp-content/uploads/2024/08/Channel-File-291-Incident-Root-Cause-Analysis-08.06.2024.pdf'),
  nguon('📖', 'Wikipedia — 2024 CrowdStrike-related IT outages', 'en.wikipedia.org', 'https://en.wikipedia.org/wiki/2024_CrowdStrike-related_IT_outages'),
  nguon('🧪', 'Vitest — Mocking (vi.mock, vi.hoisted)', 'vitest.dev', 'https://vitest.dev/guide/mocking'),
  nguon('⏱️', 'Vitest — Fake timers (vi.useFakeTimers)', 'vitest.dev', 'https://vitest.dev/api/vi#vi-usefaketimers'),
].join('\n');

export default {
  title: '8.1 — Unit tests for services|||8.1 — Unit test cho tầng service',
  slug: 'fp-8-1-unit-service',
  type: 'LESSON',
  isFreePreview: false,
  description: 'Bật Vitest 5 cho API ChiaSe và viết 55 unit test thật: hàm thuần (token, cursor, mật khẩu NFC), service với Prisma giả (vi.mock + vi.hoisted), cắm người nghe sự kiện thay vì mock mã của mình, đồng hồ giả cho phần phát gộp lượt thích (và cái bẫy trạng thái cấp module làm 3 test đỏ), kho S3 giả + sharp thật cho phần duyệt ảnh. Rồi tự tay cài lỗi "ai cũng xoá được bình luận" — 43/43 unit test vẫn xanh: lý do chương này cần Postgres thật ở bài 8.2.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Testing the stack</span>
<h2>Seven checkpoints say ChiaSe works. Can you change it tomorrow without fear?</h2>
<p class="lead">Every chapter so far ended with a checkpoint script that drives the real app — and each one caught real bugs. But they take minutes, need a browser, Postgres, MinIO and a running API, and when one fails it tells you "the feed is wrong", not "line 27 of cursor.ts is wrong". This chapter builds the layers underneath: hundreds of small tests that run in seconds, need nothing installed except Docker, and point at the exact function that broke. We start at the bottom: unit tests for the code that holds ChiaSe's rules.</p>

<pre><code class="language-mermaid">${MERMAID_EN}</code></pre>

<h3>1. Install Vitest — and the first run fails for a good reason</h3>
<pre><code class="language-bash">npm i -w apps/api -D --save-exact vitest@5.1.1 @vitest/coverage-v8@5.1.1 supertest@7.3.2 @types/supertest@7.2.1</code></pre>
<p>Vitest runs TypeScript directly (it strips types, like tsx) and speaks the same <code>describe/it/expect</code> as Jest. The very first test — sign a token, verify it — fails before a single assertion runs:</p>
<div class="out">${THIEU_ENV}</div>
<p>That is <code>config.ts</code> from Chapter 2 doing its job: it reads the environment <em>at import time</em> and refuses to start half-configured. Tests import <code>tokens.ts</code>, which imports <code>config.ts</code>. The tempting fix is "load <code>apps/api/.env</code> in tests". Don't: the integration tests in 8.2 empty every table before each test, and your <code>.env</code> points at your development database. Tests get their own environment, set in a setup file that runs before any test file is imported:</p>
<pre><code class="language-ts">${MOI_TRUONG}</code></pre>
<pre><code class="language-ts">${VITEST_DAU}</code></pre>
<p>Note the unit-test database URL points at port 1, where nothing listens. A unit test that accidentally reaches the database fails loudly instead of quietly writing somewhere.</p>

<h3>2. Pure functions first: the cheapest tests you will ever write</h3>
<p>Code with no I/O is tested by calling it. For tokens, the interesting cases are attacks, not the happy path — each of these is a sentence from Chapter 3 turned into something that runs:</p>
<pre><code class="language-ts">${TOKENS_TEST}</code></pre>
<p><code>vi.useFakeTimers({ toFake: ['Date'] })</code> replaces only <code>Date</code>: jose reads the clock through it, so "16 minutes later" takes zero milliseconds. For inputs that share one rule, <code>it.each</code> keeps four cases in one place:</p>
<pre><code class="language-ts">${CURSOR_TEST}</code></pre>

<h3>3. Services that talk to the database: a fake Prisma</h3>
<p>Services import a module-level <code>prisma</code>. <code>vi.mock</code> swaps that whole module for an object you control; Vitest hoists the call above the imports, so the service under test receives the fake. Variables used inside the factory must be created with <code>vi.hoisted</code> (they are hoisted too):</p>
<pre><code class="language-ts">${AUTH_MOCK}</code></pre>
<pre><code class="language-ts">${AUTH_LAMMOI}</code></pre>
<p>These tests are fast (the whole auth file: ~200 ms, most of it one argon2 hash at import) and they pin down decisions that are easy to lose in a refactor: a reused token revokes the <em>family</em>, the loser of a race gets 401 and no new pair. Section 7 shows what they cannot do.</p>

<h3>4. Don't mock your own code when it already has a socket</h3>
<p>In Chapter 7 services announce events through <code>lib/su-kien.ts</code> and never import Socket.IO. That design pays off now: instead of mocking the event module, the test plugs in a real listener with <code>ganNguoiNghe</code> and records what was emitted — including the rule "emit <em>after</em> the write, never for a failed write":</p>
<pre><code class="language-ts">${CMT_NGHE}</code></pre>

<h3>5. Time: fake timers, and a leak between tests</h3>
<p>Likes are batched: at most one count-and-emit per post per 100 ms (lesson 7.2). With fake timers, "100 ms later" is <code>await vi.advanceTimersByTimeAsync(100)</code>. The first version of this file went red in a way worth remembering:</p>
<div class="out">${LIKE_RO_RI}</div>
<p>The failing tests were correct; the earlier tests leaked. <code>like.service</code> keeps a module-level <code>Map</code> of posts "waiting to emit". The first tests call <code>thich('p-1')</code>, which schedules a fake timer; the test ends, real timers come back, and that fake timer never fires — so post <code>p-1</code> is stuck in "waiting" for the rest of the file and every later emit is skipped. Module state lives as long as the test file. The fix is to drain pending timers before handing the clock back:</p>
<pre><code class="language-ts">${LIKE_TEST}</code></pre>
<p>The second test pins down the subtle case from 7.2: a click lands <em>while</em> a count is running, the old count returns a stale number, and the service must count once more. Controlling exactly when a promise resolves (<code>xongDem(2)</code>) is something no real database lets you do on purpose.</p>

<h3>6. A fake object store, a real image library</h3>
<p>Image approval (lesson 4.3) talks to S3 and runs sharp. S3 is a network service we don't own — replace it with a <em>fake</em>: a working in-memory store, not a list of canned answers. sharp runs locally and <em>is</em> the thing under test — keep it real:</p>
<pre><code class="language-ts">${ANH_GIA}</code></pre>
<pre><code class="language-ts">${ANH_TEST}</code></pre>
<p>The GPS test builds a real JPEG with EXIF, the bomb test builds a real 8000×5001 PNG. Mocking sharp would have tested our <code>if</code> statements and nothing about the decoder.</p>
<p>All unit tests together:</p>
<div class="out">${UNIT_CHAY}</div>

<h3>7. What unit tests with a fake database cannot see</h3>
<p>Comment deletion checks permission <em>inside</em> the DELETE statement (5.1). Let's plant the worst bug possible — anyone can delete anyone's comment:</p>
<pre><code class="language-diff">${PHA_QUYEN_DIFF}</code></pre>
<div class="out">${PHA_QUYEN}</div>
<p>All green. Of course: the fake <code>deleteMany</code> returns <code>{count: 1}</code> whatever <code>where</code> it receives. The rule lives in SQL, and only a database evaluates SQL. Now remove <code>revokedAt: null</code> from the conditional update that makes refresh safe under concurrency:</p>
<div class="out">${PHA_DUA}</div>
<p>Caught — but look at <em>why</em>: the test compares the exact Prisma arguments. It would also go red for a harmless rewrite that keeps the behaviour, and it says nothing about whether two real requests can both win. A test that repeats the implementation is a second copy of the code, not a check on it. Both rules belong to the next lesson, against a real Postgres.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">env</span><span class="lz-d">test có môi trường riêng, không bao giờ đọc .env dev</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thuần</span><span class="lz-d">hàm không I/O: gọi và khẳng định, ưu tiên ca tấn công</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">giả CSDL</span><span class="lz-d">vi.mock + vi.hoisted cho prisma; reset mỗi test</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">cắm</span><span class="lz-d">mã của mình có chỗ cắm ⇒ cắm người nghe thật, đừng mock</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">đồng hồ</span><span class="lz-d">fake timers + xả hẹn giờ còn treo sau mỗi test</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">giới hạn</span><span class="lz-d">luật nằm trong SQL ⇒ unit test không thấy ⇒ 8.2</span></div>
</div>

<p>One last gap: <code>tsconfig.json</code> includes only <code>src</code>, and Vitest strips types without checking them — a test with a type error still runs. A second config checks tests without putting them in the build:</p>
<pre><code class="language-json">${TSCONFIG_TEST}</code></pre>

<div class="pitfall co-tieu-de"><p><strong>Trap — vi.mock pointing at the wrong path.</strong> The path in <code>vi.mock('../../src/db/prisma.js')</code> is relative to the TEST file and must match exactly the module the service imports (including <code>.js</code>). One level off and Vitest mocks a module nobody uses; the service still imports the real Prisma — and your test either hangs on port 1 or, worse, runs against a real database if the environment has one. The test environment points at port 1 precisely so this shows up immediately.</p></div>

<h3>Everyday analogy</h3>
<p>A unit test is checking each ingredient before cooking: the eggs are fresh, the scale reads 100 g for 100 g. It is fast and catches a lot. It cannot tell you the cake will rise in <em>your</em> oven — that needs the oven (8.2).</p>

<h3>On the job</h3>
<p>Outsourcing projects often arrive with a "test" folder full of tests that mock every repository and assert that <code>repository.save</code> was called once. Coverage looks great and the tests break on every refactor while catching nothing. In code review, ask one question per test: "which bug would make this red?" If the only answer is "changing the implementation", it is a copy, not a test.</p>

<h3>⚠️ Real incident: CrowdStrike, 19 July 2024</h3>
<p>At 04:09 UTC CrowdStrike shipped a content update for its Falcon sensor; about 8.5 million Windows machines crashed (Wikipedia). The company's root-cause analysis (06/08/2024) is a lesson about tests that pass for the wrong reason: a new template type defined 21 input fields while the sensor code supplied 20. The automated tests used "a static set of 12 test cases", and the test data used a <em>wildcard</em> for the 21st field in every case — so the code path that read the 21st value never ran in testing. The first real update with a non-wildcard value in that field triggered an out-of-bounds read. Their fix: automated tests with a non-wildcard value for <em>every</em> field. Same idea as section 7: a test only protects the paths it actually exercises with realistic input.</p>

${spring(true, 'Spring splits the same layers: plain JUnit 5 + AssertJ for pure logic, Mockito (<code>@Mock</code>, <code>when(...).thenReturn(...)</code>, <code>verify(...)</code>) for services with a mocked repository. The trap in section 7 is identical — a mocked <code>JpaRepository</code> never runs the <code>@Query</code>.', [
  ['sb-11-1-junit5', 'Spring Boot 11.1 — JUnit 5 and AssertJ'],
  ['sb-11-2-mockito', 'Spring Boot 11.2 — Mockito: unit tests for services'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"What is a unit test, and what should you mock?"</strong> — Tests one unit's behaviour in isolation, fast. Replace what is slow, non-deterministic or external (network, clock, database); keep your own logic and local libraries real.</li>
<li><strong>"Mock, stub, fake — difference?"</strong> — Stub returns canned answers; mock also verifies calls; fake is a working lightweight implementation (in-memory store).</li>
<li><strong>"How do you test code with timers?"</strong> — Fake timers, advance time explicitly, and drain or clear pending timers after each test so state doesn't leak.</li>
<li><strong>"All tests green, a bug reached production. How?"</strong> — Tests didn't exercise that path or mocked away the part with the rule (SQL, config). Mutation testing shows it.</li>
<li><strong>"Why not load the .env file in tests?"</strong> — Tests must be reproducible on any machine and must never point at a real database they will wipe.</li>
</ol>

<h3>🧪 Lab 8.1 (90 minutes)</h3>
<div class="callout ok">
<ol>
<li>Install Vitest, create <code>test/moi-truong.ts</code> and <code>vitest.config.ts</code>; make the first token test pass without reading <code>.env</code>.</li>
<li>Write tests for <code>tokens.ts</code> (expiry with a fake clock, <code>alg: none</code>, tampered <code>sub</code>, foreign key) and <code>cursor.ts</code> (round trip, four broken cursors with <code>it.each</code>, <code>catTrang</code> edge cases).</li>
<li>Test <code>lamMoi</code> with a mocked prisma: valid, reused (family revoked), lost race, expired, missing.</li>
<li>Test the like batching with fake timers. Reproduce the leak by removing the <code>afterEach</code> drain, then fix it.</li>
<li>Plant the comment-permission bug from section 7 and confirm your unit tests stay green. Write one sentence explaining why.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run</code> is green with ≥ 40 tests in under 2 s, <code>npx tsc -p tsconfig.test.json</code> is clean, and you can name one rule your unit tests cannot protect.</p>
<p><strong>Rubric (10):</strong> isolated env (1) · attack cases for tokens (2) · it.each for one rule (1) · mocked service tests on behaviour, not wording (2) · fake timers with no leak (2) · the planted-bug experiment explained (2).</p>
</div>
<details><summary>Solution</summary>
<p>Branch <code>ch8/test</code>: <code>apps/api/test/moi-truong.ts</code>, <code>apps/api/vitest.config.ts</code>, <code>apps/api/tsconfig.test.json</code>, <code>apps/api/test/unit/*.test.ts</code> (tokens, cursor, password, auth.service, comment.service, like.service, image.service, health.service).</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unit test</span><span class="v">Tests one function/module in isolation; milliseconds; no network or database.</span></div>
  <div class="kv"><span class="k">vi.mock / vi.hoisted</span><span class="v">Replace a whole module before it is imported; hoisted variables for the factory.</span></div>
  <div class="kv"><span class="k">fake</span><span class="v">A working simplified implementation (in-memory S3).</span></div>
  <div class="kv"><span class="k">fake timers</span><span class="v">Replace setTimeout/Date so a test moves time explicitly.</span></div>
  <div class="kv"><span class="k">setupFiles</span><span class="v">Code Vitest runs before each test file — here: the test environment.</span></div>
  <div class="kv"><span class="k">module state</span><span class="v">Variables at module level survive across tests in the same file.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Tests get their own environment; never your development <code>.env</code>.</li>
<li>Pure functions: test the attacks and the edges, not just the happy path.</li>
<li>Mock what is external (database client, S3); plug into your own seams; keep local libraries (sharp) real.</li>
<li>Fake timers make time-based code deterministic — drain pending timers or module state leaks.</li>
<li>Rules written in SQL are invisible to tests with a fake database: 43/43 green with a permission bug.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Test cả hệ thống</span>
<h2>Bảy checkpoint nói ChiaSe chạy được. Mai sửa nó, bạn có dám không?</h2>
<p class="lead">Chương nào cũng kết thúc bằng một script checkpoint lái app thật — và chương nào nó cũng bắt được bug thật. Nhưng chúng chạy mất vài phút, cần trình duyệt, Postgres, MinIO và API đang chạy, và khi đỏ thì chỉ nói "feed sai", không nói "dòng 27 của cursor.ts sai". Chương này xây các tầng bên dưới: hàng trăm test nhỏ chạy trong vài giây, không cần cài gì ngoài Docker, và chỉ thẳng vào hàm bị hỏng. Bắt đầu từ đáy: unit test cho phần mã giữ luật của ChiaSe.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Cài Vitest — và lần chạy đầu hỏng vì một lý do tốt</h3>
<pre><code class="language-bash">npm i -w apps/api -D --save-exact vitest@5.1.1 @vitest/coverage-v8@5.1.1 supertest@7.3.2 @types/supertest@7.2.1</code></pre>
<p>Vitest chạy thẳng TypeScript (bóc kiểu như tsx) và dùng cùng <code>describe/it/expect</code> với Jest. Test đầu tiên — ký một token rồi kiểm lại — hỏng trước khi kịp khẳng định gì:</p>
<div class="out">${THIEU_ENV}</div>
<p>Đó là <code>config.ts</code> từ Chương 2 đang làm đúng việc: nó đọc biến môi trường <em>lúc import</em> và từ chối chạy khi thiếu cấu hình. Test import <code>tokens.ts</code>, tệp này import <code>config.ts</code>. Cách sửa hấp dẫn là "cho test đọc <code>apps/api/.env</code>". Đừng: test tích hợp ở bài 8.2 xoá sạch mọi bảng trước mỗi test, mà <code>.env</code> của bạn trỏ vào CSDL dev. Test có môi trường RIÊNG, đặt trong một tệp setup chạy trước khi bất kỳ tệp test nào được import:</p>
<pre><code class="language-ts">${MOI_TRUONG}</code></pre>
<pre><code class="language-ts">${VITEST_DAU}</code></pre>
<p>Để ý URL CSDL của unit test trỏ vào cổng 1, nơi không có gì nghe. Unit test nào lỡ chạm CSDL sẽ hỏng ầm ĩ thay vì lặng lẽ ghi vào đâu đó.</p>

<h3>2. Hàm thuần trước: loại test rẻ nhất bạn từng viết</h3>
<p>Mã không có I/O thì test bằng cách gọi nó. Với token, ca đáng test là các kiểu tấn công, không phải đường đi suôn sẻ — mỗi test dưới đây là một câu trong Chương 3 được biến thành thứ chạy được:</p>
<pre><code class="language-ts">${TOKENS_TEST}</code></pre>
<p><code>vi.useFakeTimers({ toFake: ['Date'] })</code> chỉ thay <code>Date</code>: jose đọc đồng hồ qua nó, nên "16 phút sau" tốn 0 mili giây. Nhiều đầu vào cùng một luật thì <code>it.each</code> gom bốn ca vào một chỗ:</p>
<pre><code class="language-ts">${CURSOR_TEST}</code></pre>

<h3>3. Service nói chuyện với CSDL: một Prisma giả</h3>
<p>Service import biến <code>prisma</code> cấp module. <code>vi.mock</code> thay cả module đó bằng một object bạn điều khiển; Vitest kéo lời gọi này lên trên các import, nên service đang test nhận bản giả. Biến dùng trong hàm tạo của mock phải tạo bằng <code>vi.hoisted</code> (cũng được kéo lên):</p>
<pre><code class="language-ts">${AUTH_MOCK}</code></pre>
<pre><code class="language-ts">${AUTH_LAMMOI}</code></pre>
<p>Các test này nhanh (cả tệp auth: ~200 ms, phần lớn là một lần băm argon2 lúc import) và chúng ghim lại những quyết định dễ mất khi refactor: token bị dùng lại thì thu hồi CẢ HỌ, bên thua cuộc đua nhận 401 và không có cặp mới. Mục 7 cho thấy chúng KHÔNG làm được gì.</p>

<h3>4. Đừng mock mã của chính mình khi nó đã có chỗ cắm</h3>
<p>Ở Chương 7, service báo sự kiện qua <code>lib/su-kien.ts</code> và không bao giờ import Socket.IO. Thiết kế đó giờ có lời: thay vì mock module sự kiện, test cắm một người nghe THẬT bằng <code>ganNguoiNghe</code> và ghi lại những gì được phát — kể cả luật "phát SAU khi ghi, ghi lỗi thì không phát":</p>
<pre><code class="language-ts">${CMT_NGHE}</code></pre>

<h3>5. Thời gian: đồng hồ giả, và một vụ rò giữa các test</h3>
<p>Lượt thích được phát gộp: mỗi bài tối đa một lần đếm-và-phát mỗi 100 ms (bài 7.2). Với đồng hồ giả, "100 ms sau" là <code>await vi.advanceTimersByTimeAsync(100)</code>. Bản đầu của tệp này đỏ theo một kiểu đáng nhớ:</p>
<div class="out">${LIKE_RO_RI}</div>
<p>Ba test đỏ viết đúng; test chạy TRƯỚC chúng mới làm rò. <code>like.service</code> giữ một <code>Map</code> cấp module ghi các bài "đang chờ phát". Hai test đầu gọi <code>thich('p-1')</code>, hàm này hẹn một giờ giả; test kết thúc, đồng hồ thật quay lại, và hẹn giờ giả đó không bao giờ chạy — nên bài <code>p-1</code> kẹt ở trạng thái "chờ" suốt phần còn lại của tệp, mọi lần phát sau đều bị bỏ qua. Trạng thái cấp module sống lâu bằng cả tệp test. Cách sửa: chạy hết hẹn giờ còn treo rồi mới trả đồng hồ thật:</p>
<pre><code class="language-ts">${LIKE_TEST}</code></pre>
<p>Test thứ hai ghim lại ca tinh vi ở 7.2: một lần bấm rơi vào ĐÚNG lúc đang đếm, lần đếm cũ trả số cũ, và service phải đếm thêm một lượt. Điều khiển chính xác lúc một promise xong (<code>xongDem(2)</code>) là việc không CSDL thật nào cho bạn làm theo ý muốn.</p>

<h3>6. Kho ảnh giả, thư viện ảnh thật</h3>
<p>Duyệt ảnh (bài 4.3) nói chuyện với S3 và chạy sharp. S3 là dịch vụ mạng không phải của ta — thay bằng một <em>fake</em>: một kho trong bộ nhớ chạy thật, không phải danh sách câu trả lời đóng sẵn. sharp chạy tại chỗ và CHÍNH LÀ thứ cần kiểm — để thật:</p>
<pre><code class="language-ts">${ANH_GIA}</code></pre>
<pre><code class="language-ts">${ANH_TEST}</code></pre>
<p>Test GPS dựng một JPEG thật có EXIF, test bom dựng một PNG thật 8000×5001. Mock sharp thì chỉ test được mấy câu <code>if</code> của ta, không test gì về bộ giải mã.</p>
<p>Toàn bộ unit test:</p>
<div class="out">${UNIT_CHAY}</div>

<h3>7. Thứ unit test với CSDL giả không nhìn thấy</h3>
<p>Xoá bình luận kiểm quyền NGAY TRONG câu DELETE (bài 5.1). Thử cài bug tệ nhất có thể — ai cũng xoá được bình luận của người khác:</p>
<pre><code class="language-diff">${PHA_QUYEN_DIFF}</code></pre>
<div class="out">${PHA_QUYEN}</div>
<p>Xanh hết. Đương nhiên: <code>deleteMany</code> giả trả <code>{count: 1}</code> bất kể nhận <code>where</code> gì. Luật nằm trong SQL, và chỉ CSDL mới chạy SQL. Giờ bỏ <code>revokedAt: null</code> khỏi câu cập nhật có điều kiện — thứ giữ cho refresh an toàn khi chạy song song:</p>
<div class="out">${PHA_DUA}</div>
<p>Bắt được — nhưng nhìn kỹ <em>vì sao</em>: test so sánh nguyên văn tham số Prisma. Nó cũng sẽ đỏ khi bạn viết lại vô hại mà giữ nguyên hành vi, và nó không nói gì về chuyện hai request thật có cùng thắng được hay không. Test lặp lại phần cài đặt là bản sao thứ hai của mã, không phải phép kiểm. Cả hai luật thuộc về bài sau, trên Postgres thật.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">env</span><span class="lz-d">test có môi trường riêng, không bao giờ đọc .env dev</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">thuần</span><span class="lz-d">hàm không I/O: gọi và khẳng định, ưu tiên ca tấn công</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">giả CSDL</span><span class="lz-d">vi.mock + vi.hoisted cho prisma; reset mỗi test</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">cắm</span><span class="lz-d">mã của mình có chỗ cắm ⇒ cắm người nghe thật, đừng mock</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">đồng hồ</span><span class="lz-d">fake timers + xả hẹn giờ còn treo sau mỗi test</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">giới hạn</span><span class="lz-d">luật nằm trong SQL ⇒ unit test không thấy ⇒ 8.2</span></div>
</div>

<p>Còn một lỗ hổng: <code>tsconfig.json</code> chỉ include <code>src</code>, và Vitest bóc kiểu mà không kiểm — test gõ sai kiểu vẫn chạy. Một tệp cấu hình thứ hai kiểm kiểu cho test mà không đưa test vào bản build (<code>npm run typecheck</code> giờ chạy cả hai):</p>
<pre><code class="language-json">${TSCONFIG_TEST}</code></pre>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — vi.mock trỏ sai đường.</strong> Đường dẫn trong <code>vi.mock('../../src/db/prisma.js')</code> tính từ tệp TEST, và phải khớp đúng module mà service import (kể cả đuôi <code>.js</code>). Trỏ lệch một cấp thì Vitest mock một module không ai dùng, service vẫn import Prisma thật — và test của bạn hoặc treo chờ cổng 1, hoặc tệ hơn, chạy vào CSDL thật nếu môi trường có. Môi trường test trỏ cổng 1 chính là để lỗi này lộ ra ngay.</p></div>

<h3>Liên hệ đời thường</h3>
<p>Unit test giống kiểm từng nguyên liệu trước khi nấu: trứng còn tươi, cân đặt 100 g thì chỉ 100 g. Nhanh và bắt được nhiều thứ. Nhưng nó không nói được bánh có nở trong lò NHÀ BẠN hay không — muốn biết thì phải bật lò (bài 8.2).</p>

<h3>Tình huống đi làm thật</h3>
<p>Dự án outsourcing hay được bàn giao kèm thư mục "test" đầy test mock mọi repository rồi khẳng định <code>repository.save</code> được gọi đúng một lần. Độ phủ đẹp, refactor gì cũng vỡ, mà chẳng bắt được bug nào. Khi review, hỏi mỗi test đúng một câu: "bug nào làm test này đỏ?" Nếu câu trả lời duy nhất là "đổi cách cài đặt", đó là bản sao, không phải test.</p>

<h3>⚠️ Sự cố thật: CrowdStrike, 19/07/2024</h3>
<p>Lúc 04:09 UTC, CrowdStrike phát hành một bản cập nhật nội dung cho bộ cảm biến Falcon; khoảng 8,5 triệu máy Windows bị sập (Wikipedia). Báo cáo phân tích nguyên nhân gốc của chính công ty (06/08/2024) là bài học về test xanh vì lý do sai: một loại template mới khai 21 trường đầu vào trong khi mã cảm biến chỉ cung cấp 20. Test tự động dùng "một bộ cố định 12 ca test", và dữ liệu test đặt <em>ký tự đại diện</em> (wildcard) cho trường thứ 21 ở MỌI ca — nên nhánh mã đọc giá trị thứ 21 chưa bao giờ chạy trong lúc test. Bản cập nhật thật đầu tiên có giá trị cụ thể ở trường đó gây đọc ngoài vùng nhớ. Cách họ sửa: test tự động với giá trị không-wildcard cho TỪNG trường. Cùng ý với mục 7: test chỉ bảo vệ những nhánh nó thực sự chạy qua bằng dữ liệu giống thật.</p>

${spring(false, 'Spring chia đúng các tầng này: JUnit 5 + AssertJ thuần cho logic thuần, Mockito (<code>@Mock</code>, <code>when(...).thenReturn(...)</code>, <code>verify(...)</code>) cho service với repository giả. Cái bẫy ở mục 7 y hệt — <code>JpaRepository</code> bị mock thì <code>@Query</code> không bao giờ chạy.', [
  ['sb-11-1-junit5', 'Spring Boot 11.1 — JUnit 5 và AssertJ'],
  ['sb-11-2-mockito', 'Spring Boot 11.2 — Mockito: test đơn vị cho service'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Unit test là gì, nên mock cái gì?"</strong> — Kiểm hành vi của một đơn vị, cô lập, nhanh. Thay thứ chậm, bất định hoặc bên ngoài (mạng, đồng hồ, CSDL); giữ thật logic của mình và thư viện chạy tại chỗ.</li>
<li><strong>"Mock, stub, fake khác nhau thế nào?"</strong> — Stub trả câu trả lời đóng sẵn; mock còn kiểm lời gọi; fake là bản cài đặt nhẹ chạy thật (kho trong bộ nhớ).</li>
<li><strong>"Test mã có hẹn giờ thế nào?"</strong> — Đồng hồ giả, tự đẩy thời gian, và xả/xoá hẹn giờ còn treo sau mỗi test để trạng thái không rò.</li>
<li><strong>"Test xanh hết mà bug vẫn lên production — vì sao?"</strong> — Test không đi qua nhánh đó, hoặc đã mock mất phần chứa luật (SQL, cấu hình). Mutation testing chỉ ra điều này.</li>
<li><strong>"Sao không cho test đọc tệp .env?"</strong> — Test phải tái lập được trên mọi máy, và không bao giờ được trỏ vào một CSDL thật mà nó sẽ xoá sạch.</li>
</ol>

<h3>🧪 Lab 8.1 (90 phút)</h3>
<div class="callout ok">
<ol>
<li>Cài Vitest, tạo <code>test/moi-truong.ts</code> và <code>vitest.config.ts</code>; cho test token đầu tiên chạy được mà không đọc <code>.env</code>.</li>
<li>Viết test cho <code>tokens.ts</code> (hết hạn bằng đồng hồ giả, <code>alg: none</code>, sửa <code>sub</code>, khoá lạ) và <code>cursor.ts</code> (mã hoá–giải mã, bốn cursor hỏng bằng <code>it.each</code>, các ca biên của <code>catTrang</code>).</li>
<li>Test <code>lamMoi</code> với prisma giả: hợp lệ, bị dùng lại (thu hồi cả họ), thua cuộc đua, hết hạn, thiếu.</li>
<li>Test phần phát gộp lượt thích bằng đồng hồ giả. Bỏ đoạn xả hẹn giờ trong <code>afterEach</code> để tái hiện vụ rò, rồi sửa.</li>
<li>Cài bug phân quyền xoá bình luận ở mục 7, xác nhận unit test vẫn xanh. Viết một câu giải thích vì sao.</li>
</ol>
<p><strong>Xong khi:</strong> <code>npx vitest run</code> xanh với ≥ 40 test dưới 2 giây, <code>npx tsc -p tsconfig.test.json</code> sạch, và bạn chỉ ra được một luật mà unit test của mình không bảo vệ được.</p>
<p><strong>Thang điểm (10):</strong> môi trường test tách riêng (1) · ca tấn công cho token (2) · it.each cho một luật (1) · test service khẳng định hành vi, không chép câu chữ (2) · đồng hồ giả không rò (2) · giải thích thí nghiệm cài bug (2).</p>
</div>
<details><summary>Lời giải</summary>
<p>Nhánh <code>ch8/test</code>: <code>apps/api/test/moi-truong.ts</code>, <code>apps/api/vitest.config.ts</code>, <code>apps/api/tsconfig.test.json</code>, <code>apps/api/test/unit/*.test.ts</code> (tokens, cursor, password, auth.service, comment.service, like.service, image.service, health.service). Đáp án câu 5: điều kiện quyền là một phần của câu SQL mà Prisma sinh ra; <code>deleteMany</code> giả không chạy SQL nên trả <code>count: 1</code> với mọi <code>where</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">unit test</span><span class="v">Kiểm một hàm/module cô lập; tính bằng mili giây; không mạng, không CSDL.</span></div>
  <div class="kv"><span class="k">vi.mock / vi.hoisted</span><span class="v">Thay cả một module trước khi nó được import; biến dùng trong hàm tạo mock phải được kéo lên.</span></div>
  <div class="kv"><span class="k">fake</span><span class="v">Bản cài đặt đơn giản nhưng chạy thật (S3 trong bộ nhớ).</span></div>
  <div class="kv"><span class="k">fake timers</span><span class="v">Thay setTimeout/Date để test tự đẩy thời gian.</span></div>
  <div class="kv"><span class="k">setupFiles</span><span class="v">Mã Vitest chạy trước mỗi tệp test — ở đây: môi trường test.</span></div>
  <div class="kv"><span class="k">trạng thái cấp module</span><span class="v">Biến khai ở cấp module sống qua mọi test trong cùng tệp.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Test có môi trường riêng; không bao giờ dùng <code>.env</code> dev.</li>
<li>Hàm thuần: test các ca tấn công và ca biên, không chỉ đường suôn sẻ.</li>
<li>Mock thứ bên ngoài (client CSDL, S3); cắm vào chỗ cắm của chính mình; giữ thật thư viện chạy tại chỗ (sharp).</li>
<li>Đồng hồ giả làm mã theo thời gian trở nên tất định — nhớ xả hẹn giờ còn treo, không thì trạng thái module rò.</li>
<li>Luật viết trong SQL là vô hình với test dùng CSDL giả: 43/43 xanh với một bug phân quyền.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
