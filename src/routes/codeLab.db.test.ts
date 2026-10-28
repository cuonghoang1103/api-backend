/**
 * Code Lab đợt 1 — lọc track nháp + lời giải tách khỏi payload đề + bộ luyện tập dưới video.
 * Qua HTTP thật trên Postgres cục bộ. Không có CSDL ⇒ TỰ BỎ QUA (cùng khuôn crm.db.test.ts).
 *   npx tsx --test src/routes/codeLab.db.test.ts
 * Nên chạy trên CSDL TẠM dựng bằng scripts/db-test-tu-migration.mjs (test tạo + xoá dữ liệu
 * thật; mọi thứ nằm dưới MỘT nhóm `cl<tag>` và xoá theo cascade của nhóm đó).
 */
import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { closeRedis } from '../config/redis.js';
import { errorHandler } from '../middleware/errorHandler.js';

async function coCsdl(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;
  try {
    await Promise.race([
      prisma.$queryRaw`SELECT 1 FROM "code_exercises" LIMIT 1`,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
    ]);
    return true;
  } catch {
    return false;
  }
}

const RUN = await coCsdl();
const tag = `cl${Date.now().toString(36)}`;
const userIds: number[] = [];
let groupId = 0;

type U = { id: number; token: string };

describe('Code Lab đợt 1 (HTTP + DB thật)', { skip: !RUN ? 'không có CSDL' : false }, () => {
  let base = '';
  let server: import('node:http').Server;
  let admin: U;
  let user: U;

  // id/slug các thứ dựng sẵn
  const ids = {
    pubTrack: 0, draftTrack: 0, pubEx: '', pubExId: 0, pubDraftEx: '', draftTrackEx: '', draftTrackExId: 0,
    pracEasyA: 0, pracSolvedId: 0,
  };

  async function mkUser(name: string, isAdmin: boolean): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign(
      { userId: u.id, username: u.username, email, roles: isAdmin ? ['ADMIN'] : [], roleVersion: Number(u.roleVersion ?? 0) },
      config.jwtSecret,
    );
    return { id: u.id, token };
  }

  async function call(u: U | null, path: string, method = 'GET', body?: unknown) {
    const res = await fetch(`${base}/api/v1/code-lab${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(u ? { Authorization: `Bearer ${u.token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, headers: res.headers };
  }

  let modSeq = 0;
  async function mkModule(trackId: number, slug: string, sortOrder = 0) {
    return prisma.codeModule.create({ data: { trackId, name: slug, slug, sortOrder: sortOrder || ++modSeq } });
  }
  let exSeq = 0;
  async function mkEx(
    moduleId: number, trackId: number,
    o: { difficulty?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT'; sortOrder?: number; status?: 'PUBLISHED' | 'DRAFT'; withSolution?: boolean } = {},
  ) {
    const slug = `${tag}-ex-${++exSeq}`;
    return prisma.codeExercise.create({
      data: {
        moduleId, trackId, slug, title: `${tag} exercise ${exSeq}`, language: 'javascript',
        difficulty: o.difficulty ?? 'EASY', sortOrder: o.sortOrder ?? 0, status: o.status ?? 'PUBLISHED',
        problemHtml: `<p>${tag} problem ${exSeq}</p>`,
        solutionCodeJson: o.withSolution ? [{ name: 'a.js', language: 'javascript', code: 'return 42' }] : [],
        solutionExplanationHtml: o.withSolution ? '<p>because</p>' : null,
        aiExplanationJson: o.withSolution ? [{ type: 'prose', text: 'ai' }] : undefined,
      },
    });
  }

  before(async () => {
    const { default: router } = await import('./codeLab.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/code-lab', router);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    admin = await mkUser('admin', true);
    user = await mkUser('user', false);

    const g = await prisma.codeGroup.create({ data: { name: `${tag} group`, slug: `${tag}-group` } });
    groupId = g.id;
    const pub = await prisma.codeTrack.create({ data: { groupId, name: `${tag} pub`, slug: `${tag}-pub`, language: 'javascript', status: 'PUBLISHED' } });
    const draft = await prisma.codeTrack.create({ data: { groupId, name: `${tag} draft`, slug: `${tag}-draft`, language: 'javascript', status: 'DRAFT' } });
    ids.pubTrack = pub.id; ids.draftTrack = draft.id;
    const mp = await mkModule(pub.id, 'm1');
    const md = await mkModule(draft.id, 'm1');
    const e1 = await mkEx(mp.id, pub.id, { withSolution: true });
    const e2 = await mkEx(mp.id, pub.id, { status: 'DRAFT' });
    const e3 = await mkEx(md.id, draft.id, { withSolution: true });
    ids.pubEx = e1.slug; ids.pubExId = e1.id; ids.pubDraftEx = e2.slug; ids.draftTrackEx = e3.slug; ids.draftTrackExId = e3.id;

    // Track luyện tập theo quy ước `<khoá>-practice` (khoá `${tag}c` không nằm trong bảng nối).
    const prac = await prisma.codeTrack.create({ data: { groupId, name: `${tag} practice`, slug: `${tag}c-practice`, language: 'javascript', status: 'PUBLISHED' } });
    const lesson = await mkModule(prac.id, `${tag}-3-3-flexbox`, 30);
    await mkEx(lesson.id, prac.id, { difficulty: 'HARD', sortOrder: 0 });
    await mkEx(lesson.id, prac.id, { difficulty: 'EASY', sortOrder: 5 });
    await mkEx(lesson.id, prac.id, { difficulty: 'MEDIUM', sortOrder: 1 });
    const easyA = await mkEx(lesson.id, prac.id, { difficulty: 'EASY', sortOrder: 1 });
    await mkEx(lesson.id, prac.id, { difficulty: 'EASY', sortOrder: 0, status: 'DRAFT' });
    ids.pracEasyA = easyA.id; ids.pracSolvedId = easyA.id;
    // hai module cùng chương 3 cho bài slide `${tag}-3-0-slides`
    const c1 = await mkModule(prac.id, `${tag}-3-1-css-basics`, 10);
    const c2 = await mkModule(prac.id, `${tag}-3-2-box-model`, 20);
    await mkEx(c2.id, prac.id, { difficulty: 'EASY' });
    await mkEx(c1.id, prac.id, { difficulty: 'MEDIUM' });
    await mkEx(c1.id, prac.id, { difficulty: 'EASY' });

    // Track luyện tập NHÁP của khoá `${tag}d`.
    const pracDraft = await prisma.codeTrack.create({ data: { groupId, name: `${tag} practice draft`, slug: `${tag}d-practice`, language: 'javascript', status: 'DRAFT' } });
    const dl = await mkModule(pracDraft.id, `${tag}-1-1-x`);
    await mkEx(dl.id, pracDraft.id, { difficulty: 'MEDIUM' });

    // Track gợi ý "html-css" cho phép thử goiY — chỉ dựng khi CSDL chưa có (CSDL tạm), trong nhóm test ⇒ xoá theo cascade.
    const html = await prisma.codeTrack.findUnique({ where: { slug: 'html-css' } });
    if (!html) {
      const h = await prisma.codeTrack.create({ data: { groupId, name: 'HTML & CSS', slug: 'html-css', language: 'html', status: 'PUBLISHED' } });
      const hm = await mkModule(h.id, 'html-intro', 1);
      await mkEx(hm.id, h.id, { difficulty: 'MEDIUM' });
      for (let i = 0; i < 4; i++) await mkEx(hm.id, h.id, { difficulty: 'EASY', sortOrder: i });
    }
  });

  after(async () => {
    server?.close();
    if (groupId) await prisma.codeGroup.delete({ where: { id: groupId } }).catch(() => {});
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect().catch(() => {});
    await closeRedis().catch(() => {});
  });

  it('/stats chỉ đếm track PUBLISHED + bài PUBLISHED trong track PUBLISHED', async () => {
    const r = await call(null, '/stats');
    assert.equal(r.status, 200);
    const pubTracks = await prisma.codeTrack.count({ where: { status: 'PUBLISHED' } });
    const pubEx = await prisma.codeExercise.count({ where: { status: 'PUBLISHED', track: { status: 'PUBLISHED' } } });
    const pubMods = await prisma.codeModule.count({ where: { track: { status: 'PUBLISHED' } } });
    assert.equal(r.data.tracks, pubTracks);
    assert.equal(r.data.exercises, pubEx);
    assert.equal(r.data.modules, pubMods);
    assert.ok(r.data.exercises < (await prisma.codeExercise.count()), 'bài của track nháp không được đếm');
    const sumDiff = (r.data.byDifficulty as Array<{ _count: number }>).reduce((n, x) => n + x._count, 0);
    assert.equal(sumDiff, pubEx, 'byDifficulty cùng phạm vi');
  });

  it('/search + /exercises + /autocomplete: khách không thấy bài của track nháp, admin thấy; danh sách không mang lời giải', async () => {
    const anon = await call(null, `/search?q=${tag}&limit=100`);
    assert.equal(anon.status, 200);
    const slugs = (anon.data.exercises as any[]).map((e) => e.slug);
    assert.ok(slugs.includes(ids.pubEx));
    assert.ok(!slugs.includes(ids.draftTrackEx), 'bài track nháp lọt vào search');
    assert.ok(!slugs.includes(ids.pubDraftEx));
    for (const e of anon.data.exercises as any[]) {
      assert.equal('solutionCodeJson' in e, false);
      assert.equal('aiExplanationJson' in e, false);
    }
    const adm = await call(admin, `/search?q=${tag}&limit=100`);
    assert.ok((adm.data.exercises as any[]).some((e) => e.slug === ids.draftTrackEx), 'admin phải thấy bài track nháp');
    const usr = await call(user, `/search?q=${tag}&limit=100`);
    assert.ok(!(usr.data.exercises as any[]).some((e) => e.slug === ids.draftTrackEx), 'người dùng thường không thấy');

    assert.equal((await call(null, `/exercises?trackId=${ids.draftTrack}`)).data.total, 0);
    assert.equal((await call(admin, `/exercises?trackId=${ids.draftTrack}`)).data.total, 1);
    const listPub = await call(null, `/exercises?trackId=${ids.pubTrack}`);
    assert.equal(listPub.data.total, 1);
    assert.equal('solutionCodeJson' in listPub.data.exercises[0], false);

    const ac = await call(null, `/autocomplete?q=${tag}&limit=50`);
    const acSlugs = (ac.data.exercises as any[]).map((e) => e.slug);
    assert.ok(!acSlugs.includes(ids.draftTrackEx), 'autocomplete lộ bài track nháp');
  });

  it('/exercises/:slug: bài thuộc track nháp ⇒ 404 cho khách & người dùng, 200 cho admin', async () => {
    assert.equal((await call(null, `/exercises/${ids.draftTrackEx}`)).status, 404);
    assert.equal((await call(user, `/exercises/${ids.draftTrackEx}`)).status, 404);
    assert.equal((await call(admin, `/exercises/${ids.draftTrackEx}`)).status, 200);
    assert.equal((await call(null, `/exercises/${ids.pubDraftEx}`)).status, 404);
  });

  it('lời giải: khách không nhận trong payload đề; người đăng nhập vẫn nhận (tương thích app desktop) + endpoint riêng', async () => {
    const anon = await call(null, `/exercises/${ids.pubEx}`);
    assert.equal(anon.status, 200);
    assert.equal('solutionCodeJson' in anon.data, false);
    assert.equal('solutionExplanationHtml' in anon.data, false);
    assert.equal('aiExplanationJson' in anon.data, false);
    assert.equal(anon.data.hasSolution, true);
    assert.equal(anon.data.solutionLocked, true);
    assert.ok(anon.data.problemHtml.includes(tag));

    const signed = await call(user, `/exercises/${ids.pubEx}`);
    assert.equal(signed.data.solutionCodeJson[0].code, 'return 42');
    assert.equal(signed.data.solutionLocked, false);
    assert.equal('aiExplanationJson' in signed.data, false);

    assert.equal((await call(null, `/exercises/${ids.pubExId}/solution`)).status, 401);
    const sol = await call(user, `/exercises/${ids.pubExId}/solution`);
    assert.equal(sol.status, 200);
    assert.equal(sol.data.solutionCodeJson[0].code, 'return 42');
    assert.equal(sol.data.solutionExplanationHtml, '<p>because</p>');
    assert.equal((await call(user, `/exercises/${ids.draftTrackExId}/solution`)).status, 404);
    assert.equal((await call(admin, `/exercises/${ids.draftTrackExId}/solution`)).status, 200);
  });

  it('/tracks/:slug + /groups: track nháp 404 cho khách; số bài trên thẻ track chỉ đếm bài PUBLISHED', async () => {
    assert.equal((await call(null, `/tracks/${tag}-draft`)).status, 404);
    assert.equal((await call(admin, `/tracks/${tag}-draft`)).status, 200);
    assert.equal((await call(null, `/tracks/${tag}-draft/skills`)).status, 404);
    const groups = await call(null, '/groups');
    const g = (groups.data as any[]).find((x) => x.id === groupId);
    const t = g.tracks.find((x: any) => x.slug === `${tag}-pub`);
    assert.equal(t.exerciseCount, 1, 'bài DRAFT trong track công khai không được đếm');
    assert.ok(!g.tracks.some((x: any) => x.slug === `${tag}-draft`));
    const gAdmin = (await call(admin, '/groups')).data.find((x: any) => x.id === groupId);
    assert.equal(gAdmin.tracks.find((x: any) => x.slug === `${tag}-pub`).exerciseCount, 2);
  });

  it('/practice: bộ của bài sắp EASY→MEDIUM→HARD, bỏ bài nháp, có số liệu', async () => {
    const r = await call(null, `/practice/${tag}c/${tag}-3-3-flexbox`);
    assert.equal(r.status, 200);
    assert.match(r.headers.get('cache-control') || '', /public/);
    const d = r.data;
    assert.equal(d.trackSlug, `${tag}c-practice`);
    assert.equal(d.scope, 'lesson');
    assert.deepEqual(d.moduleSlugs, [`${tag}-3-3-flexbox`]);
    assert.equal(d.dangSoan, false);
    assert.equal(d.coBoLuyen, true);
    assert.equal(d.total, 4);
    assert.deepEqual(d.items.map((i: any) => i.difficulty), ['EASY', 'EASY', 'MEDIUM', 'HARD']);
    assert.equal(d.items[0].id, ids.pracEasyA, 'hoà độ khó ⇒ sortOrder nhỏ trước');
    assert.deepEqual(d.byDifficulty, { EASY: 2, MEDIUM: 1, HARD: 1, EXPERT: 0 });
    assert.equal(d.estimatedMinutes, 40);
    assert.equal(d.solvedCount, null);
    assert.equal('solved' in d.items[0], false);
  });

  it('/practice: đã đăng nhập ⇒ có solved + solvedCount, không cache chung', async () => {
    const p = await call(user, `/exercises/${ids.pracSolvedId}/progress`, 'POST', { status: 'SOLVED' });
    assert.equal(p.status, 200);
    const r = await call(user, `/practice/${tag}c/${tag}-3-3-flexbox`);
    assert.equal(r.data.solvedCount, 1);
    assert.equal(r.data.items.find((i: any) => i.id === ids.pracSolvedId).solved, true);
    assert.match(r.headers.get('cache-control') || '', /private/);
  });

  it('/practice: bài slide N.0 gộp cả chương; bài chưa có bộ ⇒ 200 dangSoan', async () => {
    const ch = await call(null, `/practice/${tag}c/${tag}-3-0-slides`);
    assert.equal(ch.data.scope, 'chapter');
    assert.deepEqual(ch.data.moduleSlugs, [`${tag}-3-1-css-basics`, `${tag}-3-2-box-model`, `${tag}-3-3-flexbox`]);
    assert.deepEqual(ch.data.items.map((i: any) => i.difficulty), ['EASY', 'EASY', 'EASY', 'EASY', 'MEDIUM', 'MEDIUM', 'HARD']);
    // cùng EASY: module sortOrder 10 (css-basics) trước 20 (box-model) trước 30 (flexbox)
    assert.deepEqual(ch.data.items.slice(0, 4).map((i: any) => i.moduleSlug), [`${tag}-3-1-css-basics`, `${tag}-3-2-box-model`, `${tag}-3-3-flexbox`, `${tag}-3-3-flexbox`]);

    const none = await call(null, `/practice/${tag}c/${tag}-9-9-chua-co`);
    assert.equal(none.status, 200);
    assert.deepEqual(none.data.items, []);
    assert.equal(none.data.dangSoan, true);
    assert.equal(none.data.coBoLuyen, true, 'track luyện tập tồn tại ⇒ khoá vẫn trong chương trình');
  });

  it('/practice: track luyện tập NHÁP ẩn với khách, admin duyệt được (banNhap)', async () => {
    const anon = await call(null, `/practice/${tag}d/${tag}-1-1-x`);
    assert.equal(anon.status, 200);
    assert.equal(anon.data.dangSoan, true);
    assert.equal(anon.data.coBoLuyen, false);
    assert.equal(anon.data.trackName, null);
    const adm = await call(admin, `/practice/${tag}d/${tag}-1-1-x`);
    assert.equal(adm.data.total, 1);
    assert.equal(adm.data.banNhap, true);
  });

  it('/practice: khoá trong bảng nối mà bài chưa có bộ ⇒ coBoLuyen + gợi ý track gần nhất (3 bài EASY)', async () => {
    const r = await call(null, `/practice/web-foundations/${tag}-x`);
    // `${tag}-x` không có số chương ⇒ fallback html-css
    assert.equal(r.status, 200);
    assert.equal(r.data.trackSlug, 'web-foundations-practice');
    assert.equal(r.data.coBoLuyen, true);
    if (r.data.items.length === 0) {
      assert.equal(r.data.dangSoan, true);
      assert.equal(r.data.goiY?.trackSlug, 'html-css');
      assert.ok(r.data.goiY.items.length <= 3);
      for (const it of r.data.goiY.items) assert.equal(it.difficulty, 'EASY');
      // Nút "luyện tạm" trỏ MỘT bài học (module của bài gợi ý đầu), không về cả track.
      if (r.data.goiY.items.length) {
        assert.equal(r.data.goiY.moduleSlug, r.data.goiY.items[0].moduleSlug);
        assert.ok(r.data.goiY.moduleSlug);
      }
    }
  });

  it('/practice: slug lạ ⇒ 400', async () => {
    assert.equal((await call(null, `/practice/${tag}c/a%20b`)).status, 400);
    assert.equal((await call(null, `/practice/-bad/${tag}-1`)).status, 400);
  });

  // Assignment CodeLearn (28/10/2026): testsJson.loiGiaiSauKhiDat / khoiDauSauKhiDat — lời giải mở sau lượt Nộp
  // đạt 100% (SOLVED), starter (= lời giải bước trước) mở khi đã SOLVED module trước.
  it('đề "mở sau khi đạt": giấu lời giải + khoá starter tới khi SOLVED; admin luôn thấy đủ', async () => {
    const truoc = await mkModule(ids.pubTrack, `${tag}-15-1-prev`);
    const nay = await mkModule(ids.pubTrack, `${tag}-15-2-cur`);
    const exTruoc = await mkEx(truoc.id, ids.pubTrack, { withSolution: true });
    const ex = await prisma.codeExercise.create({
      data: {
        moduleId: nay.id, trackId: ids.pubTrack, slug: `${tag}-gate`, title: `${tag} gate`, language: 'javascript', difficulty: 'HARD',
        status: 'PUBLISHED', problemHtml: `<p>${tag} gate</p>`,
        starterCodeJson: [{ name: 'src/App.js', language: 'javascript', code: 'lời giải bước trước' }],
        solutionCodeJson: [{ name: 'src/App.js', language: 'javascript', code: 'lời giải bước này' }],
        solutionExplanationHtml: '<p>vì sao</p>',
        testsJson: { loai: 'react', kiem: [{ kiem: 'ton-tai', selector: '#x' }], loiGiaiSauKhiDat: true, khoiDauSauKhiDat: truoc.slug },
        gradeKind: 'react',
      },
    });
    const loiGiaiApi = async (u: U) => {
      const res = await fetch(`${base}/api/v1/code-lab/exercises/${ex.id}/solution`, { headers: { Authorization: `Bearer ${u.token}` } });
      return { status: res.status, body: (await res.json()) as any };
    };

    // chưa đạt gì
    const a = await call(user, `/exercises/${ex.slug}`);
    assert.equal(a.status, 200);
    assert.equal('solutionCodeJson' in a.data, false);
    assert.equal('solutionExplanationHtml' in a.data, false);
    assert.equal(a.data.solutionGate, 'accepted');
    assert.equal(a.data.hasSolution, true);
    assert.equal(a.data.starterCodeJson[0].name, 'README.md');
    assert.deepEqual(a.data.starterGate, { moduleSlug: truoc.slug });
    const s1 = await loiGiaiApi(user);
    assert.equal(s1.status, 403);
    assert.equal(s1.body.code, 'CODELAB_LOI_GIAI_CAN_DAT');
    // khách: cũng không có starter thật
    const anon = await call(null, `/exercises/${ex.slug}`);
    assert.equal(anon.data.starterCodeJson[0].name, 'README.md');
    // admin: đủ
    const adm = await call(admin, `/exercises/${ex.slug}`);
    assert.equal(adm.data.solutionCodeJson[0].code, 'lời giải bước này');
    assert.equal(adm.data.starterCodeJson[0].code, 'lời giải bước trước');
    assert.equal((await loiGiaiApi(admin)).status, 200);

    // đạt bước trước ⇒ starter thật, lời giải vẫn khoá
    await prisma.codeProgress.create({ data: { userId: user.id, exerciseId: exTruoc.id, status: 'SOLVED', solvedAt: new Date() } });
    const b = await call(user, `/exercises/${ex.slug}`);
    assert.equal(b.data.starterCodeJson[0].code, 'lời giải bước trước');
    assert.equal('starterGate' in b.data, false);
    assert.equal(b.data.solutionGate, 'accepted');

    // IN_PROGRESS chưa đủ; SOLVED (lượt Nộp đạt 100%) ⇒ mở lời giải
    await prisma.codeProgress.create({ data: { userId: user.id, exerciseId: ex.id, status: 'IN_PROGRESS' } });
    assert.equal((await loiGiaiApi(user)).status, 403);
    await prisma.codeProgress.update({ where: { uk_code_progress_user_exercise: { userId: user.id, exerciseId: ex.id } }, data: { status: 'SOLVED', solvedAt: new Date() } });
    const c = await call(user, `/exercises/${ex.slug}`);
    assert.equal(c.data.solutionCodeJson[0].code, 'lời giải bước này');
    assert.equal('solutionGate' in c.data, false);
    const s2 = await loiGiaiApi(user);
    assert.equal(s2.status, 200);
    assert.equal(s2.body.data.solutionCodeJson[0].code, 'lời giải bước này');
  });
});
