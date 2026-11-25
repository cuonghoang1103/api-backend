/**
 * 8.2 — Test tích hợp với PostgreSQL thật (soạn 24/11/2026, agent fsp).
 * Output THẬT trên máy nhà: Vitest 5.1.1, postgres:18-alpine (Docker, --memory 1g --cpus 2, tmpfs), Prisma 7.10.1 + adapter-pg, pg 8.23.1.
 * Máy nhà đang chạy việc khác (load 28–46) ⇒ thời gian để so tương đối. Mã: nhánh ch8/test (chưa commit — tệp trong cây làm việc).
 * Phát hiện thật 24/11: dùng chung MỘT CSDL cho các tệp chạy song song ⇒ 3, 7, 6 test đỏ ở ba lần chạy (FK violation, đếm sai)
 * ⇒ mỗi worker một CSDL nhân bản từ template; "Timeout terminating forks worker" do pool Prisma chưa đóng + hẹn giờ 100 ms của
 * like.service chạy sau khi test xong ⇒ afterAll $disconnect + soBaiChoPhat; pg_isready qua socket báo sẵn sàng sớm
 * (initdb tạm) ⇒ hỏi qua TCP; Postgres lên mất 3,3 s khi máy rảnh, 11–30 s khi máy tải nặng; bỏ revokedAt: null ⇒ 20/20
 * request refresh song song cùng thắng; bỏ OR quyền ⇒ test "người thứ ba" đỏ.
 * Nguồn (GET 200, 24/11/2026): GitLab "Postmortem of database outage of January 31" (10/02/2017); PostgreSQL docs
 * (CREATE DATABASE … TEMPLATE, non-durable settings); Vitest docs (globalSetup, provide/inject).
 */
import { lienKet, spring, nguon } from '../_chung.mjs';

const CSDL_CHUNG = `// setupFiles của project tích hợp: chạy trong MỖI tệp test, TRƯỚC khi tệp đó import src/ ⇒ đặt DATABASE_URL kịp cho db/prisma.ts.
import { inject } from 'vitest';
process.env.DATABASE_URL = inject('dbUrl');`;

const DU_LIEU = `// Công cụ dựng dữ liệu cho test tích hợp: mỗi test tự tạo đúng thứ nó cần, không dựa vào seed hay test khác.
import { prisma } from '../../src/db/prisma.js';

// Xoá sạch mọi bảng của app (giữ _prisma_migrations). CASCADE theo khoá ngoại; một câu lệnh ⇒ nhanh hơn deleteMany từng bảng.
export const donSach = () =&gt;
  prisma.$executeRawUnsafe('TRUNCATE users, refresh_tokens, posts, comments, likes CASCADE');

let dem = 0;
// Mã băm "!" = tài khoản không đăng nhập được: test service không cần argon2 (40 ms mỗi lần).
export const taoNguoi = (ten = \`Người \${++dem}\`) =&gt;
  prisma.user.create({
    data: { email: \`n\${dem}-\${Date.now()}@test.dev\`, displayName: ten, passwordHash: '!' },
  });

export const taoBai = (authorId: string, o: { status?: 'draft' | 'published'; createdAt?: Date } = {}) =&gt;
  prisma.post.create({
    data: {
      authorId,
      title: 'Bài thử',
      body: 'Nội dung',
      status: o.status ?? 'published',
      createdAt: o.createdAt,
    },
  });`;

const BL_TEST = `import { beforeEach, describe, it, expect } from 'vitest';
import { prisma } from '../../src/db/prisma.js';
import { taoBinhLuan, xoaBinhLuan, dsBinhLuan } from '../../src/services/comment.service.js';
import { donSach, taoNguoi, taoBai } from './du-lieu.js';

beforeEach(donSach);

describe('xoaBinhLuan — quyền nằm trong câu DELETE, chỉ CSDL thật kiểm được', () =&gt; {
  it('người viết xoá được bình luận của mình', async () =&gt; {
    const [an, binh] = [await taoNguoi('An'), await taoNguoi('Bình')];
    const bai = await taoBai(an.id);
    const bl = await taoBinhLuan(bai.id, binh.id, { body: 'Hay' });
    await xoaBinhLuan(bl.id, binh.id);
    expect(await prisma.comment.count()).toBe(0);
  });

  it('tác giả BÀI xoá được bình luận rác của người khác trên bài mình', async () =&gt; {
    const [an, binh] = [await taoNguoi('An'), await taoNguoi('Bình')];
    const bai = await taoBai(an.id);
    const bl = await taoBinhLuan(bai.id, binh.id, { body: 'rác' });
    await xoaBinhLuan(bl.id, an.id);
    expect(await prisma.comment.count()).toBe(0);
  });

  it('người thứ ba ⇒ 403 và bình luận VẪN CÒN trong CSDL', async () =&gt; {
    const [an, binh, chi] = [await taoNguoi('An'), await taoNguoi('Bình'), await taoNguoi('Chi')];
    const bai = await taoBai(an.id);
    const bl = await taoBinhLuan(bai.id, binh.id, { body: 'Hay' });
    await expect(xoaBinhLuan(bl.id, chi.id)).rejects.toMatchObject({ status: 403 });
    expect(await prisma.comment.findUnique({ where: { id: bl.id } })).not.toBeNull();
  });`;

const AUTH_TEST = `describe('lamMoi trên Postgres thật', () =&gt; {
  it('HAI request cùng một refresh token chạy song song ⇒ đúng MỘT cái được cặp mới', async () =&gt; {
    const token = await phienMoi();
    const kq = await Promise.allSettled([lamMoi(token), lamMoi(token)]);
    expect(kq.map((k) =&gt; k.status).sort()).toEqual(['fulfilled', 'rejected']);
    expect(await prisma.refreshToken.count({ where: { revokedAt: null } })).toBe(1);
  });

  it('20 request song song ⇒ vẫn đúng một cái thắng', async () =&gt; {
    const token = await phienMoi();
    const kq = await Promise.allSettled(Array.from({ length: 20 }, () =&gt; lamMoi(token)));
    expect(kq.filter((k) =&gt; k.status === 'fulfilled')).toHaveLength(1);
  });`;

