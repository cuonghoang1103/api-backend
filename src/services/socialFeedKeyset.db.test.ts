/**
 * Phân trang feed theo keyset (createdAt, id) — vá 01/11/2026. Cần Postgres thật đã có schema:
 *   WORK_DB_TEST=1 npx tsx --test src/services/socialFeedKeyset.db.test.ts
 * Trước bản vá: lọc `id < cursor` nhưng sắp theo createdAt ⇒ bài có createdAt lệch thứ tự id bị lặp/sót.
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { prisma } from '../config/database.js';
import { getFeed } from './social.service.js';

const RUN = process.env.WORK_DB_TEST === '1';

describe('feed keyset (createdAt, id)', { skip: !RUN }, () => {
  let authorId = 0;
  const ids: number[] = [];
  // createdAt cố ý KHÔNG theo thứ tự id, có cả hai bài trùng createdAt.
  const gio = ['2026-10-01T10:00:00Z', '2026-10-05T10:00:00Z', '2026-10-03T10:00:00Z', '2026-10-05T10:00:00Z',
    '2026-09-20T10:00:00Z', '2026-10-04T10:00:00Z', '2026-10-02T10:00:00Z'];

  before(async () => {
    const tag = `kst${Date.now()}`;
    const u = await prisma.user.create({ data: { username: tag, email: `${tag}@kiem.cuongthai.com`, password: 'x' } });
    authorId = u.id;
    for (const [i, g] of gio.entries()) {
      const p = await prisma.socialPost.create({ data: { authorId, content: `bai ${i}`, createdAt: new Date(g) } });
      ids.push(p.id);
    }
  });
  after(async () => {
    await prisma.socialPost.deleteMany({ where: { authorId } });
    await prisma.user.delete({ where: { id: authorId } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('cuộn từng trang 2 bài: đủ 7 bài, không lặp, đúng thứ tự (createdAt desc, id desc)', async () => {
    const mongDoi = ids
      .map((id, i) => ({ id, t: new Date(gio[i]).getTime() }))
      .sort((a, b) => b.t - a.t || b.id - a.id)
      .map((x) => x.id);
    const thay: number[] = [];
    let cursor: number | undefined;
    for (let trang = 0; trang < 10; trang++) {
      const r: any = await getFeed({ authorId, limit: 2, cursor });
      thay.push(...r.data.map((p: any) => p.id));
      if (!r.pagination.hasNextPage) break;
      cursor = r.pagination.nextCursor;
    }
    assert.deepEqual(thay, mongDoi);
    assert.equal(new Set(thay).size, 7);
  });
});
