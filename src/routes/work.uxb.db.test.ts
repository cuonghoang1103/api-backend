/**
 * UX-B — báo cáo dòng chảy + KPI + dashboard "Project overview" qua HTTP thật trên Postgres cục bộ:
 *   WORK_DB_TEST=1 npx tsx --test src/routes/work.uxb.db.test.ts
 *
 * Dữ liệu DỰNG TAY, đáp án tính trên giấy (D(k) = 12:00 trưa giờ VN ngày T−k):
 *   A  3 điểm · tạo D6 · To Do→In Progress D5 · →Done D3 · version V
 *   B  5 điểm · tạo D5 · To Do→In Progress D4 (đang làm) · version V
 *   C  2 điểm · tạo D4 · To Do
 *   E  1 điểm · tạo D10 · →In Progress D9 · →Done D2
 *   F  4 điểm · tạo D6 · To Do · gắn V lúc tạo, GỠ khỏi V lúc D3
 *   Epic (tạo D5) — không thuộc phạm vi dòng chảy.
 *   CFD (theo nhóm To Do / In progress / Done, 7 ngày T−6…T):
 *     T−6: 2/1/0 (A,F · E)   T−5: 2/2/0 (B,F · A,E)   T−4: 2/3/0 (C,F · A,B,E)
 *     T−3: 2/2/1 (C,F · B,E · A)   T−2…T: 2/1/2 (C,F · B · A,E)
 *   Cycle: A 2 ngày, E 7 ngày ⇒ P50 4.5 · P85 6.3 · P95 6.8. Lead: A 3, E 8 ⇒ P50 5.5 · P85 7.3 · P95 7.8.
 *   Release V theo điểm: T−6 7/0 · T−5,T−4 12/0 · T−3…T 8/3.
 * Sau đó: dự án ~400 thẻ (cỡ LFD) ⇒ mỗi tuyến dưới 300 ms (in số đo).
 */

import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import { after, before, describe, it } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../config/env.js';
import { prisma } from '../config/database.js';
import { errorHandler } from '../middleware/errorHandler.js';
import { emailService } from '../services/email.service.js';
import { addDays, dayKey } from '../services/work/contribRules.js';

const RUN = process.env.WORK_DB_TEST === '1';
const tag = `ux${Date.now().toString(36)}`;
const userIds: number[] = [];
const wsIds: number[] = [];
type U = { id: number; token: string; email: string };