const PG_MOT_LAN = `// globalSetup của Vitest: chạy MỘT lần trong tiến trình chính, TRƯỚC mọi worker, và dọn SAU khi tất cả xong.
// Bật một Postgres DÙNG MỘT LẦN trong Docker (dữ liệu trên tmpfs = RAM, chết là mất — đúng thứ test cần), chạy migration
// vào CSDL "chiase", rồi đưa URL cho các worker qua provide/inject. Đặt sẵn TEST_DATABASE_URL (CI ở Chương 10) ⇒ dùng nó, không bật Docker.
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import type { TestProject } from 'vitest/node';

const chay = (cmd: string, args: string[], env?: NodeJS.ProcessEnv) =&gt;
  execFileSync(cmd, args, { encoding: 'utf8', env: env &amp;&amp; { ...process.env, ...env } }).trim();

async function choSanSang(ten: string) {
  for (let i = 0; i &lt; 100; i++) {
    try {
      // -h 127.0.0.1: hỏi qua TCP. Hỏi qua socket Unix thì "sẵn sàng" sớm hơn — lúc entrypoint còn chạy initdb tạm
      // và sắp KHỞI ĐỘNG LẠI Postgres ⇒ migration chạy đúng lúc đó gặp "Connection terminated".
      chay('docker', ['exec', ten, 'pg_isready', '-h', '127.0.0.1', '-U', 'chiase', '-d', 'chiase', '-q']);
      return;
    } catch {
      await new Promise((r) =&gt; setTimeout(r, 200));
    }
  }
  throw new Error(\`Postgres test (\${ten}) không lên sau 20 s — xem: docker logs \${ten}\`);
}

export default async function setup(project: TestProject) {
  let url = process.env.TEST_DATABASE_URL;
  let ten: string | undefined;
  if (!url) {
    ten = \`fsp-pg-test-\${randomBytes(3).toString('hex')}\`; // tên ngẫu nhiên: hai lần chạy song song không đụng nhau
    const t0 = Date.now();
    chay('docker', [
      'run',
      '-d',
      '--rm',
      '--name',
      ten,
      '--memory',
      '1g',
      '--memory-swap',
      '1g',
      '--cpus',
      '2',
      '--tmpfs',
      '/var/lib/postgresql:rw', // dữ liệu trong RAM
      '-p',
      '127.0.0.1::5432', // cổng NGẪU NHIÊN trên máy: không đụng Postgres dev ở 41812
      '-e',
      'POSTGRES_USER=chiase',
      '-e',
      'POSTGRES_PASSWORD=chiase',
      '-e',
      'POSTGRES_DB=chiase',
      'postgres:18-alpine',
      // Tắt ghi đĩa an toàn: mất điện thì mất dữ liệu — với CSDL test vứt đi sau 30 giây thì không sao.
      '-c',
      'fsync=off',
      '-c',
      'synchronous_commit=off',
      '-c',
      'full_page_writes=off',
    ]);
    const cong = chay('docker', ['port', ten, '5432/tcp']).split(':').at(-1);
    url = \`postgresql://chiase:chiase@127.0.0.1:\${cong}/chiase\`;
    await choSanSang(ten);
    console.log(\`[pg-test] \${ten} sẵn sàng ở cổng \${cong} sau \${Date.now() - t0} ms\`);
  }
  const t1 = Date.now();
  chay('npx', ['prisma', 'migrate', 'deploy'], { DATABASE_URL: url });
  console.log(\`[pg-test] migrate deploy \${Date.now() - t1} ms\`);
  project.provide('dbUrl', url);

  return () =&gt; {
    if (ten) chay('docker', ['rm', '-f', ten]); // --rm + tmpfs ⇒ không còn gì trên đĩa
  };
}

declare module 'vitest' {
  export interface ProvidedContext {
    dbUrl: string;
  }
}`;

const VITEST_CFG = `import { defineConfig } from 'vitest/config';

// HAI project, một lệnh: unit (không CSDL, mili giây) và tich-hop (Postgres thật dùng một lần).
// "npx vitest run --project unit" khi chỉ muốn vòng lặp nhanh.
export default defineConfig({
  test: {
    // Log của API (mỗi request một dòng, console.warn của service) chỉ in cho test ĐỎ — lúc đó nó là manh mối;
    // test xanh thì 98 khối log chỉ che mất kết quả (bài 8.3 đếm).
    silent: 'passed-only',
    // Độ phủ đo trên mã của mình (src/), bỏ mã sinh tự động (Prisma) và điểm khởi động (server.ts: chỉ mở cổng).
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/generated/**', 'src/server.ts', 'src/types/**'],
      // skipFull: bảng chỉ liệt kê tệp CHƯA phủ đủ — thứ cần nhìn. Báo cáo HTML đầy đủ ở coverage/index.html.
      reporter: [['text', { skipFull: true, maxCols: 120 }], 'html'],
      // NGƯỠNG = sàn chống tụt, đặt ngay dưới mức đo được hôm nay (24/11: dòng 92,25 · nhánh 79,28 · hàm 95,34).
      // Không phải mục tiêu để "đẩy cho đủ": 100% độ phủ với test không khẳng định gì vẫn là 100% (bài 8.4 đo).
      thresholds: { lines: 90, branches: 77, functions: 93, statements: 88 },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          setupFiles: ['test/moi-truong.ts'],
        },
      },
      {
        test: {
          name: 'tich-hop',
          include: ['test/tich-hop/**/*.test.ts', 'test/api/**/*.test.ts'],
          setupFiles: ['test/moi-truong.ts', 'test/tich-hop/csdl.ts'],
          globalSetup: ['test/pg-mot-lan.ts'],
        },
      },
    ],
  },
});`;

const LAN_DAU = `[pg-test] fsp-pg-test-f03df1 sẵn sàng ở cổng 32768 sau 25856 ms
[pg-test] migrate deploy 1938 ms
     × 30 bình luận CÙNG một mili giây ⇒ đi 4 trang (8/trang) lấy đủ 30, không trùng, không thiếu 38ms
     × 20 request song song ⇒ vẫn đúng một cái thắng 82ms
     × dùng lại token cũ sau khi đã xoay ⇒ cả họ bị thu hồi, kể cả token MỚI NHẤT 59ms
AssertionError: expected [] to have a length of 1 but got +0
AssertionError: expected HttpError: Phiên không hợp lệ, hãy đăng n… { …(4) } to match object { code: 'REFRESH_DUNG_LAI' }
Foreign key constraint violated on the constraint: \`comments_post_id_fkey\`
      Tests  3 failed | 52 passed (55)
   Duration  30.38s (import 37%, transform 34%, tests 25%, setup 3%, worker 1%)
[vitest-pool]: Timeout terminating forks worker for test files /home/…/chiase/apps/api/test/tich-hop/feed.test.ts.`;

const CHUNG_THEM = `[pg-test] fsp-pg-test-5b7f54 sẵn sàng ở cổng 32769 sau 29677 ms
[pg-test] migrate deploy 4990 ms
     × người thứ ba ⇒ 403 và bình luận VẪN CÒN trong CSDL 49ms
     × 30 bình luận CÙNG một mili giây ⇒ đi 4 trang (8/trang) lấy đủ 30, không trùng, không thiếu 1007ms
     × bình luận và lượt thích của bài đi theo, của bài khác ở lại 62ms
     × HAI request cùng một refresh token chạy song song ⇒ đúng MỘT cái được cặp mới 299ms
     × 20 request song song ⇒ vẫn đúng một cái thắng 1085ms
     × dùng lại token cũ sau khi đã xoay ⇒ cả họ bị thu hồi, kể cả token MỚI NHẤT 26ms
     × chỉ bài đã đăng, mới nhất trước; số bình luận/lượt thích đếm đúng theo từng bài 1245ms
      Tests  7 failed | 5 passed (12)
--- lần 2
[pg-test] fsp-pg-test-e1ebf0 sẵn sàng ở cổng 32770 sau 23782 ms
[pg-test] migrate deploy 1693 ms
     × HAI request cùng một refresh token chạy song song ⇒ đúng MỘT cái được cặp mới 211ms
     × 20 request song song ⇒ vẫn đúng một cái thắng 85ms
     × dùng lại token cũ sau khi đã xoay ⇒ cả họ bị thu hồi, kể cả token MỚI NHẤT 40ms
     × 30 bình luận CÙNG một mili giây ⇒ đi 4 trang (8/trang) lấy đủ 30, không trùng, không thiếu 58ms
     × bình luận và lượt thích của bài đi theo, của bài khác ở lại 54ms
     × chỉ bài đã đăng, mới nhất trước; số bình luận/lượt thích đếm đúng theo từng bài 218ms
      Tests  6 failed | 6 passed (12)
--- lần 3`;

const CSDL = `// setupFiles của project tích hợp: chạy ở đầu MỖI tệp test, TRƯỚC khi tệp đó import src/.
// Vitest chạy nhiều tệp SONG SONG (mỗi worker một tệp). Dùng chung một CSDL ⇒ TRUNCATE của tệp này xoá dữ liệu tệp kia
// đang dùng giữa chừng (đo thật: 3, 7, rồi 6 test đỏ ngẫu nhiên). Nên: mỗi worker MỘT CSDL riêng, nhân bản từ "chiase"
// (đã migrate ở globalSetup) bằng CREATE DATABASE … TEMPLATE — chép cả lược đồ trong vài chục mili giây, không chạy lại migration.
import { afterAll, inject } from 'vitest';
import pg from 'pg';

const goc = new URL(inject('dbUrl'));
const ten = \`chiase_w\${process.env.VITEST_POOL_ID ?? '1'}\`;

const quanTri = new pg.Client({
  connectionString: Object.assign(new URL(goc), { pathname: '/postgres' }).href,
});
await quanTri.connect();
await quanTri.query(\`DROP DATABASE IF EXISTS \${ten} WITH (FORCE)\`); // tệp trước của cùng worker để lại ⇒ làm mới
await quanTri.query(\`CREATE DATABASE \${ten} TEMPLATE chiase\`);
await quanTri.end();

process.env.DATABASE_URL = Object.assign(new URL(goc), { pathname: \`/\${ten}\` }).href;

// Đóng pool của Prisma khi tệp xong — không thì worker còn kết nối mở, Vitest phải đợi rồi giết ("Timeout terminating forks worker").
const { prisma } = await import('../../src/db/prisma.js');
afterAll(() =&gt; prisma.$disconnect());`;

const MOI_WORKER = `[pg-test] fsp-pg-test-ad6559 sẵn sàng ở cổng 32771 sau 19928 ms
[pg-test] migrate deploy 3360 ms
      Tests  12 passed (12)
   Duration  24.85s (tests 35%, import 28%, setup 27%, transform 9%, worker 1%)
[vitest-pool]: Timeout terminating forks worker for test files /home/…/chiase/apps/api/test/tich-hop/feed.test.ts.
--- lần 1
[pg-test] fsp-pg-test-a36c5f sẵn sàng ở cổng 32772 sau 19621 ms
[pg-test] migrate deploy 1558 ms
      Tests  12 passed (12)
   Duration  22.37s (tests 45%, setup 29%, import 19%, transform 6%, worker 1%)
[vitest-pool]: Timeout terminating forks worker for test files /home/…/chiase/apps/api/test/tich-hop/feed.test.ts.
--- lần 2
[pg-test] fsp-pg-test-202807 sẵn sàng ở cổng 32773 sau 11238 ms
[pg-test] migrate deploy 1790 ms
      Tests  12 passed (12)
   Duration  14.13s (tests 51%, setup 25%, import 16%, transform 6%, worker 1%)
--- lần 3`;

const FEED_CHO = `import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { prisma } from '../../src/db/prisma.js';
import { dsBaiDaDang, layBai } from '../../src/services/post.service.js';
import { thich, soBaiChoPhat } from '../../src/services/like.service.js';
import { donSach, taoNguoi, taoBai } from './du-lieu.js';

beforeEach(donSach);
// thich() hẹn 100 ms sau mới đếm + phát ⇒ đợi nó xong, đừng để nó chạy sang test sau (đếm nhầm bảng vừa TRUNCATE) hay sau khi đóng CSDL.
afterEach(() =&gt; vi.waitFor(() =&gt; expect(soBaiChoPhat()).toBe(0)));

describe('feed', () =&gt; {
  it('chỉ bài đã đăng, mới nhất trước; số bình luận/lượt thích đếm đúng theo từng bài', async () =&gt; {`;

const HET_TREO = `[pg-test] fsp-pg-test-1c7b34 sẵn sàng ở cổng 32774 sau 15317 ms
[pg-test] migrate deploy 1662 ms
      Tests  12 passed (12)
   Duration  18.54s (tests 44%, setup 26%, import 16%, transform 13%, worker 1%)
--- lần 1
[pg-test] fsp-pg-test-42dc01 sẵn sàng ở cổng 32775 sau 21876 ms
[pg-test] migrate deploy 1563 ms
      Tests  12 passed (12)
   Duration  24.55s (tests 48%, setup 29%, import 18%, transform 5%, worker 1%)
--- lần 2`;

const PHA_QUYEN = `     × người thứ ba ⇒ 403 và bình luận VẪN CÒN trong CSDL 38ms
AssertionError: promise resolved "undefined" instead of rejecting
- Expected:
+ Received:
      Tests  1 failed | 54 passed (55)`;

const PHA_DUA = `     × HAI request cùng một refresh token chạy song song ⇒ đúng MỘT cái được cặp mới 253ms
     × 20 request song song ⇒ vẫn đúng một cái thắng 104ms
AssertionError: expected [ 'fulfilled', 'fulfilled' ] to deeply equal [ 'fulfilled', 'rejected' ]
AssertionError: expected [ Array(20) ] to have a length of 1 but got 20
      Tests  2 failed | 10 passed (12)`;