describe('UX-B — CFD, cycle time, throughput, aging WIP, release burnup, KPI, dashboard overview (HTTP + DB thật)', { skip: !RUN }, () => {
  let base = '';
  let server: import('node:http').Server;
  let owner: U, outsider: U;
  let wsId = 0, pid = 0, versionId = 0;
  const T = dayKey(new Date(), 'Asia/Ho_Chi_Minh');
  /** 12:00 trưa giờ VN ngày T−k (= 05:00Z). */
  const D = (k: number) => new Date(`${addDays(T, -k)}T05:00:00Z`);
  const ids: Record<string, number> = {};

  async function mkUser(name: string): Promise<U> {
    const email = `${tag}_${name}@test.local`;
    const u = await prisma.user.create({ data: { username: `${tag}_${name}`, email } });
    userIds.push(u.id);
    const token = jwt.sign({ userId: u.id, username: u.username, email, roles: [], roleVersion: Number(u.roleVersion ?? 0) }, config.jwtSecret);
    return { id: u.id, token, email };
  }
  async function call(u: U, method: string, path: string, body?: unknown) {
    const res = await fetch(`${base}/api/v1/work${path}`, {
      method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${u.token}` },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as any;
    return { status: res.status, data: json.data, raw: json };
  }

  before(async () => {
    (emailService as any).send = async () => ({ success: true });
    const { default: workRoutes } = await import('./work.routes.js');
    const app = express();
    app.use(express.json());
    app.use('/api/v1/work', workRoutes);
    app.use(errorHandler);
    server = app.listen(0);
    base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
    owner = await mkUser('owner');
    outsider = await mkUser('outsider');
  });

  after(async () => {
    server?.close();
    if (wsIds.length) await prisma.workSpace.deleteMany({ where: { id: { in: wsIds } } });
    if (userIds.length) {
      await prisma.socialNotification.deleteMany({ where: { OR: [{ receiverId: { in: userIds } }, { senderId: { in: userIds } }] } });
      await prisma.workEmailQueue.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    }
    await prisma.$disconnect();
  });

  let todo = 0, wip = 0, done = 0;
  let cats: Map<string, string>;

  it('dự án mới có sẵn dashboard "Project overview"; nút tạo lại trả đúng cái đó', async () => {
    wsId = (await call(owner, 'POST', '/workspaces', { name: `UXB ${tag}` })).data.id;
    wsIds.push(wsId);
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'UXB', name: 'UX-B Demo', template: 'BLANK', type: 'SCRUM' });
    assert.equal(p.status, 201, JSON.stringify(p.raw));
    pid = p.data.id;
    const list = (await call(owner, 'GET', `/projects/${pid}/dashboards`)).data;
    assert.equal(list.length, 1);
    assert.equal(list[0].name, 'Project overview');
    assert.equal(list[0].shared, true);
    assert.deepEqual(list[0].widgets.map((w: any) => w.kind), ['kpis', 'burndown', 'cfd', 'throughput', 'workload', 'overdue', 'created_resolved']);
    assert.ok(list[0].widgets.every((w: any) => w.title === '' && w.id));
    const again = await call(owner, 'POST', `/projects/${pid}/dashboards/overview`);
    assert.equal(again.status, 201);
    assert.equal(again.data.id, list[0].id);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/dashboards`)).data.length, 1);
    // Widget mới lưu được vào dashboard tuỳ chỉnh.
    const custom = await call(owner, 'POST', `/projects/${pid}/dashboards`, {
      name: 'Flow', widgets: [{ kind: 'cfd', days: 14 }, { kind: 'cycle_time' }, { kind: 'aging_wip' }, { kind: 'velocity' }, { kind: 'release_burnup', versionId: null }, { kind: 'kpis', size: 'full' }],
    });
    assert.equal(custom.status, 201, JSON.stringify(custom.raw));
    // Người ngoài: 404.
    assert.equal((await call(outsider, 'GET', `/projects/${pid}/reports/cfd`)).status, 404);
  });

  it('dựng dữ liệu biết trước đáp án', async () => {
    const statuses = await prisma.workStatus.findMany({ where: { workflow: { projectId: pid, isDefault: true } }, orderBy: { position: 'asc' }, select: { id: true, category: true } });
    cats = new Map(statuses.map((s) => [`s${s.id}`, s.category]));
    todo = statuses.find((s) => s.category === 'TODO')!.id;
    wip = statuses.find((s) => s.category === 'IN_PROGRESS')!.id;
    done = statuses.find((s) => s.category === 'DONE')!.id;
    const v = await call(owner, 'POST', `/projects/${pid}/versions`, { name: 'v1.0', startDate: addDays(T, -6), releaseDate: addDays(T, 4) });
    assert.equal(v.status, 201, JSON.stringify(v.raw));
    versionId = v.data.id;

    const mk = async (key: string, typeKey = 'TASK') => {
      const r = await call(owner, 'POST', `/projects/${pid}/issues`, { title: `Issue ${key}`, typeKey });
      assert.equal(r.status, 201, JSON.stringify(r.raw));
      ids[key] = r.data.id;
      // Lịch sử do API ghi (created…) bỏ đi để đáp án chỉ phụ thuộc dữ liệu dựng tay.
      await prisma.workHistory.deleteMany({ where: { issueId: r.data.id, field: { in: ['statusId', 'fixVersionId'] } } });
      return r.data.id as number;
    };
    const hist = (issueId: number, field: string, from: number | null, to: number | null, at: Date) =>
      prisma.workHistory.create({ data: { issueId, actorId: owner.id, actorKind: 'USER', field, fromValue: from === null ? null : String(from), toValue: to === null ? null : String(to), createdAt: at } });

    const a = await mk('A');
    await prisma.workIssue.update({ where: { id: a }, data: { createdAt: D(6), resolvedAt: D(3), statusId: done, storyPoints: 3, fixVersionId: versionId } });
    await hist(a, 'statusId', todo, wip, D(5));
    await hist(a, 'statusId', wip, done, D(3));
    const b = await mk('B');
    await prisma.workIssue.update({ where: { id: b }, data: { createdAt: D(5), statusId: wip, storyPoints: 5, fixVersionId: versionId, assigneeId: owner.id } });
    await hist(b, 'statusId', todo, wip, D(4));
    const c = await mk('C');
    await prisma.workIssue.update({ where: { id: c }, data: { createdAt: D(4), statusId: todo, storyPoints: 2 } });
    const e = await mk('E');
    await prisma.workIssue.update({ where: { id: e }, data: { createdAt: D(10), resolvedAt: D(2), statusId: done, storyPoints: 1 } });
    await hist(e, 'statusId', todo, wip, D(9));
    await hist(e, 'statusId', wip, done, D(2));
    const f = await mk('F');
    await prisma.workIssue.update({ where: { id: f }, data: { createdAt: D(6), statusId: todo, storyPoints: 4, fixVersionId: null } });
    await hist(f, 'fixVersionId', versionId, null, D(3));
    const ep = await mk('EPIC', 'EPIC');
    await prisma.workIssue.update({ where: { id: ep }, data: { createdAt: D(5), statusId: wip } });
  });

  /** Gộp các dải theo nhóm trạng thái: [To Do, In progress, Done]. */
  const byCat = (p: any) => {
    const out = { TODO: 0, IN_PROGRESS: 0, DONE: 0 } as Record<string, number>;
    for (const [k, v] of Object.entries(p)) if (k !== 'day') out[cats.get(k) ?? 'TODO'] += v as number;
    return [out.TODO, out.IN_PROGRESS, out.DONE];
  };

  it('CFD 7 ngày: đúng đáp án tay theo nhóm', async () => {
    const r = await call(owner, 'GET', `/projects/${pid}/reports/cfd?days=7`);
    assert.equal(r.status, 200, JSON.stringify(r.raw));
    assert.equal(r.data.points.length, 7);
    assert.deepEqual(r.data.points.map((p: any) => p.day), Array.from({ length: 7 }, (_, k) => addDays(T, k - 6)));
    assert.deepEqual(r.data.points.map(byCat), [[2, 1, 0], [2, 2, 0], [2, 3, 0], [2, 2, 1], [2, 1, 2], [2, 1, 2], [2, 1, 2]]);
    assert.ok(r.data.bands.length >= 3);
    assert.match(r.data.scope, /Epics, sub-tasks and test cases are left out/);
  });

  it('cycle / lead time + phân vị', async () => {
    const r = (await call(owner, 'GET', `/projects/${pid}/reports/cycle-time?days=30`)).data;
    assert.deepEqual(r.items.map((x: any) => [x.number, x.cycleDays, x.leadDays]).sort((p: any, q: any) => p[1] - q[1]).map((x: any) => x.slice(1)), [[2, 3], [7, 8]]);
    assert.deepEqual(r.cycle, { n: 2, p50: 4.5, p85: 6.3, p95: 6.8, mean: 4.5 });
    assert.deepEqual(r.lead, { n: 2, p50: 5.5, p85: 7.3, p95: 7.8, mean: 5.5 });
  });

  it('throughput 4 tuần: A (T−3) và E (T−2) rơi đúng tuần', async () => {
    const r = (await call(owner, 'GET', `/projects/${pid}/reports/throughput?weeks=4`)).data;
    assert.equal(r.weeks.length, 4);
    assert.equal(r.weeks.reduce((s: number, w: any) => s + w.count, 0), 2);
    assert.equal(r.weeks.reduce((s: number, w: any) => s + w.points, 0), 4);
    // Thứ Hai của tuần chứa ngày d — tính độc lập ở đây.
    const monday = (d: string) => { const wd = new Date(`${d}T00:00:00Z`).getUTCDay(); return addDays(d, -((wd + 6) % 7)); };
    const want = new Map<string, number>();
    for (const d of [addDays(T, -3), addDays(T, -2)]) want.set(monday(d), (want.get(monday(d)) ?? 0) + 1);
    for (const w of r.weeks) assert.equal(w.count, want.get(w.week) ?? 0, w.week);
    assert.equal(r.weeks[3].week, monday(T));
  });

  it('aging WIP: chỉ B (đang làm từ D4); mốc tham chiếu là cycle P85', async () => {
    const r = (await call(owner, 'GET', `/projects/${pid}/reports/aging-wip`)).data;
    assert.deepEqual(r.items.map((x: any) => x.issueId), [ids.B]);
    const expect = Math.round(((Date.now() - D(4).getTime()) / 86_400_000) * 10) / 10;
    assert.ok(Math.abs(r.items[0].ageDays - expect) <= 0.1, `${r.items[0].ageDays} ~ ${expect}`);
    assert.equal(r.reference.p85, 6.3);
  });

  it('release burnup theo điểm: phạm vi/xong đúng đáp án tay, có đường lý tưởng', async () => {
    const r = (await call(owner, 'GET', `/projects/${pid}/reports/release-burnup?versionId=${versionId}`)).data;
    assert.equal(r.byCount, false);
    assert.deepEqual(r.points.map((p: any) => [p.scope, p.done]), [[7, 0], [12, 0], [12, 0], [8, 3], [8, 3], [8, 3], [8, 3]]);
    assert.equal(r.points[0].ideal, 7);
    assert.equal(r.points.at(-1).ideal !== null, true);
    const byCount = (await call(owner, 'GET', `/projects/${pid}/reports/release-burnup?versionId=${versionId}&by=count`)).data;
    assert.deepEqual(byCount.points.map((p: any) => [p.scope, p.done]), [[2, 0], [3, 0], [3, 0], [2, 1], [2, 1], [2, 1], [2, 1]]);
    assert.equal((await call(owner, 'GET', `/projects/${pid}/reports/release-burnup?versionId=999999999`)).status, 404);
  });

  it('KPI: open có xu hướng 7 ngày; tải theo người', async () => {
    const k = (await call(owner, 'GET', `/projects/${pid}/reports/kpis`)).data;
    // Bây giờ mở: B, C, F, Epic = 4. Bảy ngày trước: E (tạo D10, xong D2) = 1.
    assert.deepEqual(k.open, { value: 4, previous: 1 });
    assert.equal(k.blocked.previous, null);
    const l = (await call(owner, 'GET', `/projects/${pid}/reports/load-by-person`)).data;
    const mine = l.people.find((p: any) => p.user?.id === owner.id);
    assert.deepEqual([mine.inProgress, mine.todo, mine.estimate], [1, 0, 5]);
  });

  it('velocity có đường trung bình trượt 3 sprint', async () => {
    for (const [k, n] of [[30, 10], [20, 20], [10, 30]] as const) {
      await prisma.workSprint.create({ data: { projectId: pid, name: `S-${n}`, state: 'CLOSED', startAt: D(k + 7), endAt: D(k), completedAt: D(k), committedPoints: n, completedPoints: n } });
    }
    const v = (await call(owner, 'GET', `/projects/${pid}/reports/velocity`)).data;
    const mine = v.sprints.filter((s: any) => s.name.startsWith('S-'));
    assert.deepEqual(mine.map((s: any) => s.rollingAverage), [10, 15, 20]);
  });

  it('hiệu năng: dự án ~400 thẻ (cỡ LFD), mỗi tuyến < 300 ms', async () => {
    const p = await call(owner, 'POST', `/workspaces/${wsId}/projects`, { key: 'PERF', name: 'Perf', template: 'BLANK', type: 'SCRUM' });
    const ppid = p.data.id;
    const st = await prisma.workStatus.findMany({ where: { workflow: { projectId: ppid, isDefault: true } }, orderBy: { position: 'asc' }, select: { id: true, category: true } });
    const t0 = st.find((s) => s.category === 'TODO')!.id, t1 = st.find((s) => s.category === 'IN_PROGRESS')!.id, t2 = st.find((s) => s.category === 'DONE')!.id;
    const type = await prisma.workIssueType.findFirstOrThrow({ where: { projectId: ppid, level: 0 }, select: { id: true } });
    const ver = await prisma.workVersion.create({ data: { projectId: ppid, name: 'perf', startDate: new Date(`${addDays(T, -60)}T00:00:00Z`), releaseDate: new Date(`${addDays(T, 20)}T00:00:00Z`) } });
    const N = 400;
    await prisma.workIssue.createMany({
      data: Array.from({ length: N }, (_, i) => {
        const k = 90 - (i % 90);
        const fate = i % 3; // 0 xong · 1 đang làm · 2 chưa làm
        return {
          projectId: ppid, number: i + 1, typeId: type.id, statusId: fate === 0 ? t2 : fate === 1 ? t1 : t0, title: `Perf ${i}`, rank: `r${String(i).padStart(5, '0')}`,
          createdAt: D(k), resolvedAt: fate === 0 ? D(Math.max(0, k - 5)) : null, storyPoints: (i % 5) + 1, fixVersionId: i % 2 ? ver.id : null,
        };
      }),
    });
    const issues = await prisma.workIssue.findMany({ where: { projectId: ppid }, select: { id: true, number: true, createdAt: true } });
    const rows: any[] = [];
    for (const it of issues) {
      const fate = (it.number - 1) % 3;
      if (fate === 2) continue;
      const k0 = it.createdAt.getTime();
      rows.push({ issueId: it.id, actorId: owner.id, actorKind: 'USER', field: 'statusId', fromValue: String(t0), toValue: String(t1), createdAt: new Date(k0 + 86_400_000) });
      rows.push({ issueId: it.id, actorId: owner.id, actorKind: 'USER', field: 'statusId', fromValue: String(t1), toValue: String(t0), createdAt: new Date(k0 + 2 * 86_400_000) });
      rows.push({ issueId: it.id, actorId: owner.id, actorKind: 'USER', field: 'statusId', fromValue: String(t0), toValue: String(t1), createdAt: new Date(k0 + 3 * 86_400_000) });
      if (fate === 0) rows.push({ issueId: it.id, actorId: owner.id, actorKind: 'USER', field: 'statusId', fromValue: String(t1), toValue: String(t2), createdAt: new Date(k0 + 5 * 86_400_000) });
    }
    await prisma.workHistory.createMany({ data: rows });
    const routes = [
      '/reports/cfd?days=90', '/reports/cycle-time?days=90', '/reports/throughput?weeks=12', '/reports/aging-wip',
      `/reports/release-burnup?versionId=${ver.id}`, '/reports/kpis', '/reports/load-by-person', '/reports/velocity',
    ];
    const times: Record<string, number> = {};
    for (const r of routes) {
      await call(owner, 'GET', `/projects/${ppid}${r}`); // làm ấm (kết nối, cache truy vấn)
      const t = performance.now();
      const res = await call(owner, 'GET', `/projects/${ppid}${r}`);
      times[r] = Math.round(performance.now() - t);
      assert.equal(res.status, 200, `${r} ${JSON.stringify(res.raw).slice(0, 200)}`);
    }
    console.log(`  ⏱ UX-B trên ${N} thẻ + ${rows.length} dòng lịch sử:`, JSON.stringify(times));
    for (const [r, ms] of Object.entries(times)) assert.ok(ms < 300, `${r} mất ${ms} ms (trần 300)`);
    const c = (await call(owner, 'GET', `/projects/${ppid}/reports/cfd?days=90`)).data;
    // Tổng cuối khoảng = số thẻ (mọi thẻ tạo trong 90 ngày).
    const last = c.points.at(-1);
    assert.equal(Object.entries(last).filter(([k]) => k !== 'day').reduce((s, [, v]) => s + (v as number), 0), N);
  });
});