const XANH = `[pg-test] fsp-pg-test-a57775 sẵn sàng ở cổng 32827 sau 1638 ms
[pg-test] migrate deploy 1701 ms
 ✓ test/tich-hop/binh-luan.test.ts &gt; xoaBinhLuan — quyền nằm trong câu DELETE, chỉ CSDL thật kiểm được &gt; người viết xoá được bình luận của mình 397ms
 ✓ test/tich-hop/binh-luan.test.ts &gt; xoaBinhLuan — quyền nằm trong câu DELETE, chỉ CSDL thật kiểm được &gt; tác giả BÀI xoá được bình luận rác của người khác trên bài mình 51ms
 ✓ test/tich-hop/binh-luan.test.ts &gt; xoaBinhLuan — quyền nằm trong câu DELETE, chỉ CSDL thật kiểm được &gt; người thứ ba ⇒ 403 và bình luận VẪN CÒN trong CSDL 55ms
 ✓ test/tich-hop/binh-luan.test.ts &gt; dsBinhLuan — cursor qua nhiều trang &gt; 30 bình luận CÙNG một mili giây ⇒ đi 4 trang (8/trang) lấy đủ 30, không trùng, không thiếu 180ms
 ✓ test/tich-hop/binh-luan.test.ts &gt; xoá bài ⇒ CASCADE &gt; bình luận và lượt thích của bài đi theo, của bài khác ở lại 72ms
 ✓ test/tich-hop/auth.test.ts &gt; lamMoi trên Postgres thật &gt; HAI request cùng một refresh token chạy song song ⇒ đúng MỘT cái được cặp mới 331ms
 ✓ test/tich-hop/auth.test.ts &gt; lamMoi trên Postgres thật &gt; 20 request song song ⇒ vẫn đúng một cái thắng 144ms
 ✓ test/tich-hop/auth.test.ts &gt; lamMoi trên Postgres thật &gt; dùng lại token cũ sau khi đã xoay ⇒ cả họ bị thu hồi, kể cả token MỚI NHẤT 65ms
 ✓ test/tich-hop/feed.test.ts &gt; feed &gt; chỉ bài đã đăng, mới nhất trước; số bình luận/lượt thích đếm đúng theo từng bài 426ms
 ✓ test/tich-hop/feed.test.ts &gt; feed &gt; bài mới chen vào giữa lúc đang cuộn ⇒ trang sau KHÔNG lặp bài đã thấy (lý do bỏ OFFSET) 52ms
 ✓ test/tich-hop/feed.test.ts &gt; feed &gt; bài nháp: tác giả thấy, người khác 404 như không tồn tại 61ms
 ✓ test/tich-hop/feed.test.ts &gt; feed &gt; một người bấm thích 2 lần song song ⇒ 1 dòng (khoá chính kép + ON CONFLICT DO NOTHING) 170ms
      Tests  51 passed (51)
   Duration  6.77s (tests 40%, import 37%, setup 16%, transform 6%)`;

const TMPFS = `nhanh (--tmpfs -c fsync=off -c synchronous_commit=off -c full_page_writes=off) lần 1:  Tests 51 passed (51)  Duration 6.13s (tests 41%, import 35%, setup 18%, transform 5%, worker 1%) 
nhanh (--tmpfs -c fsync=off -c synchronous_commit=off -c full_page_writes=off) lần 2:  Tests 51 passed (51)  Duration 6.80s (import 39%, tests 38%, setup 17%, transform 5%) 
nhanh (--tmpfs -c fsync=off -c synchronous_commit=off -c full_page_writes=off) lần 3:  Tests 51 passed (51)  Duration 7.46s (import 39%, tests 36%, setup 21%, transform 4%) 
thuong (-v mặc định) lần 1:  Tests 51 passed (51)  Duration 6.24s (tests 43%, import 35%, setup 15%, transform 7%) 
thuong (-v mặc định) lần 2:  Tests 51 passed (51)  Duration 8.73s (import 37%, tests 28%, setup 28%, transform 7%) 
thuong (-v mặc định) lần 3:  Tests 51 passed (51)  Duration 6.35s (tests 35%, import 32%, setup 28%, transform 5%) `;


const MERMAID = `flowchart LR
  G["globalSetup (1 lần)<br/>docker run postgres:18 + tmpfs<br/>migrate deploy ⇒ CSDL chiase"]
  G -->|"provide(dbUrl)"| W1["worker 1<br/>CREATE DATABASE chiase_w1<br/>TEMPLATE chiase"]
  G -->|"provide(dbUrl)"| W2["worker 2<br/>chiase_w2"]
  G -->|"provide(dbUrl)"| W3["worker 3<br/>chiase_w3"]
  W1 --> T1["beforeEach: TRUNCATE<br/>test tự tạo dữ liệu"]
  G -.->|"teardown: docker rm -f"| X["không còn gì"]`;

const MERMAID_EN = `flowchart LR
  G["globalSetup (once)<br/>docker run postgres:18 + tmpfs<br/>migrate deploy ⇒ db chiase"]
  G -->|"provide(dbUrl)"| W1["worker 1<br/>CREATE DATABASE chiase_w1<br/>TEMPLATE chiase"]
  G -->|"provide(dbUrl)"| W2["worker 2<br/>chiase_w2"]
  G -->|"provide(dbUrl)"| W3["worker 3<br/>chiase_w3"]
  W1 --> T1["beforeEach: TRUNCATE<br/>each test builds its data"]
  G -.->|"teardown: docker rm -f"| X["nothing left"]`;

const THE = [
  lienKet({ khoa: 'testing', bai: 'tst-4-1-vi-sao', title: 'Testing 4.1 — Vì sao CSDL thật hơn CSDL giả', sub: 'Những lỗi chỉ CSDL thật mới lộ: ràng buộc, kiểu, thứ tự, đồng thời.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-4-2-docker-db', title: 'Testing 4.2 — Postgres dùng một lần: Docker Compose, tmpfs', sub: 'Cùng ý với pg-mot-lan.ts, bằng Compose.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-4-3-testcontainers', title: 'Testing 4.3 — Testcontainers cho Node', sub: 'Thư viện làm hộ phần docker run / chờ sẵn sàng / dọn.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'testing', bai: 'tst-4-4-co-lap', title: 'Testing 4.4 — Cô lập: transaction, xoá bảng và dữ liệu mẫu', sub: 'So TRUNCATE với rollback từng test.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'nodejs', bai: 'nodejs-14-4-db-that', title: 'Node.js 14.4 — Kiểm thử trên cơ sở dữ liệu thật', sub: 'Góc nhìn Node thuần cho cùng chủ đề.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('🦊', 'GitLab — Postmortem of database outage of January 31 (10/02/2017)', 'about.gitlab.com', 'https://about.gitlab.com/blog/postmortem-of-database-outage-of-january-31/'),
  nguon('🐘', 'PostgreSQL — Template databases (CREATE DATABASE … TEMPLATE)', 'postgresql.org/docs', 'https://www.postgresql.org/docs/current/manage-ag-templatedbs.html'),
  nguon('🐘', 'PostgreSQL — Non-durable settings (fsync, synchronous_commit, full_page_writes)', 'postgresql.org/docs', 'https://www.postgresql.org/docs/current/non-durability.html'),
  nguon('🧪', 'Vitest — globalSetup và provide/inject', 'vitest.dev', 'https://vitest.dev/config/globalsetup'),
].join('\n');

export default {
  title: '8.2 — Integration tests against a real Postgres|||8.2 — Test tích hợp với PostgreSQL thật',
  slug: 'fp-8-2-integration-db',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Postgres 18 dùng một lần cho mỗi lần chạy test: globalSetup bật container (tmpfs, fsync=off, cổng ngẫu nhiên), chạy migration, đưa URL cho worker. Đo thật: dùng chung một CSDL cho các tệp chạy song song ⇒ 3, 7, 6 test đỏ ngẫu nhiên — sửa bằng mỗi worker một CSDL nhân từ template. Hai lỗi unit test không thấy ở bài 8.1 giờ đỏ ngay: phân quyền xoá trong câu DELETE, và cuộc đua refresh (bỏ một điều kiện ⇒ 20/20 request song song cùng thắng). Kèm worker treo vì hẹn giờ chạy sau khi test xong.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Testing the stack</span>
<h2>The only thing that runs SQL is a database</h2>
<p class="lead">Lesson 8.1 ended with two bugs unit tests could not judge: a permission rule inside a DELETE, and a race that only real concurrent transactions can lose. Both live in SQL. This lesson gives every test run its own throw-away PostgreSQL 18 — same major version as development and production — so these tests run real queries against real constraints, in seconds, and leave nothing behind.</p>

<pre><code class="language-mermaid">${MERMAID_EN}</code></pre>

<h3>1. A Postgres per test run, started by the test runner</h3>
<p>Vitest's <code>globalSetup</code> runs once in the main process before any worker starts, and its returned function runs after all of them finish. That is exactly the lifetime of a test database:</p>
<pre><code class="language-ts">${PG_MOT_LAN}</code></pre>
<p>Choices worth defending in a review:</p>
<ul>
<li><strong>tmpfs + fsync=off.</strong> Data lives in RAM and Postgres stops forcing writes to disk. Unsafe for anything you want to keep, harmless for a database that lives 20 seconds. Section 5 measures what it buys — at our size, honestly, almost nothing; the real win is that nothing is written to your disk and nothing needs cleaning.</li>
<li><strong>Random host port, random name.</strong> Never collides with your dev Postgres on 41812, and two test runs (you and CI, or two terminals) never share a database.</li>
<li><strong>Ask readiness over TCP.</strong> The first version asked <code>pg_isready</code> over the Unix socket and occasionally ran migrations during the image's temporary initdb server, which then restarts. TCP readiness only comes from the real server.</li>
<li><strong><code>migrate deploy</code>, not <code>migrate dev</code>.</strong> Tests apply exactly the committed migrations, like production — a migration that only works on your laptop fails here.</li>
<li><strong>Same image as dev: <code>postgres:18-alpine</code>.</strong> See the GitLab incident below for what a version mismatch can cost.</li>
<li><strong><code>TEST_DATABASE_URL</code> escape hatch.</strong> CI in Chapter 10 provides Postgres as a service container; the same tests run unchanged.</li>
</ul>
<pre><code class="language-ts">${VITEST_CFG}</code></pre>

<h3>2. Each test builds its own world</h3>
<p>No shared seed, no "run test A before test B". A <code>beforeEach</code> empties every table with one <code>TRUNCATE … CASCADE</code>, and small helpers create exactly the rows a test needs:</p>
<pre><code class="language-ts">${DU_LIEU}</code></pre>
<p>Now the permission rule from 8.1, against a real <code>DELETE … WHERE</code>:</p>
<pre><code class="language-ts">${BL_TEST}</code></pre>
<p>The third test checks two things: the error <em>and</em> that the row is still in the table. "Threw 403" alone would pass for code that deletes first and complains afterwards.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — tests that rely on another test's data.</strong> "Test 2 uses the post test 1 created" works… until someone runs test 2 alone, reorders them, or Vitest puts the files on different workers. Every test creates its own users, posts and comments — three <code>await taoNguoi()</code> lines are far cheaper than an afternoon chasing a flaky failure.</p></div>

<h3>3. Parallel files, one database: random red</h3>
<p>The first version handed every worker the same database URL:</p>
<pre><code class="language-ts">${CSDL_CHUNG}</code></pre>
<p>Vitest runs test files in parallel, one per worker. Three runs, three different results:</p>
<div class="out">${LAN_DAU}</div>
<div class="out">${CHUNG_THEM}</div>
<p>A foreign-key violation on a post the test had just created, a count of 2 where 1 was expected: another file's <code>TRUNCATE</code> ran in the middle. The tests are fine; the isolation is not. Two fixes exist — run files one at a time (<code>fileParallelism: false</code>, slower forever) or give each worker its own database. Postgres can clone a database from a <em>template</em>, schema and all, without replaying migrations:</p>
<pre><code class="language-ts">${CSDL}</code></pre>
<div class="out">${MOI_WORKER}</div>
<p>Green three times. The remaining warning — Vitest waiting for a worker that would not exit — had a cause of its own:</p>
<pre><code class="language-ts">${FEED_CHO}</code></pre>
<p><code>thich()</code> schedules a count-and-emit 100 ms later (7.2). The test finishes, the pool is closed, the timer fires, Prisma opens a new connection, and the worker cannot exit. A service that schedules background work needs a way to wait for it — here a counter of pending posts that the test waits on:</p>
<div class="out">${HET_TREO}</div>

<h3>4. The two bugs from 8.1, caught</h3>
<p>Planting the comment-permission bug again:</p>
<div class="out">${PHA_QUYEN}</div>
<p>And the refresh race, tested as behaviour — not "updateMany was called with these arguments" but "send the same token twenty times at once":</p>
<pre><code class="language-ts">${AUTH_TEST}</code></pre>
<p>With <code>revokedAt: null</code> removed from the conditional update:</p>
<div class="out">${PHA_DUA}</div>
<p>Twenty out of twenty requests won: twenty valid refresh tokens from one stolen cookie. Each request read the row before any of them marked it, and every unconditional update "succeeded". With the condition, Postgres row locking lets exactly one update see <code>revoked_at IS NULL</code>. This is the kind of guarantee that only exists in the database — and the only kind of test that can see it.</p>

<h3>5. How fast is "real"?</h3>
<div class="out">${XANH}</div>
<div class="out">${TMPFS}</div>
<p>The second box runs the same 51 tests against an already-running Postgres, three times each: tmpfs + fsync off 6.1–7.5 s, a normal volume with default durability 6.2–8.7 s. No difference you could defend — 51 tests write a few hundred rows, and an NVMe disk absorbs that. Keep the settings (they cost nothing), but don't expect them to rescue a slow suite; fewer and smaller database round-trips do. Starting Postgres dominates; the tests themselves take a few seconds. On a quiet machine the container is ready in about 3 s; while this machine was busy with video rendering it took 11–30 s — the same tests, the same code. Budget for the slow day, keep the per-test work small (TRUNCATE, create a few rows), and keep the many fast checks in unit tests.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">dùng một lần</span><span class="lz-d">globalSetup: docker run + tmpfs + migrate deploy; teardown xoá</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cùng bản</span><span class="lz-d">postgres:18 như dev/production</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">mỗi worker</span><span class="lz-d">CREATE DATABASE … TEMPLATE chiase</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">mỗi test</span><span class="lz-d">TRUNCATE rồi tự tạo dữ liệu cần</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">hành vi</span><span class="lz-d">khẳng định trạng thái trong bảng, chạy song song thật</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">dọn</span><span class="lz-d">đóng pool, chờ việc nền, không để worker treo</span></div>
</div>

<h3>Everyday analogy</h3>
<p>A driving test on a simulator checks you know the rules. The road test, in a real car on a real street, is the only one that finds out you stall on hills. Unit tests are the simulator; this lesson is the road — a short, closed road you can reset after each candidate.</p>

<h3>On the job</h3>
<p>Many teams test against SQLite or an in-memory H2 "because it's faster". Then production Postgres disagrees about case-insensitive LIKE, timestamp precision, <code>ON CONFLICT</code>, or locking. When you join a project, check which database the integration tests use. If it isn't the production engine and version, raise it early — with Docker the cost is a few seconds per run.</p>

<h3>⚠️ Real incident: GitLab.com, 31 January 2017</h3>
<p>While fighting a replication problem, an engineer deleted the primary database's data directory. GitLab's postmortem (10/02/2017) describes the backups they then found: the daily <code>pg_dump</code> to S3 had produced nothing — "the S3 bucket was empty" — because the backup job used <code>pg_dump</code> 9.2 against a PostgreSQL 9.6 server, and the version mismatch made pg_dump error out. Disk snapshots were not enabled for the database servers. They restored from an LVM snapshot taken 6 hours earlier, losing data for roughly 5,000 projects, 5,000 comments and 700 new user accounts. A backup that is never restored is a test that is never run; a tool tested against a different database version is tested against nothing.</p>

${spring(true, 'Spring\'s equivalent is Testcontainers with <code>@ServiceConnection</code>: a <code>PostgreSQLContainer</code> starts once per test class (or is reused), Flyway migrates it, and <code>@DataJpaTest</code>/<code>@SpringBootTest</code> run against it. The isolation choice is the same one we made — Spring defaults to rolling back each <code>@Transactional</code> test, which hides bugs in code that commits on purpose.', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Integration tests with Testcontainers'],
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Chapter 11 lab + interview questions'],
])}

<h3>🎤 What the interviewer will ask</h3>
<ol>
<li><strong>"Unit vs integration test?"</strong> — Integration exercises real collaborators (database, file system); slower, catches mismatches between your code and the real thing.</li>
<li><strong>"Why not H2/SQLite for tests?"</strong> — Different SQL dialect, types, precision and locking; tests pass on one engine and production fails on another.</li>
<li><strong>"How do you isolate tests that share a database?"</strong> — Per-test cleanup (TRUNCATE or rollback), and per-worker databases (templates) or schemas when files run in parallel.</li>
<li><strong>"How do you test a race condition?"</strong> — Fire concurrent requests against the real database and assert the invariant (exactly one winner); repeat it.</li>
<li><strong>"Your integration tests are slow — what do you do?"</strong> — Start the database once per run, clone from a template, keep fixtures small, move pure logic down to unit tests; measure before trusting tmpfs/fsync tricks.</li>
</ol>

<h3>🧪 Lab 8.2 (2 hours)</h3>
<div class="callout ok">
<ol>
<li>Write <code>test/pg-mot-lan.ts</code> (globalSetup): container with memory/CPU limits, tmpfs, random port, readiness over TCP, <code>migrate deploy</code>, teardown.</li>
<li>Write integration tests for comment deletion (author, post author, stranger + row still exists), 30 comments in the same millisecond across 4 pages, CASCADE on post deletion.</li>
<li>Write the refresh race test (2 and 20 concurrent). Remove <code>revokedAt: null</code> and record how many requests win.</li>
<li>Run the suite three times with a shared database and note which tests fail; then add per-worker template databases and run three more times.</li>
<li>Find and remove the "Timeout terminating forks worker" warning.</li>
</ol>
<p><strong>Done when:</strong> <code>npx vitest run --project tich-hop</code> is green three times in a row with no warning, no <code>fsp-pg-test-*</code> container remains, and both planted bugs from 8.1 turn it red.</p>
<p><strong>Rubric (10):</strong> disposable DB with limits and cleanup (2) · same Postgres version as production (1) · tests assert table state, not just errors (2) · real concurrent race test (2) · per-worker isolation with evidence (2) · no hanging worker (1).</p>
</div>
<details><summary>Solution</summary>
<p>Branch <code>ch8/test</code>: <code>apps/api/test/pg-mot-lan.ts</code>, <code>apps/api/test/tich-hop/csdl.ts</code>, <code>du-lieu.ts</code>, <code>binh-luan.test.ts</code>, <code>auth.test.ts</code>, <code>feed.test.ts</code>; <code>soBaiChoPhat</code> in <code>src/services/like.service.ts</code>.</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">integration test</span><span class="v">Runs your code with real collaborators (here: PostgreSQL).</span></div>
  <div class="kv"><span class="k">globalSetup</span><span class="v">Runs once before all workers; its returned function runs after all.</span></div>
  <div class="kv"><span class="k">provide / inject</span><span class="v">Pass values (the database URL) from globalSetup to test files.</span></div>
  <div class="kv"><span class="k">template database</span><span class="v">CREATE DATABASE x TEMPLATE y copies y's schema and data in one step.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A RAM-backed file system; gone when the container stops.</span></div>
  <div class="kv"><span class="k">flaky test</span><span class="v">Passes or fails without any code change — usually shared state or timing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>One disposable Postgres 18 per run: tmpfs, fsync off, random port, migrate deploy, removed afterwards.</li>
<li>Each test empties the tables and builds its own data; assert what is in the table, not only what was thrown.</li>
<li>Parallel files + one database ⇒ random failures; one template-cloned database per worker fixes it.</li>
<li>The permission rule and the refresh race — invisible to unit tests — fail loudly here (20/20 winners without the condition).</li>
<li>Close pools and wait for background work, or workers hang.</li>
</ul>
${THE}
${NGUON}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Test cả hệ thống</span>
<h2>Thứ duy nhất chạy được SQL là một CSDL</h2>
<p class="lead">Bài 8.1 kết thúc với hai bug unit test không phán xử được: một luật phân quyền nằm trong câu DELETE, và một cuộc đua mà chỉ transaction thật chạy đồng thời mới thua được. Cả hai nằm trong SQL. Bài này cho mỗi lần chạy test một PostgreSQL 18 dùng một lần — cùng phiên bản chính với dev và production — để các test chạy truy vấn thật trên ràng buộc thật, trong vài giây, và không để lại gì.</p>

<pre><code class="language-mermaid">${MERMAID}</code></pre>

<h3>1. Mỗi lần chạy test một Postgres, do chính trình chạy test bật</h3>
<p><code>globalSetup</code> của Vitest chạy MỘT lần trong tiến trình chính trước khi worker nào bắt đầu, và hàm nó trả về chạy sau khi tất cả xong. Đó đúng là vòng đời của một CSDL test:</p>
<pre><code class="language-ts">${PG_MOT_LAN}</code></pre>
<p>Những lựa chọn đáng bảo vệ khi bị review:</p>
<ul>
<li><strong>tmpfs + fsync=off.</strong> Dữ liệu nằm trong RAM và Postgres thôi ép ghi xuống đĩa. Không an toàn cho thứ gì cần giữ, vô hại với CSDL chỉ sống 20 giây. Mục 5 đo xem nó mua được gì — ở cỡ bộ test này, thật lòng mà nói, gần như không gì; cái lợi thật là không ghi gì xuống đĩa của bạn và không có gì phải dọn.</li>
<li><strong>Cổng ngẫu nhiên, tên ngẫu nhiên.</strong> Không bao giờ đụng Postgres dev ở 41812, và hai lần chạy test (bạn và CI, hay hai terminal) không bao giờ dùng chung CSDL.</li>
<li><strong>Hỏi "sẵn sàng" qua TCP.</strong> Bản đầu hỏi <code>pg_isready</code> qua socket Unix, thỉnh thoảng chạy migration đúng lúc máy chủ initdb TẠM của image đang chạy — máy chủ đó sau đó khởi động lại. Câu trả lời qua TCP chỉ đến từ máy chủ thật.</li>
<li><strong><code>migrate deploy</code>, không phải <code>migrate dev</code>.</strong> Test áp đúng các migration đã commit, như production — migration chỉ chạy được trên máy bạn sẽ hỏng ở đây.</li>
<li><strong>Cùng image với dev: <code>postgres:18-alpine</code>.</strong> Xem sự cố GitLab bên dưới để biết lệch phiên bản có thể tốn cỡ nào.</li>
<li><strong>Lối thoát <code>TEST_DATABASE_URL</code>.</strong> CI ở Chương 10 cấp Postgres bằng service container; cùng bộ test chạy không sửa gì.</li>
</ul>
<pre><code class="language-ts">${VITEST_CFG}</code></pre>

<h3>2. Mỗi test tự dựng thế giới của nó</h3>
<p>Không seed dùng chung, không "chạy test A trước test B". <code>beforeEach</code> xoá sạch mọi bảng bằng MỘT câu <code>TRUNCATE … CASCADE</code>, và vài hàm nhỏ tạo đúng những dòng test cần:</p>
<pre><code class="language-ts">${DU_LIEU}</code></pre>
<p>Giờ luật phân quyền ở 8.1, chạy trên câu <code>DELETE … WHERE</code> thật:</p>
<pre><code class="language-ts">${BL_TEST}</code></pre>
<p>Test thứ ba kiểm HAI thứ: lỗi trả về <em>và</em> dòng đó vẫn còn trong bảng. Chỉ "ném 403" thì mã xoá trước rồi mới kêu cũng qua được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — test dựa vào dữ liệu của test khác.</strong> "Test 2 dùng bài mà test 1 tạo" chạy được… cho tới ngày ai đó chạy riêng test 2, đổi thứ tự, hay Vitest chia tệp sang worker khác. Mỗi test tự tạo người dùng, bài, bình luận của nó — ba dòng <code>await taoNguoi()</code> rẻ hơn nhiều so với một buổi chiều truy lỗi chập chờn.</p></div>

<h3>3. Nhiều tệp song song, một CSDL: đỏ ngẫu nhiên</h3>
<p>Bản đầu đưa cùng một URL CSDL cho mọi worker:</p>
<pre><code class="language-ts">${CSDL_CHUNG}</code></pre>
<p>Vitest chạy các tệp test song song, mỗi worker một tệp. Ba lần chạy, ba kết quả khác nhau:</p>
<div class="out">${LAN_DAU}</div>
<div class="out">${CHUNG_THEM}</div>
<p>Vi phạm khoá ngoại với một bài test vừa tạo xong, đếm ra 2 trong khi mong 1: <code>TRUNCATE</code> của tệp khác chạy chen vào giữa. Test không sai; sự cô lập mới sai. Có hai cách sửa — chạy từng tệp một (<code>fileParallelism: false</code>, chậm mãi mãi) hoặc cho mỗi worker một CSDL riêng. Postgres nhân bản được một CSDL từ <em>template</em>, đủ cả lược đồ, không cần chạy lại migration:</p>
<pre><code class="language-ts">${CSDL}</code></pre>
<div class="out">${MOI_WORKER}</div>
<p>Xanh ba lần. Cảnh báo còn lại — Vitest phải chờ một worker không chịu thoát — có nguyên nhân riêng:</p>
<pre><code class="language-ts">${FEED_CHO}</code></pre>
<p><code>thich()</code> hẹn đếm-và-phát sau 100 ms (bài 7.2). Test xong, pool đã đóng, hẹn giờ chạy, Prisma mở kết nối mới, và worker không thoát được. Service nào hẹn việc chạy nền thì cần một cách để chờ nó — ở đây là bộ đếm số bài đang chờ phát mà test đợi về 0:</p>
<div class="out">${HET_TREO}</div>

<h3>4. Hai bug của 8.1, bị bắt</h3>
<p>Cài lại bug phân quyền xoá bình luận:</p>
<div class="out">${PHA_QUYEN}</div>
<p>Và cuộc đua refresh, giờ test như HÀNH VI — không phải "updateMany được gọi với các tham số này" mà là "gửi cùng một token hai mươi lần cùng lúc":</p>
<pre><code class="language-ts">${AUTH_TEST}</code></pre>
<p>Bỏ <code>revokedAt: null</code> khỏi câu cập nhật có điều kiện:</p>
<div class="out">${PHA_DUA}</div>
<p>Hai mươi trên hai mươi request cùng thắng: hai mươi refresh token hợp lệ từ MỘT cookie bị đánh cắp. Request nào cũng đọc dòng đó trước khi bất kỳ request nào kịp đánh dấu, và mọi câu cập nhật không điều kiện đều "thành công". Có điều kiện thì khoá dòng của Postgres chỉ cho đúng một câu cập nhật thấy <code>revoked_at IS NULL</code>. Đây là loại bảo đảm chỉ tồn tại trong CSDL — và chỉ loại test này nhìn thấy được.</p>

<h3>5. "Thật" thì nhanh cỡ nào?</h3>
<div class="out">${XANH}</div>
<div class="out">${TMPFS}</div>
<p>Hộp thứ hai chạy cùng 51 test trên một Postgres đã bật sẵn, mỗi kiểu ba lần: tmpfs + tắt fsync 6,1–7,5 s, volume thường với độ bền mặc định 6,2–8,7 s. Không khác biệt nào đáng kể — 51 test ghi vài trăm dòng, ổ NVMe nuốt gọn. Cứ giữ các tuỳ chọn đó (không tốn gì), nhưng đừng trông chúng cứu một bộ test chậm; thứ cứu được là bớt và thu nhỏ các lượt hỏi CSDL. Phần lớn thời gian là bật Postgres; bản thân các test chỉ mất vài giây. Máy rảnh thì container sẵn sàng sau khoảng 3 s; lúc máy này đang bận render video thì mất 11–30 s — cùng test, cùng mã. Hãy tính theo ngày chậm, giữ việc mỗi test nhỏ (TRUNCATE, tạo vài dòng), và để phần lớn phép kiểm nhanh ở unit test.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">dùng một lần</span><span class="lz-d">globalSetup: docker run + tmpfs + migrate deploy; teardown xoá</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cùng bản</span><span class="lz-d">postgres:18 như dev/production</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">mỗi worker</span><span class="lz-d">CREATE DATABASE … TEMPLATE chiase</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">mỗi test</span><span class="lz-d">TRUNCATE rồi tự tạo dữ liệu cần</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">hành vi</span><span class="lz-d">khẳng định trạng thái trong bảng, chạy song song thật</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">dọn</span><span class="lz-d">đóng pool, chờ việc nền, không để worker treo</span></div>
</div>

<h3>Liên hệ đời thường</h3>
<p>Thi lái trên máy mô phỏng kiểm bạn thuộc luật. Thi sa hình bằng xe thật trên đường thật mới phát hiện bạn chết máy khi lên dốc. Unit test là máy mô phỏng; bài này là sa hình — một đoạn đường ngắn, khép kín, dọn lại được sau mỗi thí sinh.</p>

<h3>Tình huống đi làm thật</h3>
<p>Nhiều team test bằng SQLite hay H2 trong bộ nhớ "cho nhanh". Rồi Postgres production bất đồng về LIKE không phân biệt hoa thường, độ chính xác timestamp, <code>ON CONFLICT</code>, hay cách khoá. Khi vào dự án mới, xem test tích hợp dùng CSDL gì. Nếu không phải đúng loại và đúng phiên bản production, nêu ra sớm — có Docker thì cái giá chỉ là vài giây mỗi lần chạy.</p>

<h3>⚠️ Sự cố thật: GitLab.com, 31/01/2017</h3>
<p>Trong lúc xử lý sự cố sao chép (replication), một kỹ sư xoá nhầm thư mục dữ liệu của CSDL chính. Bản postmortem của GitLab (10/02/2017) kể lại những gì họ thấy khi đi tìm bản sao lưu: tác vụ <code>pg_dump</code> hằng ngày lên S3 không tạo ra gì — "bucket S3 trống" — vì tác vụ sao lưu dùng <code>pg_dump</code> 9.2 với máy chủ PostgreSQL 9.6, và lệch phiên bản chính làm pg_dump báo lỗi rồi dừng. Ảnh chụp đĩa chưa được bật cho máy chủ CSDL. Họ khôi phục từ một ảnh chụp LVM cách đó 6 giờ, mất dữ liệu của khoảng 5.000 dự án, 5.000 bình luận và 700 tài khoản mới. Bản sao lưu chưa bao giờ được khôi phục thử là một test chưa bao giờ chạy; công cụ được thử với một phiên bản CSDL khác là chưa được thử gì cả.</p>

${spring(false, 'Bên Spring, tương đương là Testcontainers với <code>@ServiceConnection</code>: một <code>PostgreSQLContainer</code> bật một lần mỗi lớp test (hoặc dùng lại), Flyway migrate, rồi <code>@DataJpaTest</code>/<code>@SpringBootTest</code> chạy trên nó. Lựa chọn cô lập cũng là lựa chọn ta vừa làm — Spring mặc định rollback mỗi test <code>@Transactional</code>, cách này che mất bug ở mã cố ý commit.', [
  ['sb-11-4-testcontainers', 'Spring Boot 11.4 — Test tích hợp với Testcontainers'],
  ['sb-11-6-lab-11', 'Spring Boot 11.6 — Lab chương 11 + câu hỏi phỏng vấn'],
])}

<h3>🎤 Phỏng vấn viên sẽ hỏi</h3>
<ol>
<li><strong>"Unit test khác integration test thế nào?"</strong> — Integration chạy với thành phần thật (CSDL, hệ thống tệp); chậm hơn, bắt được chỗ lệch giữa mã của bạn và thứ thật.</li>
<li><strong>"Sao không dùng H2/SQLite cho test?"</strong> — Khác phương ngữ SQL, kiểu dữ liệu, độ chính xác và cách khoá; test xanh trên engine này, production hỏng trên engine kia.</li>
<li><strong>"Cô lập test dùng chung CSDL thế nào?"</strong> — Dọn theo từng test (TRUNCATE hoặc rollback), và mỗi worker một CSDL (template) hoặc schema khi các tệp chạy song song.</li>
<li><strong>"Test một race condition thế nào?"</strong> — Bắn request đồng thời vào CSDL thật và khẳng định bất biến (đúng một bên thắng); chạy lặp lại.</li>
<li><strong>"Test tích hợp chậm — bạn làm gì?"</strong> — Bật CSDL một lần mỗi lượt chạy, nhân bản từ template, dữ liệu mỗi test nhỏ, đẩy logic thuần xuống unit test; đo trước khi tin mẹo tmpfs/tắt fsync.</li>
</ol>

<h3>🧪 Lab 8.2 (2 giờ)</h3>
<div class="callout ok">
<ol>
<li>Viết <code>test/pg-mot-lan.ts</code> (globalSetup): container có giới hạn RAM/CPU, tmpfs, cổng ngẫu nhiên, chờ sẵn sàng qua TCP, <code>migrate deploy</code>, dọn khi xong.</li>
<li>Viết test tích hợp cho xoá bình luận (người viết, tác giả bài, người lạ + dòng vẫn còn), 30 bình luận cùng một mili giây qua 4 trang, CASCADE khi xoá bài.</li>
<li>Viết test cuộc đua refresh (2 và 20 request đồng thời). Bỏ <code>revokedAt: null</code> và ghi lại bao nhiêu request thắng.</li>
<li>Chạy ba lần với CSDL dùng chung, ghi lại test nào đỏ; rồi thêm CSDL template cho từng worker và chạy thêm ba lần.</li>
<li>Tìm và dập cảnh báo "Timeout terminating forks worker".</li>
</ol>
<p><strong>Xong khi:</strong> <code>npx vitest run --project tich-hop</code> xanh ba lần liền không cảnh báo, không còn container <code>fsp-pg-test-*</code> nào, và cả hai bug cài thử ở 8.1 làm nó đỏ.</p>
<p><strong>Thang điểm (10):</strong> CSDL dùng một lần có giới hạn và tự dọn (2) · cùng phiên bản Postgres với production (1) · test khẳng định trạng thái bảng, không chỉ lỗi (2) · test đua đồng thời thật (2) · cô lập theo worker có bằng chứng (2) · không worker treo (1).</p>
</div>
<details><summary>Lời giải</summary>
<p>Nhánh <code>ch8/test</code>: <code>apps/api/test/pg-mot-lan.ts</code>, <code>apps/api/test/tich-hop/csdl.ts</code>, <code>du-lieu.ts</code>, <code>binh-luan.test.ts</code>, <code>auth.test.ts</code>, <code>feed.test.ts</code>; hàm <code>soBaiChoPhat</code> trong <code>src/services/like.service.ts</code>.</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">integration test</span><span class="v">Chạy mã của bạn cùng thành phần thật (ở đây: PostgreSQL).</span></div>
  <div class="kv"><span class="k">globalSetup</span><span class="v">Chạy một lần trước mọi worker; hàm nó trả về chạy sau cùng.</span></div>
  <div class="kv"><span class="k">provide / inject</span><span class="v">Đưa giá trị (URL CSDL) từ globalSetup tới các tệp test.</span></div>
  <div class="kv"><span class="k">CSDL template</span><span class="v">CREATE DATABASE x TEMPLATE y chép lược đồ + dữ liệu của y trong một bước.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">Hệ thống tệp nằm trong RAM; mất khi container dừng.</span></div>
  <div class="kv"><span class="k">test chập chờn (flaky)</span><span class="v">Lúc xanh lúc đỏ dù mã không đổi — thường do trạng thái dùng chung hoặc thời điểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mỗi lần chạy một Postgres 18 dùng một lần: tmpfs, tắt fsync, cổng ngẫu nhiên, migrate deploy, xoá khi xong.</li>
<li>Mỗi test xoá bảng và tự dựng dữ liệu; khẳng định thứ nằm trong bảng, không chỉ thứ bị ném ra.</li>
<li>Tệp song song + một CSDL ⇒ đỏ ngẫu nhiên; mỗi worker một CSDL nhân từ template là hết.</li>
<li>Luật phân quyền và cuộc đua refresh — vô hình với unit test — đỏ ngay ở đây (bỏ điều kiện: 20/20 cùng thắng).</li>
<li>Đóng pool và chờ việc nền, không thì worker treo.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
